import React, {useEffect, useState} from 'react';
import s from './task.module.css'

function Task({task, deleteTask, updateTask}) {
    const [isEditMode, setIsEditMode] = useState(false)
    const [taskName, setTaskName] = useState(task.task)

    const updateTaskName = () => {
        const newTask = {
            task: taskName,
            isDone: task.isDone,
            createdAt: task.createdAt
        }
        updateTask(newTask)
        setIsEditMode(false)
    }

    useEffect(() => {
        setTaskName(task.task)
    }, [])

    return (
        <div className={s.task}>
            <input type="checkbox" checked={task.isDone}
                   className={s.checkbox}
                   onChange={(e) => {
                       const newTask = {
                           task: task.task,
                           isDone: e.target.checked,
                           createdAt: task.createdAt
                       }
                       updateTask(newTask)
                   }}/>
            {isEditMode
                ? <input type="text" value={taskName} autoFocus
                         className={s.textInput}
                         onChange={(e) => setTaskName(e.target.value)}
                         onBlur={() => {
                             updateTaskName()
                         }}
                         onKeyUp={(e) => {
                             if (e.key === 'Enter') {
                                 updateTaskName()
                             }
                         }}/>
                : <span className={task.isDone ? s.isDone : s.text} onDoubleClick={() => setIsEditMode(true)}>
                {task.task}
            </span>}
            <span onClick={deleteTask} className={s.cross}>
                🗑️
            </span>
        </div>
    )
}

export default Task;