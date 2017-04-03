import { action } from './base-action';
import mirrorKeys from 'mirror-keys';

export const types = mirrorKeys(undefined, {
  SetSelectedBoards: undefined,
});

export function setSelectedBoards(boards) {
  return { ...action, type: types.SetSelectedBoards, data: boards };
}
