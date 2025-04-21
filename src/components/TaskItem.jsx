export default function TaskItem({
    task,
    index,
    onRemove,
    onEdit,
    onMoveUp,
    onMoveDown,
    onToggleCompletion,
  }) {
    return (
      <li className={task.completed ? "completed" : ""}>
         <div className="task-info">
         {task.time && <small className="task-time">🕒 {task.time}</small>}
        <span>{task.name}</span>
      </div>
        <button onClick={() => onToggleCompletion(index)}>
          {task.completed ? "Unmark" : "Mark as Done"}
        </button>
        <button onClick={() => onRemove(index)}>Remove Task</button>
        <button onClick={() => onMoveUp(index)}>Move Up</button>
        <button onClick={() => onMoveDown(index)}>Move Down</button>
        <button onClick={() => onEdit(index)}>Edit Task</button>
      </li>
    );
  }
  