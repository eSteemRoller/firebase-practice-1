
// First letter of email: user.email[0].toUpperCase()

import React, { useEffect, useState } from 'react';
import './App.css';
import FrontendSimplifiedLogo from './assets/Frontend_Simplified_logo;transparent_bkgd.png';
import { auth, db } from './firebase/init';
import { collection, addDoc, getDocs, getDoc, doc, query, where, updateDoc, deleteDoc } from 'firebase/firestore';
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
  const [postId, setPostId] = useState("");


  const isLoggedIn = user && user.email

  function createPost() {
    const addPost = {
      title: "Finish Firebase section",
      description: "Finish Frontend Simplified, Module 5",
      uid: user.uid,
    };
    addDoc(collection(db, "posts"), addPost)
    // console.log(doc(db, "posts", id));
  }

  async function updatePost() {
    const hardcodedId = "64G7gIXMN6a4mGQZc2tW";
    const postRef = doc(db, "posts", hardcodedId);
    const post = await getPostById(hardcodedId);
    console.log(post);
    const editPost = {
      ...post,
      title: "Get that $$$",
    };
    console.log(editPost);
    updateDoc(postRef, editPost);
  }

  function deletePost() {
    const hardcodedId = "64G7gIXMN6a4mGQZc2tW";
    const postRef = doc(db, "posts", hardcodedId);
    deleteDoc(postRef);
  }

  async function getAllPosts() {
    const { docs } = await getDocs(collection(db, "posts"));
    const getPosts = docs.map((elem) => ({ ...elem.data(), id: elem.id }));
    console.log(getPosts);
  }

  async function getPostById(id) {
    if (!id || typeof id !== "string") {
      console.warn("Invalid Post ID");
      return;
    }
    try {
      const postRef = doc(db, "posts", id);
      const postSnap = await getDoc(postRef);
      
      if (postSnap.exists()) {
        console.log("Post data:", postSnap.data());
      } else {
        console.warn("No post found with that ID.");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  }

  async function getPostByUid() {
    const postCollectionRef = await query(
      collection(db, "posts"),
      where("uid", "==", user.uid)
    );
    const { docs } = await getDocs(postCollectionRef);
    console.log(docs.map(doc => doc.data()));
  }

  useEffect(() => {
    const notLoggedIn = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => notLoggedIn();
  }, []);

  function signUp() {

    setHasSignedUpSession(true);  // Track as 'Signed up' until new Mount

    createUserWithEmailAndPassword(auth, 'email@email.com', 'test123')
      .then((userCredential) => {
        setUser(userCredential.user);
        console.log(`${userCredential.user.email} has signed up`);
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
          console.log(userCredential.user.email); 
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
                  <button className='btn' onClick={getAllPosts}>See All Posts</button>
                  <div className="get-post-by-id__section">
                    <input
                      type="text"
                      className="input"
                      placeholder="Enter Post ID"
                      value={postId}
                      onChange={(e) => setPostId(e.target.value)}
                    />
                    <button className="btn" onClick={() => getPostById(postId)}>Get Post By Id</button>
                  </div>
                  <button className='btn' onClick={getPostByUid}>Get Post By UId</button>
                  <button className='btn' onClick={updatePost}>Edit Post</button>
                  <button className='btn' onClick={deletePost}>Delete Post</button>
                  <button className='btn' onClick={handleSignOut}>Log out</button>
                  <div className='user__profile'>
                    <div className='btn profile-icon'>
                      {user.email[0].toUpperCase()}
                    </div>
                    <h3>{user.email}</h3>
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


