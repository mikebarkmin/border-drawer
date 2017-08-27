import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { ThemeProvider } from 'gestyled';
import './index.css';
import BorderDrawer from './BorderDrawer';
import Landing from './Landing';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <ThemeProvider>
    <BrowserRouter>
      <div>
        <Route path="/:borderName" component={BorderDrawer} />
        <Route exact path="/" component={Landing} />
      </div>
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById('root')
);
registerServiceWorker();
