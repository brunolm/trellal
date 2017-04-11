import { Action } from '../base-reducer';
import { InitialState } from './base-reducer';
import { types } from '../../actions/home';

export default function getOrganizations(state: typeof InitialState, action: Action<any>) {
  switch (action.type) {
    case types.GetOrganizationsStart:
      return {
        ...state,
        organizationsLoading: true,
      };
    case types.GetOrganizationsSuccess:
      return {
        ...state,
        organizations: action.data,
        organizationsLoading: false,
      };
    case types.GetOrganizationsError:
      return {
        ...state,
        error: true,
        organizations: [],
        organizationsLoading: false,
      };

    default:
      return state;
  }
}
