export default function TaskForm({ newTask, onChange, onSubmit, onTypeChange, onPriorityChange, onTimeChange }) {
    return (
        <div>
            <input
                type="text"
                className="task-input"
                placeholder="Enter a task..."
                value={newTask}
                onChange={onChange}
            />
            <input
                type="text"
                className="task-input"
                placeholder="Enter task type (e.g., Pessoal)"
                onChange={onTypeChange}
            />
            <input
                type="text"
                className="task-input"
                placeholder="Enter task priority (e.g., Alta)"
                onChange={onPriorityChange}
            /><br/>
           <div className="time-container">
                <label className="time-label">Time:</label>
                <input className="time-input"
                    type="time"
                    onChange={onTimeChange}
                />
            </div>
            <button className="add-button" onClick={onSubmit}>Add Task</button>
        </div>
    );
}

  
  