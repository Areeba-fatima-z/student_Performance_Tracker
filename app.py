from flask import Flask,jsonify,request
from flask_cors import CORS
import sqlite3

#used for communication with frontend
app=Flask(__name__)
CORS(app)
@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('../frontend', filename)

#initialize database in start if it had nothing
def init_db():
    conn=sqlite3.connect('database.db')
    cursor=conn.cursor()

    cursor.execute('''Create Table IF NOT Exists students(
                   id integer primary key ,
                   name text not null,
                   age integer not null,
                   study_hours real not null,
                   score real not null )''')
    
    cursor.execute('select count(*) from students')
    count =cursor.fetchone()[0]

    if count==0:
        initial_data=[
            ('Areeba',19,5,89),
            ('Ayesha',20,3,75),
            ('Fatima',21,1.5,47),
            ('Zainab',18,2,63),
            ('Ali',22,7,95),
            ('Ahmed',18,4,80),
            ('Sara',19, 4, 78),
            ('Shahan',20,5.5,92),
            ('Hassan',22,3.5,70),
            ('Hira',19,2.5,60)
        ]
         
        cursor.executemany('Insert into students (name ,age,study_hours,score) values (?,?,?,?)',initial_data)
        
    conn.commit()
    conn.close()

# route to get all student from databse and return on json (frontend)
@app.route('/students',methods=['GET'])
def get_students():
    conn=sqlite3.connect('database.db')
    cursor=conn.cursor()

    cursor.execute('select *from students')
    rows=cursor.fetchall()
    conn.close()

    students=[]
    for row in rows:
        students.append({ 'id' : row[0],'name' : row[1],'age' : row[2],'study_hours' : row[3],'score' : row[4]})

    return jsonify(students)

#Route to get student data fro json (frontend) and insert in database
@app.route('/students',methods=['POST'])
def add_student():
    data =request.get_json() #get json from frontend

    name =data['name']
    age =data['age']
    study_hours =data ['study_hours']
    score =data['score']

    conn =sqlite3.connect('database.db')
    cursor =conn.cursor()
    cursor.execute(
        'Insert into students (name ,age,study_hours,score) values (?,?,?,?)',
        (name , age, study_hours,score))
    
    conn.commit()
    conn.close()

    return jsonify({'message' : 'Student added successfully'}),201

init_db()
if __name__ =='__main__' :
    app.run(debug=True,port=5000)


