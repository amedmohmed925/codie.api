// Import the functions you need from the SDKs you need
const { getStorage } = require('firebase/storage');
const { initializeApp } = require('firebase/app');

// No need to import getAnalytics in Node.js unless you are using analytics on the server

const firebaseConfig = {
  apiKey: "AIzaSyD2pt9AqhDkpxJIxOwhTuIRNN3OifOQRgA",
  authDomain: "codie-752dd.firebaseapp.com",
  projectId: "codie-752dd",
  storageBucket: "codie-752dd.appspot.com",
  messagingSenderId: "102202503076",
  appId: "1:102202503076:web:618fae87f88c2b58fd1b31",
  measurementId: "G-NCXDVV56Y1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

// Export storage for use in your functions
module.exports = { storage };
