import React, {useState} from 'react';
import './MainScreen.css'

import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebase from "firebase/compat/app";
import {useCollection} from "react-firebase-hooks/firestore";
import List from "./List";

function MainScreen({app}) {
    const auth = firebase.auth(app)
    const db = firebase.firestore(app)

    const listsRef = db.collection('lists')
    const query = listsRef.where('uid', '==', auth.currentUser.uid)

    const [lists] = useCollection(query, {idField: 'id'})

    const [isNewList, setIsNewList] = useState(false)
    const [newListName, setNewListName] = useState('')

    const addList = (listName) => {
        if (listName !== '') {
            setIsNewList(false)
            db.collection("lists").add({
                uid: auth.currentUser.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                name: listName,
                tasks: [],
            })
                .then(() => console.log('success!'))

            setNewListName('')
        } else {
            alert('list must have a name!')
        }
    }
    const deleteList = (id) => {
        db.collection("lists").doc(id).delete()
    }

    const addTask = (taskName, listId) => {
        if (taskName !== '') {
            const taskObj = {
                task: taskName,
                isDone: false,
                // createdAt: firebase.firestore.FieldValue.serverTimestamp()
                createdAt: new Date().getTime()
            }
            db.collection("lists").doc(listId).update({
                tasks: firebase.firestore.FieldValue.arrayUnion(taskObj)
            });
        }
    }
    const deleteTask = (task, listId) => {
        db.collection("lists").doc(listId).update({
            tasks: firebase.firestore.FieldValue.arrayRemove(task)
        });
    }

    return (
        <div style={{padding: '30px'}}>
            <div>
                <p>Hi, {auth.currentUser.displayName}!</p>
                <button type="button" onClick={() => auth.signOut()}>
                    Sign out
                </button>
            </div>
            {auth.currentUser.photoURL &&
                <img referrerPolicy="no-referrer" src={auth.currentUser.photoURL} alt="sign in"/>}
            <div>
                <h2>Add a new task-list!</h2>
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}>
                    {lists && lists.docs.map(list => <List key={list.id}
                                                           list={list}
                                                           deleteList={deleteList}
                                                           addTask={addTask}
                                                           deleteTask={deleteTask}
                    />)}
                    <div
                        style={{
                            width: '300px',
                            height: '500px',
                            borderRadius: '15px',
                            backgroundColor: 'lightcyan',
                            outline: '4px dotted red',
                            outlineOffset: '-2px',

                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {isNewList
                            ? <div>
                                <label htmlFor="listName">List name</label>
                                <input type='text' name='listName'
                                       value={newListName}
                                       onChange={(e) => setNewListName(e.target.value)}
                                       onKeyUp={(e) => {
                                           if (e.key === 'Enter') addList(newListName)
                                       }}
                                />
                                <button onClick={() => addList(newListName)}>let's go!</button>
                                <button onClick={() => setIsNewList(false)}>cansel</button>
                            </div>
                            : <h1 onClick={() => setIsNewList(true)}
                                  style={{fontSize: '36px', cursor: 'pointer'}}
                            > ➕ </h1>
                        }
                    </div>
                </div>
            </div>
            <div>
            </div>
        </div>
    );
}

export default MainScreen;