import * as clone from 'clone';

import { Action } from '../base-reducer';
import { InitialState } from './base-reducer';
import { types } from '../../actions/home';

export default function getBoardsByOrg(state: typeof InitialState, action: Action) {
  switch (action.type) {
    case types.GetOrganizationBoardStart:
      return {
        ...state,
        boardsLoading: true,
      };

    case types.GetOrganizationBoardSuccess: {
      const boards = clone(action.data);
      const filteredBoards = clone(action.data);
      const filteredBoardLists = clone(filteredBoards)
        .map((board) => board.lists || [])
        .reduce((a, next) => a.concat(next), [])
        .sort((a, b) => a.name.localeCompare(b.name));

      const filteredLists = clone(filteredBoardLists)
        .sort((a, b) => a.name.localeCompare(b.name));

      return {
        ...state,
        boards,
        filteredBoards,

        filteredBoardLists,
        filteredLists,

        boardsLoading: false,

        selectedBoards: clone(boards).map((board) => ({ value: board.id, label: board.name })),
        selectedLists: clone(filteredLists)
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
