import React, {useState} from 'react';
import s from './mainScreen.module.css'

import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebase from "firebase/compat/app";
import {useCollection} from "react-firebase-hooks/firestore";
import List from "./List";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

function MainScreen({app}) {
    //db setup
    const auth = firebase.auth(app)
    const db = firebase.firestore(app)

    const listsRef = db.collection('lists')
    const query = listsRef.where('uid', '==', auth.currentUser.uid)
    const sortByIndex = (a, b) => {
        return a.data().index - b.data().index
    }
    // const maxIndexQuery = listsRef.where('maxIndex', '>=', 0)

    const [lists] = useCollection(query, {idField: 'id'})
    // const [maxIndex] = useCollection(maxIndexQuery)
    // const MAX_INDEX_ID = 'ERC5LXqmZKMX7hNiKMRK'

    const [isNewList, setIsNewList] = useState(false)
    const [newListName, setNewListName] = useState('')

    //db add/delete/update functions
    //lists
    const [maxIndex, setMaxIndex] = useState(+localStorage.getItem('maxIndex') + 1 || 0)
    const addList = (listName) => {
        if (listName !== '') {
            setIsNewList(false)
            db.collection("lists").add({
                index: maxIndex,
                uid: auth.currentUser.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                name: listName,
                tasks: [],
            })
                .then(() => console.log('success!'))

            setNewListName('')
            setMaxIndex(maxIndex + 1)
            localStorage.setItem('maxIndex', maxIndex.toString())
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

    //tasks
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

    //dnd
    const onDragEnd = (result) => {
        if (!result.destination) return
        const oldIndexes = lists.docs.sort(sortByIndex).map(list => list.data().index)
        const newIndexes = reorder(
            oldIndexes,
            result.source.index,
            result.destination.index
        )
        // console.log(result)
        // console.log(oldIndexes)
        // console.log(newIndexes)

        // for (let i = 0; i < lists.docs.length; i++) {
        //     console.log(lists.docs[i].data().index)
        //     console.log(newIndexes[i])
        //     if (lists.docs[i].data().index !== newIndexes[i]) {
        //         console.log(lists.docs[i].data().index)
        //         console.log(newIndexes[i])
        //         db.collection("lists").doc(lists.docs[i].id).update({index: newIndexes[i]})
        //     }
        // }

        lists.docs
            .sort(sortByIndex)
            .map((list, i) => {
                console.log(list.data().index + ' ' + list.data().name)
                console.log(newIndexes[i])
                if (list.data().index !== newIndexes[i]) {
                    db.collection("lists").doc(list.id).update({index: newIndexes[i]})
                        .then(() => console.log(list.data().index + ' ' + list.data().name))
                }
                return null
            })
    }
    const reorder = (oldIndexes, startIndex, endIndex) => {
        const result = Array.from(oldIndexes)
        const [removed] = result.splice(endIndex, 1)
        result.splice(startIndex, 0, removed)
        return result;
    }

    return (
        <>
            <div className={s.header}>
                <h3 className={s.greating}>Hi, {auth.currentUser.displayName}!</h3>
                <button className={s.signOut} onClick={() => auth.signOut()}>
                    Sign out
                </button>
            </div>
            <div className={s.container}>
                {auth.currentUser.photoURL &&
                    <img referrerPolicy="no-referrer" src={auth.currentUser.photoURL} alt="sign in"/>}
                <h2>Add a new task-list!</h2>
                {/*DRAG AND DROP*/}
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable" direction="horizontal">
                        {(provided, snapshot) => (
                            <div className={s.listsContainer}
                                 ref={provided.innerRef}
                                // style={getListStyle(snapshot.isDraggingOver)}
                                 {...provided.droppableProps}
                            >
                                {lists && lists.docs
                                    .sort((a, b) => a.data().index - b.data().index)
                                    .map((list, index) => (
                                        <Draggable key={list.id} draggableId={list.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    // style={{cursor: 'auto'}}
                                                    style={
                                                        // getItemStyle(
                                                        // snapshot.isDragging,
                                                        {
                                                            ...provided.draggableProps.style,
                                                            cursor: 'auto'
                                                        }
                                                        // )
                                                    }
                                                >
                                                    {list.data().index}
                                                    <List list={list}
                                                          deleteList={deleteList}
                                                          updateList={updateList}
                                                          addTask={addTask}
                                                          deleteTask={deleteTask}
                                                          updateTask={updateTask}
                                                    />
                                                </div>)}
                                        </Draggable>))}
                                {provided.placeholder}
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
                            </div>)}
                    </Droppable>
                </DragDropContext>
            </div>
        </>
    )
        ;
}

export default MainScreen;
