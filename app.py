from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# In-memory storage for tasks and schedule
tasks = []
schedule = []

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/tasks', methods=['GET', 'POST'])
def handle_tasks():
    global tasks
    if request.method == 'POST':
        task_data = request.json
        tasks.append(task_data)
        return jsonify({"success": True, "tasks": tasks})
    return jsonify(tasks)

@app.route('/api/schedule', methods=['GET', 'POST'])
def handle_schedule():
    global schedule
    if request.method == 'POST':
        class_data = request.json
        schedule.append(class_data)
        return jsonify({"success": True, "schedule": schedule})
    return jsonify(schedule)

if __name__ == '__main__':
    app.run(debug=True)