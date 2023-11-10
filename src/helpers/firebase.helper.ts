import * as path from 'path';

/**
 * @title firebase-admin.json 경로 설정해주는 함수
 * @param dirname
 * @returns
 */
export function setFirebaseCredential(dirname: string): string {
  switch (process.env.TEMP) {
    case 'dev2':
      return path.join(dirname, '..', 'src/config/firebase-admin.json');
    default:
      return path.join(
        dirname,
        '..',
        '..',
        '..',
        '..',
        'config/firebase-admin.json',
      );
  }
}