import { Entity } from './Entity';
import { Member } from './Member';

export interface Board extends Entity {
  lists: any;
  members: Member[];
  name: string;
  prefs: any;
}
