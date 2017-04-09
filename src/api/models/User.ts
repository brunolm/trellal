import { Entity } from './Entity';

export interface User extends Entity {
  avatarHash: string;
  username: string;
}
