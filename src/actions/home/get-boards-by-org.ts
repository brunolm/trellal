import { action } from './base-action';
import mirrorKeys from 'mirror-keys';

export const types = mirrorKeys(undefined, {
  GetOrganizationBoardError: undefined,
  GetOrganizationBoardStart: undefined,
  GetOrganizationBoardSuccess: undefined,
  SelectOrganization: undefined,
});

export function getBoardsByOrg(token, orgId) {
  return (dispatch) => {
    dispatch({ ...action, type: types.GetOrganizationBoardStart });

    if (!orgId) {
      return dispatch({ ...action, type: types.GetOrganizationBoardError, error: new Error('orgId is undefined') });
    }

    dispatch({ ...action, type: types.SelectOrganization, data: orgId });

    $.ajax({
      data: { token, orgId },
      url: '/api/get-organization-boards',
      success(r) {
        return dispatch({ ...action, type: types.GetOrganizationBoardSuccess, data: r });
      },
      error() {
        return dispatch({ ...action, type: types.GetOrganizationBoardError, error: true });
      },
    });
  };
}
