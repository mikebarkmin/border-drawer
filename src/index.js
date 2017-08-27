import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import { ThemeProvider } from 'gestyled';
import './index.css';
import BorderDrawer from './BorderDrawer';
import Landing from './Landing';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <ThemeProvider>
    <Router>
      <div>
        <Route path="/:borderName" component={BorderDrawer} />
        <Route exact path="/" component={Landing} />
      </div>
    </Router>
  </ThemeProvider>,
  document.getElementById('root')
);
registerServiceWorker();
