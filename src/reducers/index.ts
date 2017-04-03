import { RouterState, routerReducer as routing } from 'react-router-redux';

import { Home } from '../components/Home/index';
import { combineReducers } from 'redux';
import { home } from './home';

export interface RootState {
  home: Home.State;
  routing: RouterState;
}

const App = combineReducers({
  home,
  routing,
});

export default App;
