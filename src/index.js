import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css' // Importar bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importar bootstrap JS
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
/*if ("serviceWorker" in navigator) {
  serviceWorkerRegistration.register("sw.js");
}*/
serviceWorkerRegistration.unregister();

