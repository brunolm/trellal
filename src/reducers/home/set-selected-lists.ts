import * as clone from 'clone';

import { Action } from '../base-reducer';
import { InitialState } from './base-reducer';
import { SelectValue } from '../../models';

export default function setSelectedLists(state: typeof InitialState, action: Action<SelectValue>) {
  const selectedLists = clone(action.data);

  return {
    ...state,

    selectedLists,
  };
}
