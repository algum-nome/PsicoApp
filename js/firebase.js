const firebaseConfig = {
  apiKey: "AIzaSyCbFq-tqxxfMFYd4XQJN0pli_KSs2Yesl0",
  authDomain: "psicopedagogia-app-61bf8.firebaseapp.com",
  projectId: "psicopedagogia-app-61bf8",
  storageBucket: "psicopedagogia-app-61bf8.firebasestorage.app",
  messagingSenderId: "67636234857",
  appId: "1:67636234857:web:e5e3fb8931f7b452dff0f8"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();