import { Action } from '../base-reducer';
import { InitialState } from './base-reducer';

export default function init(state: typeof InitialState, action: Action<any>) {
  return {
    ...state,

    selectedViewMode: action.data,
  };
}
