import * as clone from 'clone';

import { Action } from '../base-reducer';
import { InitialState } from './base-reducer';
import { types } from '../../actions/home';

export default function getUser(state: typeof InitialState, action: Action<any>) {
  switch (action.type) {
    case types.GetUserStart:
      return {
        ...clone(state),
        userLoading: true,
      };

    case types.GetUserSuccess: {
      return {
        ...clone(state),
        user: action.data,
        userLoading: false,
      };
    }

    case types.GetUserError:
      return {
        ...clone(state),
        user: undefined,
        userLoading: false,
      };

    default:
      return state;
  }
}
