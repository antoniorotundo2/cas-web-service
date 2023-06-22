import React from 'react';
import ReactDOM from 'react-dom/client';

import "./assets/css/lib/font-awesome.min.css";
import "./assets/css/lib/themify-icons.css";
import "./assets/css/lib/weather-icons.css";
import "./assets/css/lib/menubar/sidebar.css";
import "./assets/css/lib/bootstrap.min.css";
import "./assets/css/lib/helper.css";
import "./assets/css/style.css";

import App from './App';
import reportWebVitals from './reportWebVitals';
document.title = "Chirp Air Station";

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
