import firebase from "firebase";

const config = {
  apiKey: "AIzaSyDy2sD_Z6RdSVv1H3m07CDm3Eq07jsiR7o",
  authDomain: "hospital-management-syst-9abda.firebaseapp.com",
  // databaseURL: "***************",
  projectId: "hospital-management-syst-9abda",
  storageBucket: "hospital-management-syst-9abda.appspot.com",
  messagingSenderId: "399175212760",
  appId: "1:399175212760:web:73f15cab9435ff387241ad",
  measurementId: "G-DWMEGP0H3D",
};

// const db = firebaseApp.firestore();
// const storage = firebaseApp.storage();
firebase.initializeApp(config);
export default firebase;
