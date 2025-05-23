# 📚 Course Recommender System

This project is an intelligent Course Recommender System built using Natural Language Processing (NLP) techniques. It recommends the most relevant online courses based on a user's skills, interests, goals, and preferences. It uses TF-IDF vectorization and sentence embeddings with FAISS indexing to deliver fast and accurate recommendations by calculating both keyword-based and semantic similarity scores.

## 🚀 Features

- Recommends top courses based on user input
- Hybrid scoring using:
  - TF-IDF Vectorization (keyword-based similarity)
  - Sentence Embeddings (semantic similarity using Sentence-BERT)
- Fast search using FAISS indexing
- Normalized scores and custom weighting for better personalization
- Flask backend with a simple `/recommend` API endpoint
- CORS enabled for frontend integration

## 🧠 Tech Stack

- Python
- Flask
- Pandas & NumPy
- Scikit-learn (TF-IDF, MinMaxScaler)
- SentenceTransformers (BERT-based embeddings)
- FAISS (Facebook AI Similarity Search)

## 🛠 How It Works

1. **User Input:** Collects user preferences like skills, goals, interests, etc.
2. **Text Embedding:** Converts input and course data into vector form using:
   - TF-IDF for prerequisite matching
   - BERT sentence embeddings for course titles & descriptions
3. **Similarity Matching:**
   - TF-IDF similarity using cosine similarity
   - Embedding similarity using FAISS (L2 distance)
4. **Hybrid Score Calculation:**
   - Combines both scores (70% TF-IDF, 30% BERT embeddings)
   - Returns the top 5 recommended courses

## 🧪 Run Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/course-recommender-system.git
   cd course-recommender-system
   ```
2. Install dependencies:
   ```bash
    pip install -r requirements.txt
    ```
3. Make sure your test_data.csv file is in the root directory.
4. Run the app:
   ```bash
   python app.py
   ```
## 📦 API Endpoint
  ```
  POST /recommend
  ```
  Send a JSON object with fields like:
  ```json
  {
  "skills": "machine learning, python",
  "proficiency": "intermediate",
  "languages": "English",
  "learning_goal": "build ML projects",
  "interests": "AI, Data Science",
  "course_duration": "2 months",
  "previous_courses": "Intro to Python",
  "free_or_paid": "free",
  "learning_mode": "self-paced",
  "weekly_hours": "5"
}
```
Returns a list of top 5 recommended courses with details.
## 📝 License
MIT License
