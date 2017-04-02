import * as $ from 'jquery';

import mirrorKeys from 'mirror-keys';

export const types = mirrorKeys('Home', {
  GetOrganizationBoardError: undefined,
  GetOrganizationBoardStart: undefined,
  GetOrganizationBoardSuccess: undefined,

  GetOrganizationsError: undefined,
  GetOrganizationsStart: undefined,
  GetOrganizationsSuccess: undefined,

  Init: undefined,

  SelectOrganization: undefined,

  SetSelectedBoards: undefined,
  SetSelectedLists: undefined,
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
      data: { token },
      url: '/api/get-organizations',
      success(r) {
        return dispatch({ type: types.GetOrganizationsSuccess, data: r });
      },
      error() {
        return dispatch({ type: types.GetOrganizationsError, error: true });
      },
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
      data: { token, orgId },
      url: '/api/get-organization-boards',
      success(r) {
        return dispatch({ type: types.GetOrganizationBoardSuccess, data: r });
      },
      error() {
        return dispatch({ type: types.GetOrganizationBoardError, error: true });
      },
    });
  };
}
