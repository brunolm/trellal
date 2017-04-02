import * as clone from 'clone';

import { types } from '../actions/home';

interface Board {
  id: string;
  name: string;
  lists: List[];
}

interface List {
  cards: any[];
  id: string;
  name: string;
}

const InitialState = {
  title: 'TypeScript rocks!',
  boards: [] as Board[],
  filteredBoards: [],
  filteredBoardLists: [] as List[],
  filteredLists: [] as { value: any; label: any; }[],
  organizations: [],
  selectedOrgId: undefined,
  error: undefined,
  boardsLoading: false,
  organizationsLoading: false,
  selectedBoards: [],
  selectedLists: [],
};

const home = (state = InitialState, action) => {
  switch (action.type) {
    case types.Init:
      return clone(InitialState);

    case types.SetSelectedBoards: {
      const ids = action.data.map(sel => sel.value);
      const filteredBoards = clone(state.boards).filter(board => ids.find(id => id === board.id));
      const filteredBoardLists = clone(filteredBoards)
        .map(board => board.lists || [])
        .reduce((a, next) => a.concat(next), [])
        .sort((a, b) => a.name.localeCompare(b.name));

      const filteredLists = clone(filteredBoardLists)
        .filter(list => state.selectedLists.find(sl => sl.value === list.id))
        .sort((a, b) => a.name.localeCompare(b.name));

      const selectedLists = clone(filteredLists)
        .map(list => ({ value: list.id, label: list.name }))
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

    case types.SetSelectedLists: {
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

    case types.SelectOrganization:
      return {
        ...state,
        selectedOrgId: action.data,
      };

    case types.GetOrganizationsStart:
      return {
        ...state,
        organizationsLoading: true,
      };
    case types.GetOrganizationsSuccess:
      return {
        ...state,
        organizations: action.data,
        organizationsLoading: false,
      };
    case types.GetOrganizationsError:
      return {
        ...state,
        organizations: [],
        error: true,
        organizationsLoading: false,
      };

    case types.GetOrganizationBoardStart:
      return {
        ...state,
        boardsLoading: true,
      };
    case types.GetOrganizationBoardSuccess: {
      const boards = clone(action.data);
      const filteredBoards = clone(action.data);
      const filteredBoardLists = clone(filteredBoards)
        .map(board => board.lists || [])
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

        selectedBoards: clone(boards).map(board => ({ value: board.id, label: board.name })),
        selectedLists: clone(filteredLists)
          .map(list => ({ value: list.id, label: list.name }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      };
    }
    case types.GetOrganizationBoardError:
      return {
        ...state,
        boards: [],
        error: true,
        boardsLoading: false,
        selectedBoards: [],
        selectedLists: [],
      };

    default:
      return state;
  }
};

export default home;
