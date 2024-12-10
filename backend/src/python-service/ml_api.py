from flask import Flask, request, jsonify
import pandas as pd
from pymongo import MongoClient

class RecommendationModel:
    def _init_(self, mongo_uri: str, db_name: str):
        self.mongo_uri = mongo_uri
        self.db_name = db_name
        self.client = MongoClient(self.mongo_uri)
        self.db = self.client[self.db_name]

    def load_data_from_mongo(self):
        # Query progress data
        progresses_collection = self.db['progresses']
        progresses_data = list(progresses_collection.find())

        # Prepare interaction data
        interaction_data = []
        for progress in progresses_data:
            user_id = str(progress['userId'])  # Convert ObjectId to string
            course_id = str(progress['courseId'])  # Convert ObjectId to string
            scores = progress.get('scores', [])
            for score_entry in scores:
                if isinstance(score_entry, int):
                    interaction_data.append({
                        'user_id': user_id,
                        'course_id': course_id,
                        'score': score_entry
                    })
                elif isinstance(score_entry, dict):
                    interaction_data.append({
                        'user_id': user_id,
                        'course_id': course_id,
                        'score': score_entry.get('score', 0)
                    })

        interaction_df = pd.DataFrame(interaction_data)

        # Query course data
        courses_collection = self.db['courses']
        courses_data = list(courses_collection.find())

        # Prepare course data
        course_data = []
        for course in courses_data:
            course_data.append({
                'course_id': str(course['_id']),
                'title': course.get('title', ''),
                'description': course.get('description', ''),
                'category': course.get('category', ''),
                'difficulty_level': course.get('difficultyLevel', ''),
                'created_by': str(course.get('createdBy', ''))
            })

        courses_df = pd.DataFrame(course_data)

        return interaction_df, courses_df

    def recommend(self, user_id: str, interaction_df: pd.DataFrame, top_n: int = 5):
        # Filter the interaction data for the given user_id
        user_data = interaction_df[interaction_df['user_id'] == user_id]
        if user_data.empty:
            return []

        # Sort user data by score
        user_data_sorted = user_data.sort_values(by='score', ascending=False)

        # Recommend top N courses
        recommendations = user_data_sorted['course_id'].head(top_n).tolist()

        return recommendations

# Flask app
app = Flask(_name_)

# Initialize the recommendation model
model = RecommendationModel(
    mongo_uri="mongodb://localhost:27017",
    db_name="elearning-platform"
)

@app.route("/recommend", methods=["POST"])
def recommend():
    # Extract user_id from the request
    data = request.json
    user_id = data.get("user_id")
    top_n = data.get("top_n", 5)

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    # Get recommendations
    try:
        interaction_df, _ = model.load_data_from_mongo()
        recommendations = model.recommend(user_id, interaction_df, top_n)
        return jsonify({"recommendations": recommendations})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if _name_ == "_main_":
    app.run(port=5000)