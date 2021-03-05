import React from 'react';
import { ReactComponent as NeoCoastLogo } from 'Assets/neocoast-logo.svg';
import './index.css';

const NotFound = () => (
  <div className="not-found">
    <NeoCoastLogo width={300} />
    <h1>
      Oops <span role="img" aria-label="crying face">😭</span>
    </h1>
    <h5>
      Boilerplate made with <span role="img" aria-label="love">♥️</span> by <a href="https://www.neocoast.com" target="_blank" rel="nofollow">NeoCoast</a>
    </h5>
  </div>
);

export default NotFound;
