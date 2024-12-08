from flask import Flask, request, jsonify
import pandas as pd
from pymongo import MongoClient
import os

class RecommendationModel:
    def __init__(self, interaction_file: str, courses_file: str, mongo_uri: str, db_name: str):
        self.interaction_file = interaction_file
        self.courses_file = courses_file
        self.mongo_uri = mongo_uri
        self.db_name = db_name
        self.interaction = None
        self.courses = None
        self.client = MongoClient(self.mongo_uri)
        self.db = self.client[self.db_name]
    
    def load_data_from_mongo(self):
        # Query progress data
        progresses_collection = self.db['progresses']
        progresses_data = list(progresses_collection.find())
        print("Progress data fetched from MongoDB:", progresses_data)

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
        print("Interaction DataFrame:\n", interaction_df)
        print('here')
        interaction_df.to_csv(self.interaction_file, index=False)
        # Query course data
        courses_collection = self.db['courses']
        courses_data = list(courses_collection.find())
        print("Courses fetched from MongoDB:", courses_data)

        # Prepare course data
        course_data = []
        for course in courses_data:
            print("Processing course:", course)
            course_data.append({
                'course_id': str(course['_id']),
                'title': course.get('title', ''),
                'description': course.get('description', ''),
                'category': course.get('category', ''),
                'difficulty_level': course.get('difficultyLevel', ''),
                'created_by': str(course.get('createdBy', ''))
            })

        courses_df = pd.DataFrame(course_data)
        print("Courses DataFrame:\n", courses_df)
        courses_df.to_csv(self.courses_file, index=False)
        print(f"Course data written to {self.courses_file}")

    def load_data(self):
        # Ensure the file exists
        if not os.path.exists(self.interaction_file):
            raise FileNotFoundError(f"File not found: {self.interaction_file}")

        # Check if the file is not empty
        if os.stat(self.interaction_file).st_size == 0:
            raise ValueError(f"The file {self.interaction_file} is empty.")

        # Load interaction data from the CSV
        self.interaction = pd.read_csv(self.interaction_file)

        print("Loaded interaction data:\n", self.interaction)

        # Load course data
        self.courses = pd.read_csv(self.courses_file)

        print("Loaded courses data:\n", self.courses)

    def generate_course_similarity(self):
        # Generate course similarity matrix (dummy implementation for now)
        return pd.DataFrame()

    def recommend(self, user_id: str, top_n: int = 5):
        # Filter the interaction data for the given user_id
        user_data = self.interaction[self.interaction['user_id'] == user_id]
        if user_data.empty:
            return []

        # Sort user data by score
        user_data_sorted = user_data.sort_values(by='score', ascending=False)

        # Recommend top N courses
        recommendations = user_data_sorted['course_id'].head(top_n).tolist()

        return recommendations

# Flask app
app = Flask(__name__)

# Initialize the recommendation model
model = RecommendationModel(
    interaction_file="interaction_data.csv",
    courses_file="courses_data.csv",
    mongo_uri="mongodb://localhost:27017", 
    db_name="elearning-platform"  ,
    
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
        model.load_data()
        recommendations = model.recommend(user_id, top_n)
        return jsonify({"recommendations": recommendations})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000)
