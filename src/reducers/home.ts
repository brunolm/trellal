import * as clone from 'clone';

import { types } from '../actions/home';

const InitialState = {
  title: 'TypeScript rocks!',
  boards: [],
  organizations: [],
  selectedOrgId: undefined,
  error: undefined,
};

const home = (state = InitialState, action) => {
  switch (action.type) {
    case types.Init:
      return clone(InitialState);

    case types.SelectOrganization:
      return {
        ...state,
        selectedOrgId: action.data,
      };

    case types.GetBoardsSuccess:
      return {
        ...state,
        boards: action.data,
      };

    case types.GetBoardsError:
      return {
        ...state,
        boards: [],
        error: true,
      };

    case types.GetOrganizationsSuccess:
      return {
        ...state,
        organizations: action.data,
      };

    case types.GetOrganizationsError:
      return {
        ...state,
        organizations: [],
        error: true,
      };

    case types.GetOrganizationBoardSuccess:
      return {
        ...state,
        boards: action.data,
      };

    case types.GetOrganizationBoardError:
      return {
        ...state,
        boards: [],
        error: true,
      };

    default:
      return state;
  }
};

export default home;
