
import firebase from 'firebase/compat/app'; // Note the '/compat/app' part for compatibility mode
import 'firebase/compat/messaging';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALriqH9k5vpw1Synj4blDnHs0knZK69go",
  authDomain: "chatting-app-8abb9.firebaseapp.com",
  projectId: "chatting-app-8abb9",
  storageBucket: "chatting-app-8abb9.appspot.com",
  messagingSenderId: "81657663481",
  appId: "1:81657663481:web:008732a7741e25dd4b7728",
  measurementId: "G-WMC5603GCT" // Add a closing bracket here to complete the object
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Function to get token from Firebase Messaging
export const getToken = (setTokenFound) => {
  return messaging.getToken({ vapidKey: 'BCyHUcysiG4x3Rhqj2mz9of_6Th0S2c9iisrVzNOAdROsGI0ZAU4UXj1ojgiio4W8eNjRE9EPnXbNjPGCOxEWkwY' })
    .then((currentToken) => {
      if (currentToken) {
        console.log('Current token for client:', currentToken);
        setTokenFound(true);
        // Optionally, send the token to your server for backend notifications registration
      } else {
        console.log('No registration token available. Request permission to generate one.');
        setTokenFound(false);
        // Handle no token scenario in UI
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token:', err);
      setTokenFound(false);
      // Handle errors in token retrieval
    });
};

// Function to listen for incoming messages
export const onMessageListener = () => {
  return new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });
};

// Export messaging instance for use in other parts of the application
export { messaging };

