import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, getDocs, onSnapshot, addDoc, deleteDoc, doc,
  query, where,
  orderBy,serverTimestamp,
  getDoc,updateDoc
} from 'firebase/firestore' 
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkH613WUGdJhl07guMjDWwHeyXIaTI90o",
  authDomain: "fir-9dojo-1f6da.firebaseapp.com",
  projectId: "fir-9dojo-1f6da",
  storageBucket: "fir-9dojo-1f6da.appspot.com",
  messagingSenderId: "757124286524",
  appId: "1:757124286524:web:4d389a9c6fef8daf2c9b39",
  measurementId: "G-M0TX1MPT80"
};
// init firebasse app
initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth()

// collection ref 
const colRef = collection(db, 'books')
// queries
const q = query(colRef, orderBy('createdAt'))

// realtime collection data

const unsubCol = onSnapshot(q, (snapshot) =>{
  let books=[]
    snapshot.docs.forEach((doc)=>{
      books.push({ ...doc.data(), id: doc.id })

    })
    console.log(books)
})

// adding docs
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp()
  })
  .then(() => {
    addBookForm.reset()
  })
})

// deleting docs
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'books', deleteBookForm.id.value)

  deleteDoc(docRef)
    .then(() => {
      deleteBookForm.reset()
    })
})
//get a singel document
const docRef = doc(db, 'books', 'tadq19R7ETXoBqbEC2PQ')

const unsubDoc = onSnapshot(docRef, (doc) =>{
    console.log(doc.data(), doc.id)
})
// getDoc(docRef)
//   .then(doc => {
//     console.log(doc.data(), doc.id)
//   })


onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id)
})
// updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let docRef = doc(db, 'books', updateForm.id.value)

  updateDoc(docRef, {
    title: 'updated title'
  })
  .then(() => {
    updateForm.reset()
  })
})
// signing users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
      //console.log('user created:', cred.user)
      signupForm.reset()
    })
    .catch(err => {
      console.log(err.message)
    })
})
// logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log('user signed out')
    })
    .catch(err => {
      console.log(err.message)
    })
})


const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email,password)
    .then((cred)=>{
      //console.log('user logged in:',cred.user)
    })
    .catch((err)=>{
      console.log(err.message)
    })

})

// subscribing to auth changes
onAuthStateChanged(auth, (user) => {
  console.log('user status changed:', user)
})

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log('user status changed:', user)
})

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
  console.log('unsubscribing')
  unsubCol()
  unsubDoc()
  unsubAuth()
  
})