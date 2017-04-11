import { action } from './base-action';
import mirrorKeys from 'mirror-keys';

export const types = mirrorKeys(undefined, {
  RefreshError: undefined,
  RefreshStart: undefined,
  RefreshSuccess: undefined,
  SelectOrganization: undefined,
});

export function refresh(token, orgId) {
  return (dispatch) => {
    dispatch({ ...action, type: types.RefreshStart });

    if (!orgId) {
      return dispatch({ ...action, type: types.RefreshError, error: new Error('orgId is undefined') });
    }

    dispatch({ ...action, type: types.SelectOrganization, data: orgId });

    $.ajax({
      data: { token, orgId },
      url: '/api/get-organization-boards',
      success(r) {
        return dispatch({ ...action, type: types.RefreshSuccess, data: r });
      },
      error() {
        return dispatch({ ...action, type: types.RefreshError, error: true });
      },
    });
  };
}
