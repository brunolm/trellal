import { action } from './base-action';
import mirrorKeys from 'mirror-keys';

export const types = mirrorKeys(undefined, {
  ToggleUser: undefined,
});

export function toggleUser(token) {
  return { ...action, type: types.ToggleUser };
}
