export { init } from './init';
export { setSelectedBoards } from './set-selected-boards';
export { setSelectedLists } from './set-selected-lists';
export { getOrganizations } from './get-organizations';
export { getBoardsByOrg } from './get-boards-by-org';

import { types as getBoardsByOrgTypes } from './get-boards-by-org';
import { types as getOrganizationsTypes } from './get-organizations';
import { types as initTypes } from './init';
import { types as setSelectedBoardsTypes } from './set-selected-boards';
import { types as setselectedListsTypes } from './set-selected-lists';

export const types = {
  ...initTypes,
  ...setSelectedBoardsTypes,
  ...setselectedListsTypes,
  ...getOrganizationsTypes,
  ...getBoardsByOrgTypes,
};
