import React from 'react';
import { ReactComponent as NeoCoastLogo } from 'Assets/neocoast-logo.svg';
import './index.css';

const App = () => (
  <div className="app">
    <NeoCoastLogo width={300} />
    <h1>
      Welcome to your React App
    </h1>
    <h5>
      Boilerplate made with <span role="img" aria-label="love">♥️</span> by <a href="https://www.neocoast.com" target="_blank" rel="nofollow">NeoCoast</a>
    </h5>
  </div>
);

export default App;
