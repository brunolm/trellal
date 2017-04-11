import * as clone from 'clone';

import { Board, Entity, List } from '../api/models';

import { SelectValue } from '../models';

export function filterItemsByIds<T extends Entity>(items: T[], ids: string[]) {
  return items.filter((item) => ids.find((id) => id === item.id));
}

export function getBoardsLists(boards: Board[]): List[] {
  return boards
    .map((boardItem) => boardItem.lists || [])
    .reduce((a, next) => a.concat(next), []);
}

export function getSingleBoard(boards: Board[], selectedLists: SelectValue[], props: { filterMyCards: boolean; selectedViewMode: string; user: any }) {
  if (!boards || !boards.length) {
    return undefined;
  }

  let singleBoard;

  if (!props.selectedViewMode) {
    singleBoard = clone(boards).reduce((board, next) => {
      board.names.push(next.name);

      const lists = this.filterItemsByIds(next.lists, selectedLists.map(({ value }) => value));
      board.lists = board.lists.concat(lists.map((list) => ({ ...list, user: props.user, boardName: next.name })));

      board.members = board.members.concat(next.members.filter((member) => !board.members.find((bm) => bm.id === member.id)));

      (board as any).filterMyCards = props.filterMyCards;
      (board as any).user = props.user;

      if (!board.prefs) {
        board.prefs = next.prefs;
      }
      return board;
    }, { name: '', names: [], lists: [], members: [], prefs: undefined });

    singleBoard.name = singleBoard.names.join(', ');

    const lists = singleBoard.lists.reduce((list, next) => {
      const name = next.name.replace(/\s[\(\[].*?[\)\]]/g, '');
      const hashName = name.toLowerCase();
      const mapBoardName = (card) => ({ ...card, boardName: next.boardName });

      list[hashName] = {
        ...next,
        name,
        cards: list[hashName]
          ? list[hashName].cards.concat(next.cards.map(mapBoardName))
          : next.cards.map(mapBoardName),
      };
      return list;
    }, {});

    singleBoard.lists = Object.keys(lists).reduce((list, next) => {
      list.push(lists[next]);
      return list;
    }, []);

    // console.log('singleBoard.lists', singleBoard.lists);

    return singleBoard;
  }
}
