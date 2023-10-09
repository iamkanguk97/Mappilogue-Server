export const TERMS_OF_SERVICE_URL = 'This is terms-of-service url';

export const StatusColumn = {
  ACTIVE: 'ACTIVE',
  DELETED: 'DELETED',
} as const;

export const CheckColumnInArray = ['ACTIVE', 'INACTIVE'] as const;
export const CheckColumnInObject = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;
