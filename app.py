from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import pandas as pd
import numpy as np
import pickle
from sklearn.linear_model import LinearRegression
import os

app = Flask(__name__)
CORS(app)

DB_PATH = "database.db"
MODEL_PATH = "model.pkl"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS water_data (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    inflow REAL,
                    rainfall REAL,
                    outflow REAL,
                    demand REAL,
                    date TEXT
                )''')
    conn.commit()
    conn.close()

init_db()

@app.route("/add", methods=["POST"])
def add_data():
    data = request.json
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO water_data (inflow, rainfall, outflow, demand, date) VALUES (?, ?, ?, ?, ?)",
              (data["inflow"], data["rainfall"], data["outflow"], data["demand"], data["date"]))
    conn.commit()
    conn.close()
    return jsonify({"message": "Data added successfully"})

@app.route("/data", methods=["GET"])
def get_data():
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql_query("SELECT * FROM water_data", conn)
    conn.close()
    return df.to_json(orient="records")

@app.route("/train", methods=["POST"])
def train_model():
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql_query("SELECT * FROM water_data", conn)
    conn.close()

    if df.empty:
        return jsonify({"error": "Not enough data to train"}), 400

    X = df[["inflow", "rainfall", "outflow"]]
    y = df["demand"]
    model = LinearRegression()
    model.fit(X, y)

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    return jsonify({"message": "Model trained successfully"})

@app.route("/predict", methods=["POST"])
def predict():
    if not os.path.exists(MODEL_PATH):
        return jsonify({"error": "Model not trained yet"}), 400

    data = request.json
    X_new = np.array([[data["inflow"], data["rainfall"], data["outflow"]]])
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    prediction = model.predict(X_new)[0]
    return jsonify({"predicted_demand": prediction})

if __name__ == "__main__":
    app.run(debug=True)
