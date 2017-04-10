import { Action } from '../base-reducer';
import { InitialState } from './base-reducer';
import { action as baseAction } from '../../actions/home/base-action';
import { default as changeViewMode } from './change-view-mode';
import { default as getBoardsByOrg } from './get-boards-by-org';
import { default as getOrganizations } from './get-organizations';
import { default as getUser } from './get-user';
import { default as init } from './init';
import { default as setSelectedBoards } from './set-selected-boards';
import { default as setSelectedLists } from './set-selected-lists';
import { default as toggleUser } from './toggle-user';
import { types } from '../../actions/home';

const reducer = {
  [types.ChangeViewMode]: changeViewMode,
  [types.GetOrganizationBoardError]: getBoardsByOrg,
  [types.GetOrganizationBoardStart]: getBoardsByOrg,
  [types.GetOrganizationBoardSuccess]: getBoardsByOrg,
  [types.GetOrganizationsError]: getOrganizations,
  [types.GetOrganizationsStart]: getOrganizations,
  [types.GetOrganizationsSuccess]: getOrganizations,
  [types.GetUserError]: getUser,
  [types.GetUserStart]: getUser,
  [types.GetUserSuccess]: getUser,
  [types.Init]: init,
  [types.SelectOrganization]: getBoardsByOrg,
  [types.SetSelectedBoards]: setSelectedBoards,
  [types.SetSelectedLists]: setSelectedLists,
  [types.ToggleUser]: toggleUser,
} as { [key: string]: (state: typeof InitialState, action: Action) => any; };

export const home = (state = InitialState, action) => {
  if (action.namespace !== baseAction.namespace) {
    return state;
  }

  return reducer[action.type] ? reducer[action.type](state, action) : state;
};
