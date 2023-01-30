import React from 'react';
import {EmailAuthProvider, getAuth, GoogleAuthProvider,} from "firebase/auth";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui"
import {useAuthState} from "react-firebase-hooks/auth";

function Auth({app}) {
    const firebaseAuth = firebase.auth(app)
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebaseAuth);

    // Temp variable to hold the anonymous user data if needed.
    let data = null;
    // Hold a reference to the anonymous current user.
    let anonymousUser = firebaseAuth.currentUser;

    const uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                // User successfully signed in.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.
                return true;
            },
            // signInFailure callback must be provided to handle merge conflicts which
            // occur when an existing credential is linked to an anonymous user.
            signInFailure: function (error) {
                // For merge conflicts, the error.code will be
                // 'firebaseui/anonymous-upgrade-merge-conflict'.
                if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
                    return Promise.resolve();
                }
                // The credential the user tried to sign in with.
                let cred = error.credential;
                // Copy data from anonymous user to permanent user and delete anonymous
                // user.
                // ...
                // Finish sign-in after data is copied.
                return firebaseAuth.signInWithCredential(cred);
            },
            uiShown: function () {
                // The widget is rendered.
                // Hide the loader.
                document.getElementById('loader').style.display = 'none';
            }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        autoUpgradeAnonymousUsers: true,
        signInFlow: 'popup',
        signInSuccessUrl: '<url-to-redirect-to-on-success>',
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            GoogleAuthProvider.PROVIDER_ID,
            // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            // firebase.auth.GithubAuthProvider.PROVIDER_ID,
            EmailAuthProvider.PROVIDER_ID,
            // firebase.auth.PhoneAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        tosUrl: '<your-tos-url>',
        // Privacy policy url.
        privacyPolicyUrl: '<your-privacy-policy-url>'
    };

    ui.start('#firebaseui-auth-container', uiConfig)

    const [user] = useAuthState(firebaseAuth)

    // const signInWithGoogle = () => {
    //     const provider = new GoogleAuthProvider();
    //     signInWithPopup(firebaseAuth, provider)
    // }
    // const createUser = (email, password) => {
    //     createUserWithEmailAndPassword(firebaseAuth, email, password)
    // }
    // const signInWithEmail = (email, password) => {
    //     signInWithEmailAndPassword(firebaseAuth, email, password)
    // }

    return (
        <div>
            <h1>Welcome to My Awesome App</h1>
            <div id="firebaseui-auth-container"></div>
            <div id="loader">Loading...</div>
        </div>
    );
}

export default Auth;