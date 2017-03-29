import * as clone from 'clone';

import { types } from '../actions/home';

const InitialState = {
  title: 'TypeScript rocks!',
  boards: [],
  organizations: [],
  selectedOrgId: undefined,
  error: undefined,
  boardsLoading: false,
  organizationsLoading: false,
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
        organizations: [],
        error: true,
        organizationsLoading: false,
      };

    case types.GetOrganizationBoardStart:
      return {
        ...state,
        boardsLoading: true,
      };
    case types.GetOrganizationBoardSuccess:
      return {
        ...state,
        boards: action.data,
        boardsLoading: false,
      };
    case types.GetOrganizationBoardError:
      return {
        ...state,
        boards: [],
        error: true,
        boardsLoading: false,
      };

    default:
      return state;
  }
};

export default home;
