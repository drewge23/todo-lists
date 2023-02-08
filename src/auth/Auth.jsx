import React, {useEffect} from 'react';
import {EmailAuthProvider, GoogleAuthProvider,} from "firebase/auth";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui"
import {useAuthState} from "react-firebase-hooks/auth";
import './Auth.css'

function Auth({app}) {
    const firebaseAuth = firebase.auth(app)
    const [user] = useAuthState(firebaseAuth)

    useEffect(() => {
        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebaseAuth);

        const uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                    return true;
                },
                signInFailure: function (error) {
                    if (error.code !== 'firebaseui/anonymous-upgrade-merge-conflict') {
                        return Promise.resolve();
                    }
                    let cred = error.credential;
                    return firebaseAuth.signInWithCredential(cred);
                },
                uiShown: function () {
                    document.getElementById('loader').style.display = 'none';
                }
            },
            autoUpgradeAnonymousUsers: true,
            signInFlow: 'popup',
            signInSuccessUrl: '/',
            signInOptions: [
                GoogleAuthProvider.PROVIDER_ID,
                EmailAuthProvider.PROVIDER_ID,
            ],
            tosUrl: '',
            privacyPolicyUrl: ''
        };

        ui.start('#firebaseui-auth-container', uiConfig)
    }, [])

    return (
        <div style={
            user
                ? {visibility: 'hidden', position: 'absolute'}
                : {
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: '10vh',
                    backgroundColor: 'rgba(241, 205, 139, 0.3)',
                }
        }>
            <h1>Welcome to Raccoon Lists!</h1>
            <div id="firebaseui-auth-container"></div>
            <div id="loader">Loading...</div>
        </div>
    );
}

export default Auth;