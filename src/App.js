
import React, { useEffect, useState } from 'react';
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
        setUser(userCredential.user);  // Signed up
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function signIn() {
    signInWithEmailAndPassword(auth, 'email@email.com', 'test123')
      .then((userCredential) => {
        setUser(userCredential.user);  // Signed in
        console.log(user);  // First letter of email: user.email[0].toUpperCase()
      })
      .catch((error) => {
        console.log(error);
      })
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

  
  return (
    <div className="App">
      <nav className="nav">
        <div className="nav__container">
          <div className='nav__row'>
              <figure className='nav__logo'>
                {loading ? (
                  <>
                    <img src={FrontendSimplifiedLogo} alt="Frontend Simplified logo" />
                  </>
                ) : (
                  <div className='nav__logo--skeleton skeleton no-cursor'></div>  
                )}
              </figure>
              <div className='nav__buttons'>
                {loading ? (
                  <>
                    <button className='btn' onClick={signUp}>Sign up</button>
                    <button className='btn' onClick={signIn}>Log in</button>
                  </>
                ) : isLoggedIn ? (
                  <></>
              <div>
                <div className='button__skeleton skeleton no-cursor'></div>
                <div className='button__skeleton skeleton no-cursor'></div>
              </div>
              )}
          </div>
        </div>  
      </nav>
    </div>
  );
}


{/* <link data-n-head="ssr" rel="icon" type="image/x-icon" href="/favicon.ico"></link> */}

    // <div className="App">
    //   <div className="dashboard__nav--content dashboard__nav--content-border">
    //     <div className="flex align-center">
    //       <figure className="logo">
    //         <figure style={{display: 'flex'}}>
    //           <img src='./public/img/Frontend Simplified Logo.853fbda.png' alt="" class="logo__img" />
    //         </figure>
    //       </figure>
    //     </div>
    //     <div>
    //       <button onClick={signUp}>Sign up</button>
    //       <button onClick={signIn}>Sign in</button>
    //       {loading ? 'Loading...' : user.email}
    //       <button onClick={signOff}>Sign out</button>
    //     </div>
    //   </div>
    // </div>
