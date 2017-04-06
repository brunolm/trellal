import { action } from './base-action';
import mirrorKeys from 'mirror-keys';

export const types = mirrorKeys(undefined, {
  GetUserError: undefined,
  GetUserStart: undefined,
  GetUserSuccess: undefined,
});

export function getUser(token) {
  return dispatch => {
    dispatch({ ...action, type: types.GetUserStart });

    $.ajax({
      data: { token },
      url: '/api/get-user',
      success(r) {
        return dispatch({ ...action, type: types.GetUserSuccess, data: r });
      },
      error() {
        return dispatch({ ...action, type: types.GetUserError, error: true });
      },
    });
  };
}
