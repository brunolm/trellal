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

export const InitialState = {
  boards: [] as Board[],
  boardsLoading: false,
  error: undefined,
  filterMyCards: false,
  filteredBoardLists: [] as List[],
  filteredBoards: [],
  filteredLists: [] as Array<{ value: any; label: any; }>,
  organizations: [],
  organizationsLoading: false,
  selectedBoards: [],
  selectedLists: [],
  selectedOrgId: undefined,
  selectedViewMode: undefined,
  user: undefined,
  userLoading: false,
};
