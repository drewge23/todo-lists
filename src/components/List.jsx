import React, {useState} from 'react';
import 'firebase/compat/firestore';
import s from './list.module.css'
import Task from "./Task";

function List({list, deleteList, updateList, addTask, deleteTask, updateTask}) {
    // const [tasks, setTasks] = useState(list.data().tasks)
    //useEffect(() => {
    // return () => {
    // update list doc with new task array
    //     }
    // }
    const [newTaskName, setNewTaskName] = useState('')
    const [isEditMode, setIsEditMode] = useState(false)
    const [listName, setListName] = useState(list.data().name)

    const taskSort = (a, b) => {
        return a.isDone - b.isDone || a.createdAt - b.createdAt
    }

    return (
        <div className={s.listContainer}>
            <div className={s.header}>
                {isEditMode
                    ? <input type="text" value={listName} autoFocus
                             className={s.nameInput}
                             onChange={(e) => setListName(e.target.value)}
                             onBlur={() => {
                                 updateList(list.id, listName)
                                 setIsEditMode(false)
                             }}
                             onKeyUp={(e) => {
                                 if (e.key === 'Enter') {
                                     updateList(list.id, listName)
                                     setIsEditMode(false)
                                 }
                             }}/>
                    : <h3 className={s.name}
                          onDoubleClick={() => setIsEditMode(true)}
                    >{list.data().name}</h3>}
                <button onClick={() => deleteList(list.id)}
                        className={s.racoonBtn}
                >🦝
                </button>
            </div>

            <div className={s.tasksContainer}>
                <div>
                    <input type="text" value={newTaskName}
                           onChange={(e) => setNewTaskName(e.target.value)}
                           onKeyUp={(e) => {
                               if (e.key === 'Enter') {
                                   addTask(newTaskName, list.id)
                                   setNewTaskName('')
                               }
                           }}/>
                </div>
                {list.tasks?.length === 0
                    ? <p>Enter your first task</p>
                    : list.data().tasks
                        .sort(taskSort)
                        .map((task, index) => (
                            <Task key={index}
                                  task={task}
                                  deleteTask={() => deleteTask(task, list.id)}
                                  updateTask={(newTask) => updateTask(task, list.id, newTask)}
                            />
                        ))}
            </div>
        </div>
    );
}

export default List;