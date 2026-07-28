import json
import os

class StudentPlanner:
    def __init__(self, filename="planner_data.json"):
        self.filename = filename
        self.tasks = self.load_data()

    def load_data(self):
        """Load tasks from a JSON file if it exists."""
        if os.path.exists(self.filename):
            with open(self.filename, "r") as file:
                try:
                    return json.load(file)
                except json.JSONDecodeError:
                    return []
        return []

    def save_data(self):
        """Save current tasks to the JSON file."""
        with open(self.filename, "w") as file:
            json.dump(self.tasks, file, indent=4)

    def add_task(self, title, deadline, course):
        """Add a new assignment or task."""
        task = {
            "title": title,
            "deadline": deadline,
            "course": course,
            "completed": False
        }
        self.tasks.append(task)
        self.save_data()
        print(f"✅ Task '{title}' added successfully!")

    def view_tasks(self):
        """Display all tasks."""
        if not self.tasks:
            print("📭 No tasks found in your planner.")
            return
        
        print("\n--- YOUR TASKS ---")
        for index, task in enumerate(self.tasks, start=1):
            status_text = "Completed" if task["completed"] else "Pending"
            print(f"{index}. [{status_text}] {task['title']} ({task['course']}) - Due: {task['deadline']}")
        print("-" * 20)

    def mark_completed(self, index):
        """Mark a specific task as completed."""
        if 0 <= index < len(self.tasks):
            self.tasks[index]["completed"] = True
            self.save_data()
            print(f"🎉 Task '{self.tasks[index]['title']}' marked as completed!")
        else:
            print("⚠️ Invalid task number.")

def main():
    planner = StudentPlanner()
    
    while True:
        print("\n=== STUDENT PLANNER ===")
        print("1. View Tasks")
        print("2. Add Task")
        print("3. Mark Task as Completed")
        print("4. Exit")
        
        choice = input("Choose an option (1-4): ").strip()
        
        if choice == "1":
            planner.view_tasks()
        elif choice == "2":
            title = input("Enter task/assignment title: ")
            deadline = input("Enter deadline (e.g., YYYY-MM-DD): ")
            course = input("Enter course name: ")
            planner.add_task(title, deadline, course)
        elif choice == "3":
            planner.view_tasks()
            try:
                idx = int(input("Enter task number to mark complete: ")) - 1
                planner.mark_completed(idx)
            except ValueError:
                print("⚠️ Please enter a valid number.")
        elif choice == "4":
            print("👋 Goodbye! Keep crushing your goals.")
            break
        else:
            print("⚠️ Invalid choice. Please select between 1 and 4.")

if __name__ == "__main__":
    main()