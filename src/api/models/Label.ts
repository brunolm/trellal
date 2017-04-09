import { Entity } from './Entity';

export interface Label extends Entity {
  color: string;
  idBoard: string;
  name: string;
  uses: number;
}
