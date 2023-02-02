import React, {useState} from 'react';
import 'firebase/compat/firestore';
import firebase from "firebase/compat/app";

function List({list, deleteList, addTask, deleteTask}) {
    const [newTaskName, setNewTaskName] = useState('')
    return (
        <div>
            <div style={{
                width: '300px',
                height: '500px',
                borderRadius: '15px',
                outline: '4px dashed blue',
                outlineOffset: '-2px',

                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',

                position: 'relative'
            }}>
                <div style={{
                    width: '100%',
                    flexGrow: 0,
                    display: 'flex',
                }}>
                    <h3 style={{flexGrow: 1,}}>{list.data().name}</h3>
                    <button onClick={() => deleteList(list.id)}
                            style={{
                                justifySelf: 'flex-end',
                                position: 'absolute',
                                right: '10px',
                                top: '10px',
                                // border: '1px solid black'
                            }}
                    >🦝
                    </button>
                </div>

                <div style={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'aquamarine',

                    width: '100%',
                    borderRadius: '0 0 15px 15px',
                    // borderTop: '1px solid blue',
                }}>
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
                        : list.data().tasks.map((task, index) => (
                            <div key={index}>
                                <li>{task.task}
                                    <button onClick={() => deleteTask(task, list.id)}> x</button>
                                </li>
                            </div>))}
                </div>
            </div>
        </div>
    );
}

export default List;