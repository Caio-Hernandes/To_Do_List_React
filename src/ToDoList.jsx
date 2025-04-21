import React, { useState, useEffect } from "react";
import TaskItem from "./components/TaskItem";
import TaskForm from "./components/TaskForm";
import EditForm from "./components/EditForm";
import { v4 as uuidv4 } from 'uuid';

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [taskType, setTaskType] = useState("");
    const [taskPriority, setTaskPriority] = useState("");
    const [taskTime, setTaskTime] = useState("");
    const [completedCount, setCompletedCount] = useState(0);
    const [newTask, setNewTask] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDark);
    }, [isDark]);

    function ThemeToggle() {
        return (
            <button onClick={() => setIsDark(!isDark)}>
                {isDark ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
            </button>
        );
    }

    useEffect(() => {
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function handleEditChange(event) {
        setEditValue(event.target.value);
    }

    function addTask() {
        if (newTask.trim() !== "") {
            const newTaskObj = {
                id: uuidv4(),
                name: newTask,
                completed: false,
                type: taskType,
                priority: taskPriority,
                time: taskTime, 
            };
            setTasks([...tasks, newTaskObj]);
            setNewTask("");
            setTaskType("");
            setTaskPriority("");
            setTaskTime("");
        }
    }

    function editTask(id) {
        const task = tasks.find((t) => t.id === id);
        setEditingId(id);
        setEditValue(task.name);
    }

    function removeTask(id) {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
    }

    function moveTaskUp(id) {
        const index = tasks.findIndex(task => task.id === id);
        if (index > 0) {
            const updatedTasks = [...tasks];
            const temp = updatedTasks[index];
            updatedTasks[index] = updatedTasks[index - 1];
            updatedTasks[index - 1] = temp;
            setTasks(updatedTasks);
        }
    }

    function moveTaskDown(id) {
        const index = tasks.findIndex(task => task.id === id);
        if (index < tasks.length - 1) {
            const updatedTasks = [...tasks];
            const temp = updatedTasks[index];
            updatedTasks[index] = updatedTasks[index + 1];
            updatedTasks[index + 1] = temp;
            setTasks(updatedTasks);
        }
    }

    function saveEdit() {
        const updatedTasks = tasks.map(task => {
            if (task.id === editingId) {
                return { ...task, name: editValue };
            }
            return task;
        });
        setTasks(updatedTasks);
        setEditingId(null);
        setEditValue("");
    }

    function cancelEdit() {
        setEditingId(null);
        setEditValue("");
    }

    function toggleTaskCompletion(id) {
        const updatedTasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        setTasks(updatedTasks);
    }

    useEffect(() => {
        const count = tasks.filter(task => task.completed).length;
        setCompletedCount(count);
    }, [tasks]);

    const [filterType, setFilterType] = useState("");
    const [filterPriority, setFilterPriority] = useState("");
    const [filterTime, setFilterTime] = useState("");

    const filteredTasks = tasks.filter(task => {
        const tiposFixos = ["Trabalho", "Estudo", "Lazer", "Pessoal"];

        const matchesType =
            filterType === "" ||
            (filterType === "Outros"
                ? !tiposFixos.includes(task.type)
                : task.type === filterType);

        const matchesPriority = filterPriority === "" || task.priority === filterPriority;
        const matchesTime = filterTime === "" || task.time === filterTime;
        return matchesType && matchesPriority && matchesTime;
    });

    const [sortOrder, setSortOrder] = useState("priority");

    const sortedTasks = filteredTasks.sort((a, b) => {
        if (sortOrder === "priority") {
            return a.priority.localeCompare(b.priority);
        } else if (sortOrder === "type") {
            return a.type.localeCompare(b.type);
        } else {
            return a.time.localeCompare(b.time);
        }
    });

    return (
        <div className="to-do-list">
            <h1>To Do List</h1>

            <ThemeToggle />

            <TaskForm
                newTask={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onSubmit={addTask}
                onTypeChange={(e) => setTaskType(e.target.value)}
                onPriorityChange={(e) => setTaskPriority(e.target.value)}
                onTimeChange={(e) => setTaskTime(e.target.value)}
            />

            <div className="filters">
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="Trabalho">Trabalho</option>
                    <option value="Estudo">Estudo</option>
                    <option value="Lazer">Lazer</option>
                    <option value="Pessoal">Pessoal</option>
                    <option value="Outros">Outros</option>
                </select>

                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                    <option value="">All Priorities</option>
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                </select>

                <input type="time" value={filterTime} onChange={(e) => setFilterTime(e.target.value)} />
            </div>

            <div>
                <label>Sort By: </label>
                <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="priority">Priority</option>
                    <option value="type">Type</option>
                    <option value="time">Time</option>
                </select>
            </div>

            <ul>
                {sortedTasks.map((task) => {
                    return editingId === task.id ? (
                        <EditForm
                            key={task.id}
                            editValue={editValue}
                            onChange={handleEditChange}
                            onSave={saveEdit}
                            onCancel={cancelEdit}
                        />
                    ) : (
                        <TaskItem
                            key={task.id}
                            task={task}
                            index={tasks.findIndex((t) => t.id === task.id)}
                            onRemove={() => removeTask(task.id)}
                            onEdit={() => editTask(task.id)}
                            onMoveUp={() => moveTaskUp(task.id)}
                            onMoveDown={() => moveTaskDown(task.id)}
                            onToggleCompletion={() => toggleTaskCompletion(task.id)}
                            isCompleted={task.completed}
                        />
                    );
                })}
            </ul>
        </div>
    );
}

export default ToDoList;