import { RouterState, routerReducer as routing } from 'react-router-redux';

import { combineReducers } from 'redux';
import { home } from './home';

export interface RootState {
  home: any;
  routing: RouterState;
}

const App = combineReducers({
  home,
  routing,
});

export default App;
