import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import '../src/assets/css/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/assets/css/loader.css';
<<<<<<< HEAD
import { ClerkProvider } from '@clerk/clerk-react';


const PUBLISHABLE_KEY = "pk_test_c2F2aW5nLXNoZWVwLTI3LmNsZXJrLmFjY291bnRzLmRldiQ"
 
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}
=======
import '../src/assets/css/login.css';
>>>>>>> 698a96ff1a44a7e8521bfbf79ba2a056b5f0025c

ReactDOM.createRoot(document.getElementById('root')).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
)
