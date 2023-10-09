import { CheckColumnInObject, StatusColumn } from 'src/constants';

export type StatusColumnType = (typeof StatusColumn)[keyof typeof StatusColumn];
export type CheckColumnType =
  (typeof CheckColumnInObject)[keyof typeof CheckColumnInObject];
