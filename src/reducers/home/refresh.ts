import * as boardService from '../../services/board';
import * as clone from 'clone';

import { Action } from '../base-reducer';
import { Board } from '../../api/models';
import { InitialState } from './base-reducer';
import { types } from '../../actions/home';

export default function refresh(state: typeof InitialState, action: Action<any>) {
  switch (action.type) {
    case types.RefreshStart:
      return {
        ...state,
        boardsLoading: true,
      };

    case types.RefreshSuccess: {
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
      };
    }

    case types.RefreshError:
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
