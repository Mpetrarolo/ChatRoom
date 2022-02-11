import React, { useRef, useState } from 'react';
import './App.css';

//import firebase from 'firebase/compat/app';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState, useSignInWithGoogle} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';



const fireBaseInizializeApp = firebase.initializeApp( {
  apiKey: "AIzaSyCg2rZrh6PsEslWqvvBB-1nBWwb8ML9UwQ",
  authDomain: "mineral-silicon-240913.firebaseapp.com",
  projectId: "mineral-silicon-240913",
  storageBucket: "mineral-silicon-240913.appspot.com",
  messagingSenderId: "605811681822",
  appId: "1:605811681822:web:983ef4209126f84d86dc0f",
  measurementId: "G-S6ESEDMG9V"
});

// Initialize Firebase
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  //setting auth
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
    <h1>Welocome to ChatRoom</h1>
    <SignOut/>
      </header>
      <selection>
        {user ? <ChatRoom/> : <SignIn />}
      </selection>
    </div>
  );
}

//setting function for SingIn
function SignIn(){

  const useSignInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <button onClick={useSignInWithGoogle}>Sign In with Google</button>
  )
}

//setting function for SignOut
function SignOut(){
  return auth.currentUser && (
    <button onClick={()=>auth.SignOut}>Sign Out</button>
  )
}

//setting the ChatRoom
function ChatRoom(){
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');
  const dummy = useRef();
  const sendMessage = async(e)=>{
    e.preventDefault();
    const {uid,photoUrl} = auth.currentUser;
    await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid
    })
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' }); 
  }

  return(
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
      <div ref={dummy}>      
      </div>
    </main>
    <form onSubmit={sendMessage}>
    <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice"/>

    <button type="submit">Invio</button>

    </form>

    </>
  )

}

//setting the Messages
function ChatMessage(props){
const {text, uid, photoUrl} = props.message;

const messagesClass = uid === auth.currentUser.uid ? 'sent' : 'recived';

return (
<div className={'message ${messagesClass}'}>
<img src={photoUrl || 'https://api.adorable.io/avatars/23/abott@adorable.png'}/>
<p>{text}</p>
</div>
)
}

export default App;
