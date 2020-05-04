import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const settings = {timestampsInSnapshots: true};

const config = {
    apiKey: "AIzaSyCFxQ4fALKr7RnjJJ_zuny4f6OL79UuJIk",
    authDomain: "numpakbis.firebaseapp.com",
    databaseURL: "https://numpakbis.firebaseio.com",
    projectId: "numpakbis",
    storageBucket: "numpakbis.appspot.com",
    messagingSenderId: "257634139431",
    appId: "1:257634139431:web:f2997934d78b9b39f67d02",
    measurementId: "G-4BDQBLDVVD"
};
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;