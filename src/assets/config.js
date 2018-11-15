import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyBezvsZQmL1Cne3Dw3C04ojarV4DUI_BFk",
    authDomain: "penalty-kick.firebaseapp.com",
    databaseURL: "https://penalty-kick.firebaseio.com",
    projectId: "penalty-kick",
    storageBucket: "penalty-kick.appspot.com",
    messagingSenderId: "1066134684258"
}

const firebaseapp = firebase.initializeApp(config)

export default firebaseapp.database()


