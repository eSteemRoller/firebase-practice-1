// First letter of email: user.email[0].toUpperCase()

import React, { useEffect, useState } from "react";
import "./App.css";
import FrontendSimplifiedLogo from "./assets/Frontend_Simplified_logo;transparent_bkgd.png";
import { auth, db } from "./firebase/init";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
  deleteDoc,
  setDoc, // replaced addDoc to store db-assigned post ID data inside db-Doc for easy ref
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSignedUpSession, setHasSignedUpSession] = useState(false);
  const [signUpConfirmVisible, setSignUpConfirmVisible] = useState(false);
  const [loginDialogVisible, setLoginDialogVisible] = useState(false);

  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostDescription, setNewPostDescription] = useState("");

  const [searchByPostId, setSearchByPostId] = useState("");

  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editPostId, setEditPostId] = useState("");
  const [editPostTitle, setEditPostTitle] = useState("");
  const [editPostDescription, setEditPostDescription] = useState("");

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [deletePostDetails, setDeletePostDetails] = useState(null);
  const [deletePostById, setDeletePostById] = useState("");

  const isLoggedIn = user && user.email;

  function openCreatePostDialog() {
    setNewPostTitle("");
    setNewPostDescription("");
    setCreateDialogVisible(true);
  }

  async function saveNewPost() {
    if (!newPostTitle.trim() || !newPostDescription.trim()) {
      alert("Please enter both a title and description.");
      return;
    }

    try {
      // create a new document reference (Firestore will generate the doc/post ID)
      const docRef = doc(collection(db, "posts"));

      // build the post object with the db-generated ID
      const addPost = {
        uid: user.uid,
        id: docRef.id, // store the post ID inside the document to view in console
        title: newPostTitle.trim(),
        description: newPostDescription.trim(),
      };

      // use setDoc (instead of addDoc) so we can include the ID field inside the doc for easy ref
      await setDoc(docRef, addPost);

      console.log("Post created with ID:", docRef.id);
      console.log("Full post object:", addPost);
    } catch (error) {
      console.error("Error creating post:", error);
    }

    setCreateDialogVisible(false);
  }

  async function openEditDialog(id) {
    if (!id) {
      alert("Please enter a Post ID to edit.");
      return;
    }

    try {
      const postRef = doc(db, "posts", id);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const data = postSnap.data();
        setEditPostId(id);
        setEditPostTitle(data.title);
        setEditPostDescription(data.description);
        setEditDialogVisible(true);
      } else {
        alert("No post found with that ID.");
        console.warn("No post found with that ID.");
      }
    } catch (error) {
      console.error("Error opening edit dialog:", error);
    }
  }

  async function saveEditedPost() {
    if (!editPostId) {
      alert("Missing Post ID.");
      return;
    }

    try {
      const postRef = doc(db, "posts", editPostId);
      await updateDoc(postRef, {
        title: editPostTitle.trim(),
        description: editPostDescription.trim(),
      });

      console.log("Post updated:", editPostId);
      setEditDialogVisible(false);
    } catch (error) {
      console.error("Error saving post:", error);
    }
  }

  async function openDeleteDialog(id) {
    if (!id) {
      alert("Please enter a Post ID to delete.");
      return;
    }
    try {
    const postRef = doc(db, "posts", id);
    const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        setDeletePostById(id);
        setDeletePostDetails(postSnap.data()); // save details for user confirmation
        setDeleteDialogVisible(true);
      } else {
        alert("No post found with that ID.");
        console.warn("No post found with that ID.");
      }
    } catch (error) {
      console.error("Error checking post before delete:", error);
    }
  }

  async function confirmDeletePost() {
    try {
      const postRef = doc(db, "posts", deletePostById);
      await deleteDoc(postRef);
      console.log("Post deleted:", deletePostById);

      // Reset state
      setDeleteDialogVisible(false);
      setDeletePostDetails(null);
      setDeletePostById("");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
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
        alert("No post found with that ID.");
        console.warn("No post found with that ID.");
      }

    } catch (error) {
      console.error("Error fetching post:", error);
    }
  }

  async function getPostByUId() {
    const postCollectionRef = await query(
      collection(db, "posts"),
      where("uid", "==", user.uid)
    );
    const { docs } = await getDocs(postCollectionRef);
    console.log(docs.map((doc) => doc.data()));
  }

  useEffect(() => {
    const notLoggedIn = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => notLoggedIn();
  }, []);

  function signUp() {
    setHasSignedUpSession(true); // Track state as 'Signed up' until new Mount
    
    createUserWithEmailAndPassword(auth, "user@email.com", "test123")
      .then((userCredential) => {
        setUser(userCredential.user);
        console.log(`${userCredential.user.email} has signed up`);
        setSignUpConfirmVisible(true); // Show dialog here
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function signIn() {
    if (!hasSignedUpSession) {
      setLoginDialogVisible(true);
      return;
    } else {
      signInWithEmailAndPassword(auth, "user@email.com", "test123")
        .then((userCredential) => {
          setUser(userCredential.user); // Signed in
          console.log(userCredential.user.email);
        })
        .catch((error) => {
          console.log(error);
          return;
        });
    }
  }

  function closeDialog() {
  setLoginDialogVisible(false);
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

  return (
    <div className="App">
      <nav className="nav">
        <div className="nav__container">
          <div className="nav__row">
            <figure className="nav__figure">
              {loading ? (
                <div className="nav__img--skeleton skeleton no-cursor"></div>
              ) : (
                <a href="/">
                  <img
                    className="nav__img"
                    src={FrontendSimplifiedLogo}
                    alt="Frontend Simplified logo"
                  />
                </a>
              )}
            </figure>
            <div className="nav__buttons">
              {loading ? (
                <>
                  <div className="button__skeleton skeleton no-cursor"></div>
                  <div className="button__skeleton skeleton no-cursor"></div>
                </>
              ) : isLoggedIn ? (
                <>
                  <button className="btn" onClick={openCreatePostDialog}>
                    Create Post
                  </button>
                  <button className="btn" onClick={getAllPosts}>
                    See All Posts
                  </button>
                  <div className="get-post-by-id__section">
                    <input
                      type="text"
                      className="input"
                      placeholder="Enter Post ID to Search"
                      value={searchByPostId}
                      onChange={(e) =>
                        setSearchByPostId(e.target.value)
                      }
                    />
                    <button
                      className="btn"
                      onClick={() => getPostById(searchByPostId)}
                    >
                      Search Post By ID
                    </button>
                  </div>
                  <button className="btn" onClick={getPostByUId}>
                    See All Posts By User
                  </button>
                  <div className="edit-post-by-id__section">
                    <input
                      type="text"
                      className="input"
                      placeholder="Enter Post ID to Edit"
                      value={editPostId}
                      onChange={(e) => setEditPostId(e.target.value)}
                    />
                    <button
                      className="btn"
                      onClick={() => openEditDialog(editPostId)}
                    >
                      Edit Post By ID
                    </button>
                  </div>
                  <div className="delete-post-by-id__section">
                    <input
                      type="text"
                      className="input"
                      placeholder="Enter Post ID to Delete"
                      value={deletePostById}
                      onChange={(e) => setDeletePostById(e.target.value)}
                    />
                    <button
                      className="btn"
                      onClick={() => openDeleteDialog(deletePostById)}
                    >
                      Delete Post By ID
                    </button>
                  </div>
                  <button className="btn" onClick={handleSignOut}>
                    Log Out
                  </button>
                  <div className="user__profile">
                    <div className="btn profile-icon">
                      {user.email[0].toUpperCase()}
                    </div>
                    <h3>{user.email}</h3>
                  </div>
                </>
              ) : (
                <>
                  <button className="btn" onClick={signUp}>
                    Sign Up
                  </button>
                  <button className="btn" onClick={signIn}>
                    Log In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {signUpConfirmVisible && user && (
        <div className="dialog">
          <div className="dialog__box">
            <h3 className="dialog__box--element">Sign Up Successful</h3>
            <p className="dialog__box--element">Welcome, {user.email}!</p>
            <button
              className="d-btn"
              onClick={() => setSignUpConfirmVisible(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {loginDialogVisible && (
        <div className="dialog">
          <div className="dialog__box">
            <p className="dialog__box--element">Please, sign up before logging in.</p>
            <button className="d-btn" onClick={closeDialog}>
              OK
            </button>
          </div>
        </div>
      )}
      {createDialogVisible && (
        <div className="dialog">
          <div className="dialog__box">
            <h3 className="dialog__box--element">Create New Post</h3>
            <input
              type="text"
              placeholder="Post Title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="dialog__box--element title-input"
            />
            <textarea
              placeholder="Post Description"
              value={newPostDescription}
              onChange={(e) => setNewPostDescription(e.target.value)}
              className="dialog__box--element description-input"
            ></textarea>
            <div className="dialog__buttons">
              <button className="d-btn" onClick={saveNewPost}>
                Save
              </button>
              <button
                className="d-btn btn--secondary"
                onClick={() => setCreateDialogVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {editDialogVisible && (
        <div className="dialog">
          <div className="dialog__box">
            <h3 className="dialog__box--element">Edit Post</h3>
            <input
              type="text"
              placeholder="Post Title"
              value={editPostTitle}
              onChange={(e) => setEditPostTitle(e.target.value)}
              className="dialog__box--element title-input"
            />
            <textarea
              placeholder="Post Description"
              value={editPostDescription}
              onChange={(e) => setEditPostDescription(e.target.value)}
              className="dialog__box--element description-input"
            ></textarea>
            <div className="dialog__buttons">
              <button className="d-btn" onClick={saveEditedPost}>
                Save
              </button>
              <button
                className="d-btn btn--secondary"
                onClick={() => setEditDialogVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteDialogVisible && (
        <div className="dialog">
          <div className="dialog__box">
            <h3 className="dialog__box--element">Confirm Delete</h3>
            {deletePostDetails && (
              <div className="delete-dialog__details">
                <p><strong>Title:</strong> {deletePostDetails.title}</p>
                <p><strong>Description:</strong> {deletePostDetails.description}</p>
              </div>
            )}
            <p className="dialog__box--element">Are you sure you want to delete this post?</p>
            <div className="dialog__buttons">
              <button className="d-btn btn--danger" onClick={confirmDeletePost}>
                Yes, Delete
              </button>
              <button
                className="d-btn btn--secondary"
                onClick={() => setDeleteDialogVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
