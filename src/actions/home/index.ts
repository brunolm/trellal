export { changeViewMode } from './change-view-mode';
export { getBoardsByOrg } from './get-boards-by-org';
export { getOrganizations } from './get-organizations';
export { getUser } from './get-user';
export { init } from './init';
export { setSelectedBoards } from './set-selected-boards';
export { setSelectedLists } from './set-selected-lists';
export { toggleUser } from './toggle-user';

import { types as changeViewModeTypes } from './change-view-mode';
import { types as getBoardsByOrgTypes } from './get-boards-by-org';
import { types as getOrganizationsTypes } from './get-organizations';
import { types as getUserTypes } from './get-user';
import { types as initTypes } from './init';
import { types as setSelectedBoardsTypes } from './set-selected-boards';
import { types as setselectedListsTypes } from './set-selected-lists';
import { types as toggleUserTypes } from './toggle-user';

export const types = {
  ...changeViewModeTypes,
  ...getBoardsByOrgTypes,
  ...getOrganizationsTypes,
  ...getUserTypes,
  ...initTypes,
  ...setSelectedBoardsTypes,
  ...setselectedListsTypes,
  ...toggleUserTypes,
};
