/** index.js
 * Copyright (c) 2022, Towechlabs
 * All rights reserved.
 *
 * Main file for the Web-client
 */
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import reportWebVitals from './reportWebVitals';

// Styles
import 'normalize.css';
import './index.css';

const doc = document.getElementById('root');
if (doc === null) throw new Error('Root container missing in index.html');

const root = ReactDOM.createRoot(doc);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
