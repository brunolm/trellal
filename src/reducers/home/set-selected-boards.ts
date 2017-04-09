import * as clone from 'clone';

import { Action } from '../base-reducer';
import { InitialState } from './base-reducer';

export default function init(state: typeof InitialState, action: Action) {
  const ids = action.data.map((sel) => sel.value);
  const filteredBoards = clone(state.boards).filter((board) => ids.find((id) => id === board.id));
  const filteredBoardLists = clone(filteredBoards)
    .map((board) => board.lists || [])
    .reduce((a, next) => a.concat(next), [])
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredLists = clone(filteredBoardLists)
    .filter((list) => state.selectedLists.find((sl) => sl.value === list.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  const selectedLists = clone(filteredLists)
    .map((list) => ({ value: list.id, label: list.name }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return {
    ...state,

    filteredBoards,
    selectedBoards: clone(action.data),

    filteredBoardLists,
    filteredLists,

    selectedLists,
  };
}
