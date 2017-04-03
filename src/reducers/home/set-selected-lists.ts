import * as clone from 'clone';

import { Action } from '../base-reducer';
import { InitialState } from './base-reducer';

export default function init(state: typeof InitialState, action: Action) {
  const filteredBoardLists = clone(state.filteredBoards)
    .map(board => board.lists || [])
    .reduce((a, next) => a.concat(next), [])
    .sort((a, b) => a.name.localeCompare(b.name));

  const selectedLists = clone(action.data);

  const filteredLists = clone(filteredBoardLists)
    .filter(list => selectedLists.find(sl => sl.value === list.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    ...state,

    filteredBoardLists,
    filteredLists,

    selectedLists,
  };
}
