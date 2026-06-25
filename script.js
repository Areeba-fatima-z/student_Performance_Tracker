let barChartInstance = null;
let scatterChartInstance = null;
let pieChartInstance = null;

const BASE_URL = 'https://student-performance-tracker-8m50.onrender.com';

async function fetch_render() {
    const response = await fetch(`${BASE_URL}/students`);
    const students = await response.json();

    document.getElementById('studentCount').textContent = students.length;
    renderCharts(students);
}

function getChartTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        textColor: isDark ? '#e8eaf6' : '#1a1a2e',
        mutedColor: isDark ? '#a0a8d0' : '#555577',
        gridColor: isDark ? '#2a2d4a' : '#e0e4f0',
    };
}

function renderCharts(students) {
    const theme = getChartTheme();
    const names = students.map(s => s.name);
    const study_hours = students.map(s => s.study_hours);
    const scores = students.map(s => s.score);
    if (barChartInstance) barChartInstance.destroy();
    if (scatterChartInstance) scatterChartInstance.destroy();
    if (pieChartInstance) pieChartInstance.destroy();


    barChartInstance = new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: 'Exam Score', data: scores, backgroundColor: 'rgba(67, 97, 238, 0.7)',
                borderColor: 'rgba(67, 97, 238, 1)', borderWidth: 1, borderRadius: 6,
            }]
        },
        options: {
            plugins: {
                title: { display: true, text: 'Student vs Score', color: theme.textColor, font: { size: 14, weight: '600' } },
                legend: { labels: { color: theme.textColor } }
            },
            scales: {
                x: { ticks: { color: theme.mutedColor }, grid: { color: theme.gridColor } },
                y: { beginAtZero: true, max: 100, ticks: { color: theme.mutedColor }, grid: { color: theme.gridColor } }
            }
        }
    });

    const scatterData = students.map(s => ({ x: s.study_hours, y: s.score }));
    scatterChartInstance = new Chart(document.getElementById('scatterChart'), {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Study Hours vs Exam Score', data: scatterData, backgroundColor: 'rgba(255, 99, 132, 0.7)',
                pointRadius: 7, pointHoverRadius: 9,
            }]
        },
        options: {
            plugins: {
                title: { display: true, text: 'Study Hours vs Score', color: theme.textColor, font: { size: 14, weight: '600' } },
                legend: { labels: { color: theme.textColor } }
            },
            scales: {
                x: { title: { display: true, text: 'Study Hours', color: theme.mutedColor }, ticks: { color: theme.mutedColor }, grid: { color: theme.gridColor } },
                y: { title: { display: true, text: 'Score', color: theme.mutedColor }, max: 100, ticks: { color: theme.mutedColor }, grid: { color: theme.gridColor } }
            }
        }
    });


    const scoreGroups = { 'Fail (0-50)': 0, 'Average (51-70)': 0, 'Good (71-85)': 0, 'Excellent (86-100)': 0 };

    students.forEach(s => {
        if (s.score <= 50) scoreGroups['Fail (0-50)']++;
        else if (s.score <= 70) scoreGroups['Average (51-70)']++;
        else if (s.score <= 85) scoreGroups['Good (71-85)']++;
        else scoreGroups['Excellent (86-100)']++;
    });

    pieChartInstance = new Chart(document.getElementById('pieChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(scoreGroups),
            datasets: [{
                data: Object.values(scoreGroups),
                backgroundColor: [
                    'rgba(255, 99,  132, 0.7)',
                    'rgba(255, 206, 86,  0.7)',
                    'rgba(54,  162, 235, 0.7)',
                    'rgba(75,  192, 192, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99,  132, 1)',
                    'rgba(255, 206, 86,  1)',
                    'rgba(54,  162, 235, 1)',
                    'rgba(75,  192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: { display: true, text: 'Score Distribution by Group', color: theme.textColor, font: { size: 14, weight: '600' } },
                legend: { position: 'bottom', labels: { color: theme.textColor, padding: 15 } }
            }
        }
    });
}



async function addStudent() {
    const name = document.getElementById('name').value.trim();
    const study_hours = parseFloat(document.getElementById('study_hours').value);
    const score = parseFloat(document.getElementById('score').value);
    const age = parseInt(document.getElementById('age').value);

    if (!name || isNaN(study_hours) || isNaN(score) || isNaN(age)) {
        alert('Please fill in all fields correctly.');
        return;
    }

    await fetch(`${BASE_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age, study_hours, score })
    });

    document.getElementById('name').value = '';
    document.getElementById('age').value = '';
    document.getElementById('study_hours').value = '';
    document.getElementById('score').value = '';

    fetch_render();
}

function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', newTheme);
    document.getElementById('themeIcon').textContent = isDark ? '🌙' : '☀️';
    document.getElementById('themeLabel').textContent = isDark ? 'Dark Mode' : 'Light Mode';

    fetch_render();
}


(function () {
    const saved = localStorage.getItem('theme') || 'light';
    if (saved === 'dark') {
        document.getElementById('themeIcon').textContent = '☀️';
        document.getElementById('themeLabel').textContent = 'Light Mode';
    }
})();


fetch_render();
