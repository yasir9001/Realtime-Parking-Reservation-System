import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyCLqYta-kMRm8CswE67DeJYJtqMJYjSQD0",
    authDomain: "project-level-zero.firebaseapp.com",
    databaseURL: "https://project-level-zero.firebaseio.com",
    projectId: "project-level-zero",
    storageBucket: "project-level-zero.appspot.com",
    messagingSenderId: "118685174159"
  };
  firebase.initializeApp(config);
  export default firebase;