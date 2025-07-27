
import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import './App.css';
import FrontendSimplifiedLogo from './assets/Frontend_Simplified_logo;transparent_bkgd.png';
import { auth } from './firebase/init';
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

  useEffect(() => {
    const notLoggedIn = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => notLoggedIn();
  }, []);

  function signUp() {
    createUserWithEmailAndPassword(auth, 'email@email.com', 'test123')
      .then((userCredential) => {
        setUser(userCredential.user); 
        setHasSignedUpSession(true);  // Track as 'Signed up' for this session
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
        console.log(user);  // First letter of email: user.email[0].toUpperCase()
        return;
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
    });
  }

  function closeDialog() {
    setDialogVisible(false);
  }
  
  return (
    // <Router>
      <div className="App">
        <nav className="nav">
          <div className="nav__container">
            <div className='nav__row'>
              <figure className='nav__figure'>
                {loading ? (
                  <div className='nav__img--skeleton skeleton no-cursor'></div>
                ) : (
                  // <Routes>
                    // <Route path="/">
                      // <Link to="/">
                        <a href='/' >
                          <img className='nav__img' src={FrontendSimplifiedLogo} alt="Frontend Simplified logo" />
                        </a>
                      // </Link>
                    // </Route>
                  // </Routes>
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
                    <button className="btn" onClick={handleSignOut}>Log out</button>
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
    // </Router>
  );
}


