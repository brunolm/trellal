import * as boardService from '../../services/board';
import * as clone from 'clone';

import { Action } from '../base-reducer';
import { InitialState } from './base-reducer';
import { SelectValue } from '../../models';

export default function setSelectedBoards(state: typeof InitialState, action: Action<SelectValue[]>) {
  const ids = action.data.map((sel) => sel.value);

  const filteredBoards = boardService.filterItemsByIds(clone(state.boards), ids);
  const filteredBoardLists = boardService.getBoardsLists(filteredBoards);

  const newLists = filteredBoardLists.filter((list) => state.filteredBoardLists.indexOf(list.id) === -1);

  const keepSelected = state.selectedLists.filter((selectValue) => filteredBoardLists.find((list) => list.id === selectValue.value));
  const selectedLists: SelectValue[] =
    [ ...new Set(keepSelected.concat(newLists.map((list) => ({ value: list.id, label: list.name })))) ];

  return {
    ...state,

    filteredBoardLists: filteredBoardLists.map((list) => list.id),
    filteredBoards: filteredBoards.map((board) => board.id),

    selectedBoards: clone(action.data),
    selectedLists,
  };
}
