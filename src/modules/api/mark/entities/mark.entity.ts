import { DefaultColumnType } from 'src/types/default-column.type';
import { Entity } from 'typeorm';

@Entity('Mark')
export class MarkEntity extends DefaultColumnType {}
