import { action } from './base-action';
import mirrorKeys from 'mirror-keys';

export const types = mirrorKeys(undefined, {
  ChangeViewMode: undefined,
});

export function changeViewMode(mode) {
  return { ...action, type: types.ChangeViewMode, data: mode };
}
