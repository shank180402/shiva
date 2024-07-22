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
  measurementId: "G-WMC5603GCT"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

export const getToken = (setTokenFound) => {
    return messaging.getToken({ vapidKey: 'Y BCyHUcysiG4x3Rhqj2mz9of_6Th0S2c9iisrVzNOAdROsGI0ZAU4UXj1ojgiio4W8eNjRE9EPnXbNjPGCOxEWkwY' }).then((currentToken) => {
        if (currentToken) {
            console.log('current token for client:', currentToken);
            setTokenFound(true);
            // Track the token -> client mapping, by sending to backend server
            // Show on the UI that permission is secured
        } else {
            console.log('No registration token available. Request permission to generate one.');
            setTokenFound(false);
            // Show on the UI that permission is required
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token:', err);
        setTokenFound(false);
        // Catch error while creating client token
    });
};

export const onMessageListener = () => {
    return new Promise((resolve) => {
        messaging.onMessage((payload) => {
            resolve(payload);
        });
    });
};


export { messaging };
