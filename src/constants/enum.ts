export enum EStatusColumn {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

export enum ECheckColumn {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum EStatusOrCheckColumnLength {
  CHECK = 10,
  STATUS = 10,
}

export enum EDomainName {
  COLOR = 'colors',
  USER = 'users',
  USER_PROFILE = 'user-profiles',
  USER_HOME = 'users/homes',
  MARK = 'marks',
  MARK_CATEGORY = 'mark-categories',
  SCHEDULE = 'schedules',
}

export enum EDefaultPagination {
  DEFAULT_PAGE_NO = 1,
  DEFAULT_PAGE_SIZE = 10,
}

export enum EPromiseStatus {
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}
