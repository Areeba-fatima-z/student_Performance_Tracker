from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH  = os.path.join(BASE_DIR, 'database.db')

app = Flask(__name__)
CORS(app)

def init_db():
    conn   = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT NOT NULL,
            age         INTEGER NOT NULL,
            study_hours REAL NOT NULL,
            score       REAL NOT NULL
        )
    ''')
    cursor.execute('SELECT COUNT(*) FROM students')
    count = cursor.fetchone()[0]
    if count == 0:
        initial_data = [
            ('Areeba', 19, 5,   89),
            ('Ayesha', 20, 3,   75),
            ('Fatima', 21, 1.5, 47),
            ('Zainab', 18, 2,   63),
            ('Ali',    22, 7,   95),
            ('Ahmed',  18, 4,   80),
            ('Sara',   19, 4,   78),
            ('Shahan', 20, 5.5, 92),
            ('Hassan', 22, 3.5, 70),
            ('Hira',   19, 2.5, 60)
        ]
        cursor.executemany(
            'INSERT INTO students (name, age, study_hours, score) VALUES (?, ?, ?, ?)',
            initial_data
        )
    conn.commit()
    conn.close()

@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory(BASE_DIR, filename)

@app.route('/students', methods=['GET'])
def get_students():
    conn   = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM students')
    rows   = cursor.fetchall()
    conn.close()
    students = []
    for row in rows:
        students.append({
            'id':          row[0],
            'name':        row[1],
            'age':         row[2],
            'study_hours': row[3],
            'score':       row[4]
        })
    return jsonify(students)

@app.route('/students', methods=['POST'])
def add_student():
    data        = request.get_json()
    name        = data['name']
    age         = data['age']
    study_hours = data['study_hours']
    score       = data['score']
    conn   = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO students (name, age, study_hours, score) VALUES (?, ?, ?, ?)',
        (name, age, study_hours, score)
    )
    conn.commit()
    conn.close()
    return jsonify({'message': 'Student added!'}), 201

init_db()

if __name__ == '__main__':
    app.run(debug=True, port=5000)