import { action } from './base-action';
import mirrorKeys from 'mirror-keys';

export const types = mirrorKeys(undefined, {
  GetOrganizationsError: undefined,
  GetOrganizationsStart: undefined,
  GetOrganizationsSuccess: undefined,
});

export function getOrganizations(token) {
  return (dispatch) => {
    dispatch({ ...action, type: types.GetOrganizationsStart });
    $.ajax({
      data: { token },
      url: '/api/get-organizations',
      success(r) {
        return dispatch({ ...action, type: types.GetOrganizationsSuccess, data: r });
      },
      error() {
        return dispatch({ ...action, type: types.GetOrganizationsError, error: true });
      },
    });
  };
}
