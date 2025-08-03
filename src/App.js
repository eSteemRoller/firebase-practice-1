
// First letter of email: user.email[0].toUpperCase()

import React, { useEffect, useState } from 'react';
import './App.css';
import FrontendSimplifiedLogo from './assets/Frontend_Simplified_logo;transparent_bkgd.png';
import { auth, db } from './firebase/init';
import { collection, addDoc } from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from "firebase/auth";


export default function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSignedUpSession, setHasSignedUpSession] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const isLoggedIn = user && user.email

  function createPost() {
    const post = {
      title: "Land a $200k job",
      description: "Finish Frontend Simplified",
    };
    addDoc(collection(db, "posts"), post)
  }

  useEffect(() => {
    const notLoggedIn = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => notLoggedIn();
  }, []);

  function signUp() {

    setHasSignedUpSession(true);  // Track as 'Signed up' for this session (until new Mount)

    createUserWithEmailAndPassword(auth, 'email@email.com', 'test123')
      .then((userCredential) => {
        setUser(userCredential.user); 
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function signIn() {
    if (!hasSignedUpSession) {
      setDialogVisible(true);
      return;
    }
    else {
      signInWithEmailAndPassword(auth, 'email@email.com', 'test123')
        .then((userCredential) => {
          setUser(userCredential.user);  // Signed in
          console.log(user); 
        })
        .catch((error) => {
          console.log(error);
          return;
        })
    }
  }

  function handleSignOut() {
    signOut(auth)
      .then(() => {
        setUser(null);
      }) 
      .catch((error) => {
      console.error(error);
      return;
    });
  }

  function closeDialog() {
    setDialogVisible(false);
  }
  
  return (
    <div className="App">
      <nav className="nav">
        <div className="nav__container">
          <div className='nav__row'>
            <figure className='nav__figure'>
              {loading ? (
                <div className='nav__img--skeleton skeleton no-cursor'></div>
              ) : (
                <a href='/' >
                  <img className='nav__img' src={FrontendSimplifiedLogo} alt="Frontend Simplified logo" />
                </a>
              )}
            </figure>
            <div className='nav__buttons'>
              {loading ? (
                <>
                  <div className='button__skeleton skeleton no-cursor'></div>
                  <div className='button__skeleton skeleton no-cursor'></div>
                </>
              ) : isLoggedIn ? (
                <>
                  <button className='btn' onClick={createPost}>Create Post</button>
                  <button className='btn' onClick={handleSignOut}>Log out</button>
                  <div className="btn profile-icon">
                    {user.email[0].toUpperCase()}
                  </div>
                </>
              ) : (
                <>
                  <button className='btn' onClick={signUp}>Sign up</button>
                  <button className='btn' onClick={signIn}>Log in</button>
                </>
              )}
            </div>
          </div>
        </div> 
      </nav>
      {dialogVisible && (
        <div className='dialog'>
          <div className='dialog__box'>
            <p>Please, sign up before logging in.</p>
            <button className='btn' onClick={closeDialog}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}


