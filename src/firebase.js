import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDqosjKed8jZFWc0PvIqMtr-7nSS48nWAQ",
    authDomain: "redistrict-d9682.firebaseapp.com",
    databaseURL: "https://redistrict-d9682.firebaseio.com",
    projectId: "redistrict-d9682",
    storageBucket: "redistrict-d9682.appspot.com",
    messagingSenderId: "1076720940352",
    appId: "1:1076720940352:web:59d66cf65c2211afbe36a5",
    measurementId: "G-0MQS0S9W47"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;