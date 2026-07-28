import streamlit as st
import json
import os
import pandas as pd
from datetime import datetime, date

FILENAME = "planner_data.json"

def load_data():
    if os.path.exists(FILENAME):
        with open(FILENAME, "r") as file:
            try:
                return json.load(file)
            except json.JSONDecodeError:
                return []
    return []

def save_data(tasks):
    with open(FILENAME, "w") as file:
        json.dump(tasks, file, indent=4)

st.title("🎓 My Student Planner")
st.write("Welcome to your personal web-based task manager built with Python!")

tasks = load_data()

# --- FEATURE 3: THEME TOGGLE (Sidebar Settings) ---
st.sidebar.header("⚙️ Settings & Theme")
theme_mode = st.sidebar.radio("Appearance Theme", ["Light Mode", "Dark Mode"], horizontal=True)

# Custom CSS styling based on theme choice
if theme_mode == "Dark Mode":
    st.markdown("""
        <style>
        .stApp {
            background-color: #0e1117;
            color: #ffffff;
        }
        </style>
    """, unsafe_allow_html=True)

st.sidebar.divider()

# --- SIDEBAR: ADD A NEW TASK ---
st.sidebar.header("Add New Task")
with st.sidebar.form("task_form"):
    title = st.text_input("Task Title")
    deadline = st.date_input("Deadline")
    course = st.text_input("Course Name")
    
    # --- FEATURE 2: CATEGORY TAGGING ---
    category = st.selectbox("Task Category", ["Homework", "Exam", "Project", "Lab", "Reading"])
    
    priority = st.selectbox("Priority Level", ["High", "Medium", "Low"], index=1)
    
    submit_button = st.form_submit_button("Add Task")

    if submit_button:
        if title and course:
            new_task = {
                "title": title,
                "deadline": str(deadline),
                "course": course,
                "category": category, # Save category
                "priority": priority,
                "completed": False
            }
            tasks.append(new_task)
            save_data(tasks)
            st.sidebar.success(f"Task '{title}' added successfully!")
            st.rerun()
        else:
            st.sidebar.error("Please fill in both the title and course fields.")

# --- BULK ACTIONS & EXPORT ---
st.sidebar.divider()
st.sidebar.subheader("Quick Actions & Export")

if st.sidebar.button("🧹 Clear Completed Tasks"):
    tasks = [t for t in tasks if not t["completed"]]
    save_data(tasks)
    st.rerun()

if st.sidebar.button("🗑️ Delete All Tasks"):
    tasks = []
    save_data(tasks)
    st.rerun()

# --- FEATURE 1: EXPORT TASKS TO CSV ---
if tasks:
    df_export = pd.DataFrame(tasks)
    csv_data = df_export.to_csv(index=False).encode('utf-8')
    st.sidebar.download_button(
        label="📥 Download Tasks (CSV)",
        data=csv_data,
        file_name="my_student_planner.csv",
        mime="text/csv",
    )

# --- MAIN PAGE: STATISTICS & PROGRESS BAR ---
st.subheader("📋 Your Tasks")

if tasks:
    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t["completed"])
    progress = completed_tasks / total_tasks if total_tasks > 0 else 0
    
    st.progress(progress)
    st.caption(f"📊 Overall Progress: {completed_tasks} of {total_tasks} tasks completed ({int(progress * 100)}%)")
    st.divider()

if not tasks:
    st.info("No tasks found yet. Add one using the sidebar!")
else:
    search_query = st.text_input("🔍 Search tasks by title or course:", "").lower()
    filter_option = st.radio("Filter View:", ["All", "Pending", "Completed"], horizontal=True)
    st.divider()

    displayed_count = 0
    today = date.today()

    for index, task in enumerate(tasks):
        if search_query and search_query not in task["title"].lower() and search_query not in task["course"].lower():
            continue

        if filter_option == "Pending" and task["completed"]:
            continue
        if filter_option == "Completed" and not task["completed"]:
            continue

        displayed_count += 1

        col1, col2, col3 = st.columns([0.6, 0.3, 0.1])
        
        with col1:
            status_symbol = "✅" if task["completed"] else "📌"
            
            task_priority = task.get("priority", "Medium")
            if task_priority == "High":
                priority_badge = "🔴 High"
            elif task_priority == "Medium":
                priority_badge = "🟡 Medium"
            else:
                priority_badge = "🟢 Low"

            # Fallback for old tasks that might not have a category yet
            task_category = task.get("category", "Homework")

            deadline_date = datetime.strptime(task["deadline"], "%Y-%m-%d").date()
            days_left = (deadline_date - today).days
            
            if task["completed"]:
                countdown_text = "✨ Completed"
            elif days_left < 0:
                countdown_text = f"🚨 Overdue by {abs(days_left)} days!"
            elif days_left == 0:
                countdown_text = "⚠️ Due TODAY!"
            elif days_left == 1:
                countdown_text = "⏰ Due tomorrow"
            else:
                countdown_text = f"⏳ Due in {days_left} days"

            st.markdown(f"**{status_symbol} {task['title']}** ({task['course']}) — *[{task_category}]*  \n*Deadline: {task['deadline']}* ({countdown_text}) | Priority: **{priority_badge}**")
            
        with col2:
            completed_status = st.checkbox("Completed", value=task["completed"], key=f"check_{index}")
            if completed_status != task["completed"]:
                tasks[index]["completed"] = completed_status
                save_data(tasks)
                st.rerun()
                
        with col3:
            if st.button("❌", key=f"delete_{index}"):
                tasks.pop(index)
                save_data(tasks)
                st.rerun()

    if displayed_count == 0:
        st.warning("No tasks match your search or filter criteria.")