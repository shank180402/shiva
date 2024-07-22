// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.8/firebase-messaging.js');

// Initialize Firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyALriqH9k5vpw1Synj4blDnHs0knZK69go",
    authDomain: "chatting-app-8abb9.firebaseapp.com",
    projectId: "chatting-app-8abb9",
    storageBucket: "chatting-app-8abb9.appspot.com",
    messagingSenderId: "81657663481",
    appId: "1:81657663481:web:008732a7741e25dd4b7728",
    measurementId: "G-WMC5603GCT"
  };

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
