
import "./App.css";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { getAuth, signInWithPopup } from "firebase/auth";
import firebase from "firebase/compat/app";

import "firebase/compat/auth";
import "firebase/compat/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEMsCKKP0fIf1pYyzJZY2mZ7b3eawjoeY",
  authDomain: "chat-app-c1731.firebaseapp.com",
  projectId: "chat-app-c1731",
  storageBucket: "chat-app-c1731.appspot.com",
  messagingSenderId: "927837870457",
  appId: "1:927837870457:web:26de4d47fcf308948cb7a8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <SignOut></SignOut>
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

export default App;

function SignIn() {
  const signInGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };
  return (
    <div>
      <button className="sign-in" onClick={signInGoogle}>
        Enter
      </button>
    </div>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Exit
      </button>
    )
  );
}

function ChatRoom() {
  const messageRef = collection(db, 'messages');
  const q = query(messageRef, orderBy('createdAt'), limit(25));
  const [messages] = useCollectionData(q, { idField: 'id' });
  return (
    <div>
      {messages &&
        messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
    </div>
  );
}

function ChatMessage(props) {
  const { text, uid, fotoURL } = props.message;

  const messageClass = uid == auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img src={fotoURL}></img>
      <p>{text}</p>
    </div>
  );
}