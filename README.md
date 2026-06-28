# Student Performance Tracker

A full-stack web application to track and visualize student academic performance using Flask, SQLite, and Chart.js.

---

## Live Demo

(https://student-performance-tracker-8m50.onrender.com)

---

## Short Description

Student Performance Tracker is a data visualization web app that allows users to monitor student academic performance through interactive charts. Users can add new student records and instantly see updated visualizations across three different chart types.

---

## Features

- **Bar Chart** — Compare exam scores across all students
- **Scatter Plot** — Visualize correlation between study hours and scores
- **Pie Chart** — View score distribution by performance group (Fail / Average / Good / Excellent)
- **Add Students** — Add new records instantly with live chart updates
- **Dark / Light Mode** — Toggle theme with preference saved across sessions
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Student Count** — Live counter of total students

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Charts | Chart.js |
| Backend | Python, Flask |
| Database | SQLite |
| Deployment | Render |

---

## Project Structure

```
student_Performance_Tracker/
├── app.py              ← Flask backend + API routes
├── index.html          ← Frontend structure
├── style.css           ← Styling + dark/light mode
├── script.js           ← Chart logic + API calls
├── requirements.txt    ← Python dependencies
└── .gitignore          ← Ignored files
```

---

## Run Locally

**1. Clone the repository**
```bash
git clone https://github.com/Areeba-fatima-z/student_Performance_Tracker.git
cd student_Performance_Tracker
```

**2. Install dependencies**
```bash
pip install -r requirements.txt
```

**3. Run the Flask server**
```bash
python app.py
```

**4. Open in browser**
```
http://localhost:5000
```

---

## Variables Tracked

| Variable | Type | Description |
|----------|------|-------------|
| Name | Text | Student's full name |
| Study Hours | Decimal | Daily study hours |
| Score | Decimal | Exam score out of 100 |

---

##  Developer

**Areeba Fatima**
BS Computer Science => FAST-NUCES CFD Campus

---

## License

This project is open source and available under the [MIT License](LICENSE).