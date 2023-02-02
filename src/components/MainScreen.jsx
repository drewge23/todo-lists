import React, {useEffect, useState} from 'react';
import './MainScreen.css'

import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebase from "firebase/compat/app";
import {useCollection} from "react-firebase-hooks/firestore";

function MainScreen({app}) {
    const auth = firebase.auth(app)
    const [photoURL, setPhotoURL] = useState(auth.currentUser.photoURL)
    const db = firebase.firestore(app)

    const listsRef = db.collection('lists')
    const query = listsRef.orderBy('name').limit(25)

    const [lists] = useCollection(query, {idField: 'id'})

    // useEffect(() => {
    //     db.collection("lists").get().then((querySnapshot) => {
    //         setData(querySnapshot.docs)
    //     });
    // }, [])

    const addList = (listName) => {
        const uid = auth.currentUser.uid

        db.collection("lists").add({
            uid,
            name: listName,
            tasks: [{
                name: "Lovelace",
                done: false,
                // createdAt: firebase.firestore.FieldValue.serverTimestamp()
                createdAt: new Date().getTime()
            }],
        })
            .then(() => console.log('success!'))
    }

    return (
        <div>
            <img referrerPolicy="no-referrer" src={photoURL} alt="sign in"/>
            <div>
                <h2>Add a new task-list!</h2>
                {lists && lists.docs.map(list => (<div key={list.id}>{list.data().name}</div>))}
                <button style={{
                    width: '300px',
                    height: '500px',
                    marginBottom: '20px'
                }}> +
                </button>
            </div>
            <div>
                <button type="button" onClick={() => auth.signOut()}>
                    sign out
                </button>
                <p>Click to sign out!</p>

                <label htmlFor="task">New task list name</label>
                <input type="text" name='task'/>
                <button type="button" onClick={() => addList(document.querySelector('input').value)}>
                    Add another Ada
                </button>
            </div>
        </div>
    );
}

export default MainScreen;