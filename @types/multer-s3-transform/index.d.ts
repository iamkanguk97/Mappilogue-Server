declare module 'multer-s3-transform' {
  // import { S3Client } from '@aws-sdk/client-s3';
  import S3 from 'aws-sdk/clients/s3';
  import { StorageEngine } from 'multer';
  import { Sharp } from 'sharp';

  interface Itransform {
    id: string; //'original'/ 'thumbnail'
    key?(
      req: Express.Request,
      file: Express.Multer.File,
      callback: (error: any, key?: string) => void,
    ): void;
    transform(
      req: Express.Request,
      file: Express.Multer.File,
      callback: (error: any, sharpInstance: Sharp) => void,
    ): void;
  }

  interface Options {
    s3: S3;
    bucket:
      | ((
          req: Express.Request,
          file: Express.Multer.File,
          callback: (error: any, bucket?: string) => void,
        ) => void)
      | string;
    key?(
      req: Express.Request,
      file: Express.Multer.File,
      callback: (error: any, key?: string) => void,
    ): void;
    acl?:
      | ((
          req: Express.Request,
          file: Express.Multer.File,
          callback: (error: any, acl?: string) => void,
        ) => void)
      | string
      | undefined;
    contentType?(
      req: Express.Request,
      file: Express.Multer.File,
      callback: (
        error: any,
        mime?: string,
        stream?: NodeJS.ReadableStream,
      ) => void,
    ): void;
    contentDisposition?:
      | ((
          req: Express.Request,
          file: Express.Multer.File,
          callback: (error: any, contentDisposition?: string) => void,
        ) => void)
      | string
      | undefined;
    metadata?(
      req: Express.Request,
      file: Express.Multer.File,
      callback: (error: any, metadata?: any) => void,
    ): void;
    cacheControl?:
      | ((
          req: Express.Request,
          file: Express.Multer.File,
          callback: (error: any, cacheControl?: string) => void,
        ) => void)
      | string
      | undefined;
    serverSideEncryption?:
      | ((
          req: Express.Request,
          file: Express.Multer.File,
          callback: (error: any, serverSideEncryption?: string) => void,
        ) => void)
      | string
      | undefined;
    shouldTransform?(
      req: Express.Request,
      file: Express.Multer.File,
      callback: (error: any, should: boolean) => void,
    ): void;
    transforms?: Itransform[];
  }
  interface S3Storage {
    (options?: Options): StorageEngine;

    AUTO_CONTENT_TYPE(
      req: Express.Request,
      file: Express.Multer.File,
      callback: (
        error: any,
        mime?: string,
        stream?: NodeJS.ReadableStream,
      ) => void,
    ): void;
    DEFAULT_CONTENT_TYPE(
      req: Express.Request,
      file: Express.Multer.File,
      callback: (error: any, mime?: string) => void,
    ): void;
  }
  declare const s3Storage: S3Storage;
  export = s3Storage;
}
