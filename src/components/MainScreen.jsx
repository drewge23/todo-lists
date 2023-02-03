import React, {useState} from 'react';
import s from './mainScreen.module.css'

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
            alert('List must have a name!')
        }
    }
    const deleteList = (id) => {
        if (window.confirm('Are you sure you want to delete the list? This action is irreversible'))
            db.collection("lists").doc(id).delete()
    }
    const updateList = (id, newName) => {
        if (newName !== '') {
            db.collection("lists").doc(id).update({name: newName})
        } else {
            alert('List must have a name!')
        }
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
    const updateTask = (task, listId, newTask) => {
        deleteTask(task, listId)
        db.collection("lists").doc(listId).update({
            tasks: firebase.firestore.FieldValue.arrayUnion(newTask)
        });
    }

    return (
        <div className={s.container}>
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
                <div className={s.listsContainer}>
                    {lists && lists.docs.map(list => <List key={list.id}
                                                           list={list}
                                                           deleteList={deleteList}
                                                           updateList={updateList}
                                                           addTask={addTask}
                                                           deleteTask={deleteTask}
                                                           updateTask={updateTask}
                    />)}
                    <div className={s.newListBtn}>
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
                                  className={s.plus}
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