import * as $ from 'jquery';

import mirror from '../utils/mirror';

export const types = mirror('Home', {
  Init: undefined,

  SelectOrganization: undefined,

  GetBoardsSuccess: undefined,
  GetBoardsError: undefined,

  GetOrganizationsSuccess: undefined,
  GetOrganizationsError: undefined,

  GetOrganizationBoardSuccess: undefined,
  GetOrganizationBoardError: undefined,
});

export function init() {
  return { type: types.Init };
}

export function selectOrganization(selectedOrgId) {
  return { type: types.SelectOrganization, data: selectedOrgId };
}

export function getBoards(token) {
  return dispatch => {
    $.ajax({
      url: '/api/get-boards',
      data: { token },
      success(r) {
        return dispatch({ type: types.GetBoardsSuccess, data: r });
      },
      error() {
        return dispatch({ type: types.GetBoardsError, error: true });
      }
    });
  };
}

export function getOrganizations(token) {
  return dispatch => {
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

