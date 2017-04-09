import { Entity } from './Entity';
import { Label } from './Label';

export interface Card extends Entity {
  idMembers: string[];
  idShort: number;
  labels: Label[];
  name: string;
  shortUrl: string;
}
