import { Card } from './Card';
import { Entity } from './Entity';

export interface List extends Entity {
  name: string;
  cards: Card[];
}
