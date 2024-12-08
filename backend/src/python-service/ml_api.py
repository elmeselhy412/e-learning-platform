from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer


class RecommendationModel:
    def __init__(self, interaction_file: str, courses_file: str):
        self.interaction_file = interaction_file
        self.courses_file = courses_file
        self.interaction = None
        self.courses = None

    def load_data(self):
        # Load user interactions and course data
        self.interaction = pd.read_csv(self.interaction_file)
        self.courses = pd.read_csv(self.courses_file)

    def generate_course_similarity(self):
        # Use course descriptions to calculate similarities
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(self.courses['description'])
        similarity_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)
        return similarity_matrix

    def recommend(self, user_id: str, top_n: int = 5):
        # Get user interactions
        user_data = self.interaction[self.interaction['user_id'] == user_id]
        if user_data.empty:
            return []

        # Calculate similarity scores for courses
        similarity_matrix = self.generate_course_similarity()

        # Find user's highest-rated courses
        user_courses = user_data.sort_values(by='score', ascending=False)['course_id'].values
        recommendations = set()

        for course_id in user_courses:
            course_idx = self.courses[self.courses['course_id'] == course_id].index[0]
            similar_indices = np.argsort(similarity_matrix[course_idx])[::-1]
            for idx in similar_indices[:top_n]:
                recommendations.add(self.courses.iloc[idx]['course_id'])

        # Exclude already interacted courses
        recommendations = [rec for rec in recommendations if rec not in user_courses]
        return recommendations[:top_n]


# Flask app
app = Flask(__name__)

# Initialize the recommendation model
model = RecommendationModel(
    interaction_file="interaction_data.csv",
    courses_file="courses_data.csv"
)
model.load_data()


@app.route("/recommend", methods=["POST"])
def recommend():
    # Extract user_id from the request
    data = request.json
    user_id = data.get("user_id")
    top_n = data.get("top_n", 5)

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    # Get recommendations
    recommendations = model.recommend(user_id, top_n)
    return jsonify({"recommendations": recommendations})


if __name__ == "__main__":
    app.run(port=5000)
