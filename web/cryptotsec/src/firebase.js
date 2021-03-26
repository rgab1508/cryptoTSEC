import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyC5Nj42JXzuwSI6F5EI_m8qP5dafeP2Ltg",
    authDomain: "codrcrew.firebaseapp.com",
    databaseURL: "https://codrcrew.firebaseio.com",
    projectId: "codrcrew",
    storageBucket: "codrcrew.appspot.com",
    messagingSenderId: "517463115484",
    appId: "1:517463115484:web:b346b7d7fa86cc08371619",
    measurementId: "G-KVLT7B42HZ"
};

firebase.initializeApp(config);

export default firebase;