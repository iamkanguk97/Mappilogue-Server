import * as path from 'path';

export function setFirebaseCredential(dirname: string) {
  switch (process.env.TEMP) {
    case 'dev2':
      return path.join(dirname, '..', 'src/config/firebase-admin.json');
    case 'dev1':
      return path.join(dirname, '..', '..', 'config/firebase-admin.json');
  }
}
