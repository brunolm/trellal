import { Entity } from './Entity';

export interface Member extends Entity {
  avatarHash: string;
  fullName: string;
  username: string;
  initials: string;
}
