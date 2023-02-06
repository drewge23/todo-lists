import './App.css';

import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import {useAuthState} from "react-firebase-hooks/auth";
import Auth from "./auth/Auth";
import MainScreen from "./components/MainScreen";
import ErrorBoundary from "./ErrorBoundary";

const firebaseConfig = {
    apiKey: "AIzaSyAAg4yrkWjbY_mcyIBaL97U8eJApu8Lq0M",
    authDomain: "todo-lists-db4d7.firebaseapp.com",
    projectId: "todo-lists-db4d7",
    storageBucket: "todo-lists-db4d7.appspot.com",
    messagingSenderId: "622002488770",
    appId: "1:622002488770:web:d36c9b9c9caff82ec5c25b",
    measurementId: "G-5LVS8YGBD5"
};

const app = firebase.initializeApp(firebaseConfig);

function App() {
    const auth = firebase.auth(app)
    const [user] = useAuthState(auth)

    return (
        <ErrorBoundary>
            <div className="App">
                <Auth app={app} user={user}/>
                {user && <MainScreen app={app}/>}
            </div>
        </ErrorBoundary>
    );
}

export default App;
