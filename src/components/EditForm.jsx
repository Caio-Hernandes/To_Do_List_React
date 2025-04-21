export default function EditForm({ editValue, onChange, onSave, onCancel }) {
    return (
      <div className="edit-task">
        <input
          type="text"
          value={editValue}
          onChange={onChange}
          placeholder="Edit your task"
        />
        <button onClick={onSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    );
  }
  