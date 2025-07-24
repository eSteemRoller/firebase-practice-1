
import React from 'react';
import './App.css';
import { auth } from './firebase/init';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from "firebase/auth";


export default function App() {

  const [user, setUser] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setLoading(false);
      console.log(user);
      if (user) {
        setUser(user)
      }
    })
  }, []);

  function signUp() {
    createUserWithEmailAndPassword(auth, 'email@email.com', 'test123')
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function signIn() {
    signInWithEmailAndPassword(auth, 'email@email.com', 'test123')
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user); // First letter of email: user.email[0].toUpperCase()
        setUser(user);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function signOff() {
    signOut(auth);
    setUser({});
  }

  
  return (
    <div className="App">
      <div className="dashboard__nav--content dashboard__nav--content-border">
        <div className="flex align-center">
          <figure className="logo">
            <figure style={{display: 'flex'}}>
              <img src='./public/img/Frontend Simplified Logo.853fbda.png' alt="" class="logo__img" />
            </figure>
          </figure>
        </div>
        <div>
          <button onClick={signUp}>Sign up</button>
          <button onClick={signIn}>Sign in</button>
          {loading ? 'Loading...' : user.email}
          <button onClick={signOff}>Sign out</button>
        </div>
      </div>
    </div>
    
  );
}


{/* <link data-n-head="ssr" rel="icon" type="image/x-icon" href="/favicon.ico"></link> */}