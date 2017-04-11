import './index.scss';

import * as React from 'react';

import { Route, Router, Switch } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';

import Home from './components/Home';
import NoMatch from './components/NoMatch';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { default as reducers } from './reducers';
import { render } from 'react-dom';
import thunk from 'redux-thunk';

const store = createStore(reducers, applyMiddleware(thunk));
const history = createBrowserHistory();

// http://stackoverflow.com/q/43057911/340760
// const history = syncHistoryWithStore(createBrowserHistory() as any, store);

render(
  <Provider store={ store } key="provider">
    <Router history={ history }>
      <main>
        <Switch>
          <Route exact path="/" component={ Home } />
          <Route path="*" component={ NoMatch }/>
        </Switch>
      </main>
    </Router>
  </Provider>,
  document.getElementById('root'),
);

console.log('GitHub: https://github.com/brunolm/trellal');

declare var module: any;
if (module.hot) {
  module.hot.accept();
}
