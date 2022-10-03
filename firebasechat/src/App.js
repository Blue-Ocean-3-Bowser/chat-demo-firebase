import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

// BASIC FIREBASE IMPORT
// import firebase from 'firebase/app';
// import 'firebase/firestore';
// import 'firebase/auth';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// import { doc, setDoc } from "firebase/firestore";

// ==============================================
// INITIALIZE FIREBASE SDK from doc
// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzC-epjFPwzW88k_jzeiJrgtiG680xj80",
  authDomain: "chat-demo-firebase-40936.firebaseapp.com",
  projectId: "chat-demo-firebase-40936",
  storageBucket: "chat-demo-firebase-40936.appspot.com",
  messagingSenderId: "724324090088",
  appId: "1:724324090088:web:201e4a1692d8c28c44495d",
  measurementId: "G-FDWEL1E98M"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// const analytics = firebase.analytics();
const auth = firebase.auth();
const firestore = firebase.firestore();

console.log('running')

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <section className="App-header">
        {user? <ChatRoom /> : <SignIn />}
      </section>


    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => firebase.auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const messagesRef = firestore.collection('chat-test-db');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});
  console.log(messages);

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid
    })
  }

  return(
    <>
      <div>
        <div>
          {messages && messages.map(msg => <ChatMessage
          key={msg.id}
          message={msg}
          id={msg.id}
          />)}
        </div>
        <form onSubmit={sendMessage}>
          <input value={formValue} onChange={(e) =>
          setFormValue(e.target.value)}/>
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, id } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent':'received';

  return (
    <div className={`message ${messageClass}`}>
      <p>{id}:{text}</p>
    </div>
  )
}

export default App;
