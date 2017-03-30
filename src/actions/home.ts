import * as $ from 'jquery';

import mirror from '../utils/mirror';

export const types = mirror('Home', {
  Init: undefined,

  SetSelectedBoards: undefined,
  SetSelectedLists: undefined,

  SelectOrganization: undefined,

  GetOrganizationsStart: undefined,
  GetOrganizationsSuccess: undefined,
  GetOrganizationsError: undefined,

  GetOrganizationBoardStart: undefined,
  GetOrganizationBoardSuccess: undefined,
  GetOrganizationBoardError: undefined,
});

export function init() {
  return { type: types.Init };
}

export function setSelectedBoards(boards) {
  return { type: types.SetSelectedBoards, data: boards };
}

export function setSelectedLists(lists) {
  return { type: types.SetSelectedLists, data: lists };
}

export function getOrganizations(token) {
  return dispatch => {
    dispatch({ type: types.GetOrganizationsStart });
    $.ajax({
      url: '/api/get-organizations',
      data: { token },
      success(r) {
        return dispatch({ type: types.GetOrganizationsSuccess, data: r });
      },
      error() {
        return dispatch({ type: types.GetOrganizationsError, error: true });
      }
    });
  };
}

export function getBoardsByOrg(token, orgId) {
  return dispatch => {
    dispatch({ type: types.GetOrganizationBoardStart });

    if (!orgId) {
      return dispatch({ type: types.GetOrganizationBoardError, error: new Error('orgId is undefined') });
    }

    dispatch({ type: types.SelectOrganization, data: orgId });

    $.ajax({
      url: '/api/get-organization-boards',
      data: { token, orgId },
      success(r) {
        return dispatch({ type: types.GetOrganizationBoardSuccess, data: r });
      },
      error() {
        return dispatch({ type: types.GetOrganizationBoardError, error: true });
      }
    });
  };
}
