import * as qs from 'qs';

import axios from 'axios';

export default function trello(token) {
  const key = process.env.TRELLO_KEY;
  const keys = { key, token };

  const req = axios.create({ baseURL: 'https://api.trello.com/1' });

  return {
    getBoardLists: async (boardId) => await getBoardLists(req, keys, boardId),
    getBoardMembers: async (boardId) => await getBoardMembers(req, keys, boardId),
    getBoards: async () => await getBoards(req, keys),
    getOrganizationBoards: async (orgId) => await getOrganizationBoards(req, keys, orgId),
    getOrganizations: async () => await getOrganizations(req, keys),
    getUser: async (id?) => await getUser(req, keys, id || 'me'),
  };
}

function getQuery(keys, params?) {
  return qs.stringify({ ...keys, ...params });
}

async function getUser(req, keys, id) {
  const { data } = await req.get(`/members/${id}?${getQuery(keys)}`);
  return data;
}

async function getBoards(req, keys) {
  const { data } = await req.get(`/boards/me?${getQuery(keys)}`);
  return data;
}

async function getOrganizations(req, keys) {
  const { data } = await req.get(`/members/me/organizations?fields=displayName&${getQuery(keys)}`);
  data.sort((a, b) => a.displayName.localeCompare(b.displayName));
  return data;
}

async function getOrganizationBoards(req, keys, orgId) {
  const { data } = await req.get(`/organizations/${orgId}/boards?filter=open&fields=prefs,name&${getQuery(keys)}`);

  for (const board of data) {
    board.lists = await getBoardLists(req, keys, board.id);
    board.members = await getBoardMembers(req, keys, board.id);
  }

  data.sort((a, b) => a.name.localeCompare(b.name));
  return data;
}

async function getBoardLists(req, keys, boardId) {
  const { data } = await req.get(`/boards/${boardId}/lists?cards=open&fields=name,pos&filter=open&${getQuery(keys)}`);
  return data;
}

async function getBoardMembers(req, keys, boardId) {
  const { data } = await req.get(`/boards/${boardId}/members?fields=avatarHash,fullName,username,initials&${getQuery(keys)}`);
  return data;
}
