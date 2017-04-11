import { Action } from '../base-reducer';
import { InitialState } from './base-reducer';

export default function toggleUser(state: typeof InitialState, action: Action<any>) {
  return {
    ...state,
    filterMyCards: !state.filterMyCards,
  };
}
