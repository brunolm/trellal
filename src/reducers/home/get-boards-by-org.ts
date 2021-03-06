import * as boardService from '../../services/board';
import * as clone from 'clone';

import { Action } from '../base-reducer';
import { Board } from '../../api/models';
import { InitialState } from './base-reducer';
import { types } from '../../actions/home';

export default function getBoardsByOrg(state: typeof InitialState, action: Action<any>) {
  switch (action.type) {
    case types.GetOrganizationBoardStart:
      return {
        ...state,
        boardsLoading: true,
      };

    case types.GetOrganizationBoardSuccess: {
      const boards = clone(action.data);
      const filteredBoards = clone(action.data).map((board) => board.id);
      const filteredBoardLists = boardService.getBoardsLists(boardService.filterItemsByIds<Board>(clone(boards), filteredBoards))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((list) => list.id);

      const filteredLists = clone(filteredBoardLists);

      return {
        ...state,
        boards,
        filteredBoards,

        filteredBoardLists,
        filteredLists,

        boardsLoading: false,

        selectedBoards: clone(boards).map((board) => ({ value: board.id, label: board.name })),
        selectedLists: boardService.filterItemsByIds(boardService.getBoardsLists(clone(boards)), filteredLists)
          .map((list) => ({ value: list.id, label: list.name }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      };
    }

    case types.GetOrganizationBoardError:
      return {
        ...state,
        boards: [],
        boardsLoading: false,
        error: true,
        selectedBoards: [],
        selectedLists: [],
      };

    case types.SelectOrganization:
      return {
        ...state,
        selectedOrgId: action.data,
      };

    default:
      return state;
  }
}
