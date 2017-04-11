import { Board } from '../../api/models';

export const InitialState = {
  boards: [] as Board[],
  boardsLoading: false,
  error: undefined,
  filterMyCards: false,
  filteredBoardLists: [] as string[],
  filteredBoards: [] as string[],
  filteredLists: [] as string[],
  organizations: [],
  organizationsLoading: false,
  selectedBoards: [],
  selectedLists: [],
  selectedOrgId: undefined,
  selectedViewMode: undefined,
  user: undefined,
  userLoading: false,
};
