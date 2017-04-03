import { action } from './base-action';
import mirrorKeys from 'mirror-keys';

export const types = mirrorKeys(undefined, {
  SetSelectedLists: undefined,
});

export function setSelectedLists(lists) {
  return { ...action, type: types.SetSelectedLists, data: lists };
}
