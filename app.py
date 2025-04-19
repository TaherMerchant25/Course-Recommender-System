from flask import Flask, request, jsonify, render_template
import pandas as pd
import numpy as np
import faiss
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from flask_cors import CORS
from sklearn.preprocessing import MinMaxScaler

app = Flask(__name__)

CORS(app)  # Enable CORS for frontend integration

# Load dataset
courses_df = pd.read_csv("test_data.csv")

# TF-IDF Vectorization
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(courses_df["Prerequisites"])

# Sentence Embedding Model
model = SentenceTransformer("all-MiniLM-L6-v2")
course_texts = courses_df["course_title"] + " - " + courses_df["Prerequisites"]
course_embeddings = model.encode(course_texts.tolist())

# FAISS Index Setup
d = course_embeddings.shape[1]
faiss_index = faiss.IndexFlatL2(d)
faiss_index.add(np.array(course_embeddings))


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json
    # Combine all inputs into a single user query string
    user_text = " ".join([
        data.get('skills', ''),
        data.get('proficiency', ''),
        data.get('languages', ''),
        data.get('learning_goal', ''),
        data.get('interests', ''),
        data.get('course_duration', ''),
        data.get('previous_courses', ''),
        data.get('free_or_paid', ''),
        data.get('learning_mode', ''),
        data.get('weekly_hours', '')
    ])

    # Get user embedding
    user_embedding = model.encode([user_text])

    # TF-IDF Similarity Calculation
    user_tfidf_vector = tfidf_vectorizer.transform([user_text])
    tfidf_similarity_scores = cosine_similarity(user_tfidf_vector, tfidf_matrix)[0]

    # FAISS Similarity Calculation
    _, faiss_indices = faiss_index.search(user_embedding, 10)
    faiss_similarities = 1 / (1 + np.linalg.norm(course_embeddings[faiss_indices[0]], axis=1))

    # Normalize scores
    scaler = MinMaxScaler()
    tfidf_similarity_scores = scaler.fit_transform(tfidf_similarity_scores.reshape(-1, 1)).flatten()
    faiss_similarities = scaler.fit_transform(faiss_similarities.reshape(-1, 1)).flatten()

    # Hybrid Score Calculation
    final_scores = (0.7 * tfidf_similarity_scores[faiss_indices[0]]) + (0.3 * faiss_similarities)
    sorted_indices = np.argsort(final_scores)[::-1]

    # Get recommended courses and their details
    recommended_courses_indices = faiss_indices[0][sorted_indices]

    recommended_courses_details = courses_df.iloc[recommended_courses_indices][[
        "course_title",
        "course_rating",
        "course_organization",
        "course_students_enrolled",
        "course_Certificate_type",
        "Prerequisites"
    ]].to_dict(orient='records')

    # Handle None values
    for course in recommended_courses_details:
        if course['course_Certificate_type'] is None:
            course['course_Certificate_type'] = "COURSE"

    return jsonify({"recommendations": recommended_courses_details[:5]})


if __name__ == "__main__":
    app.run(debug=True, port=3000)
