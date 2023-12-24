import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { IMAGE_MIME_TYPES, MEDIA_MIME_TYPES } from 'src/constants/constant';
import { ENVIRONMENT_KEY } from 'src/modules/core/custom-config/constants/custom-config.constant';
import { Request } from 'express';
import { CustomConfigService } from 'src/modules/core/custom-config/services';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { isDefined } from 'src/helpers/common.helper';

import multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

config();
const customConfigService = new CustomConfigService(new ConfigService());

export enum ImageBuilderTypeEnum {
  UPLOAD = 'UPLOAD',
  DELETE = 'DELETE',
}

/**
 * @summary 파일 처리 Builder
 * @author  Jason
 */
export class MulterBuilder {
  private readonly bucketName: string;
  private readonly _userId: number;

  private resource = '';
  private path = '';
  private s3: S3Client | AWS.S3;
  private allowedMimeTypes: Array<string> = [];

  constructor(type: ImageBuilderTypeEnum, userId?: number | undefined) {
    this.s3 = this.setS3(type);
    this._userId = userId;
    this.bucketName = customConfigService.get<string>(
      ENVIRONMENT_KEY.AWS_S3_BUCKET_NAME,
    );
  }

  /**
   * @summary Image Mime Type으로 설정하는 함수
   */
  allowImageMimeTypes(): this {
    this.allowedMimeTypes.push(...IMAGE_MIME_TYPES);
    return this;
  }

  /**
   * @summary Media Mime Type으로 설정하는 함수
   */
  allowMediaMimeTypes(): this {
    this.allowedMimeTypes.push(...MEDIA_MIME_TYPES);
    return this;
  }

  /**
   * @summary     Resource를 설정하는 함수
   * @description Resource는 S3의 Main Directory
   * @param       { string } keyword
   */
  setResource(keyword: string): this {
    this.resource = keyword;
    return this;
  }

  /**
   * @summary     Path를 설정하는 함수
   * @description Path는 위의 Resource의 하위 Directory
   * @param       { string } path
   */
  setPath(path: string): this {
    this.path = path;
    return this;
  }

  /**
   * @summary Upload Builder 또는 Delete Builder를 설정하는 함수
   * @param   { ImageBuilderTypeEnum } type
   * @returns { S3Client | AWS.S3 }
   */
  setS3(type: ImageBuilderTypeEnum): S3Client | AWS.S3 {
    switch (type) {
      case ImageBuilderTypeEnum.UPLOAD:
        return this.setS3WithUpload();
      case ImageBuilderTypeEnum.DELETE:
        return this.setS3WithDelete();
    }
  }

  /**
   * @summary Upload Builder로 설정하는 함수
   * @returns { S3Client }
   */
  setS3WithUpload(): S3Client {
    this.s3 = new S3Client({
      region: customConfigService.get<string>(
        ENVIRONMENT_KEY.AWS_S3_BUCKET_REGION,
      ),
      credentials: {
        accessKeyId: customConfigService.get<string>(
          ENVIRONMENT_KEY.AWS_S3_ACCESS_KEY,
        ),
        secretAccessKey: customConfigService.get<string>(
          ENVIRONMENT_KEY.AWS_S3_SECRET_KEY,
        ),
      },
    });

    return this.s3;
  }

  /**
   * @summary Delete Builder로 설정하는 함수
   * @returns { AWS.S3 }
   */
  setS3WithDelete(): AWS.S3 {
    this.s3 = new AWS.S3({
      accessKeyId: customConfigService.get<string>(
        ENVIRONMENT_KEY.AWS_S3_ACCESS_KEY,
      ),
      secretAccessKey: customConfigService.get<string>(
        ENVIRONMENT_KEY.AWS_S3_SECRET_KEY,
      ),
      region: customConfigService.get<string>(
        ENVIRONMENT_KEY.AWS_S3_BUCKET_REGION,
      ),
    });

    return this.s3;
  }

  /**
   * @summary 파일 Build 함수
   * @returns { multer.StorageEngine }
   */
  build(): multer.StorageEngine {
    return multerS3({
      s3: this.s3 as S3Client,
      bucket: this.bucketName,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (
        req: Request,
        file: Express.Multer.File,
        callback: (error: any, key?: string) => void,
      ) => {
        const userId = req['user'].id;
        const splitedFileNames = file.originalname.split('.');
        const extension = splitedFileNames.at(splitedFileNames.length - 1);
        const filename = isDefined(this.path)
          ? `${this.path}/user${userId}:${new Date().getTime()}.${extension}`
          : `user${userId}:${new Date().getTime()}.${extension}`;

        return callback(null, encodeURI(`${this.resource}/${filename}`));
      },
    });
  }

  /**
   * @summary 기록 이미지 Build 함수
   * @returns { multer.StorageEngine }
   */
  markImageBuild(): multer.StorageEngine {
    return multerS3({
      s3: this.s3 as S3Client,
      bucket: this.bucketName,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (
        req: Request,
        file: Express.Multer.File,
        callback: (error: any, key?: string) => void,
      ) => {
        const splitedFileNames = file.originalname.split('.');
        const extension = splitedFileNames.at(splitedFileNames.length - 1);
        const filename = isDefined(this.path)
          ? `${this.path}/mark:${uuidv4()}.${extension}`
          : `mark:${uuidv4()}.${extension}`; // new Date로 하니까 파일명 중복되는 현상 발생했음 --> uuid로

        return callback(null, encodeURI(`${this.resource}/${filename}`));
      },
    });
  }

  /**
   * @summary 파일 삭제 함수
   * @param   { string } imageKey
   */
  async delete(imageKey: string): Promise<void> {
    if (isDefined(imageKey) && imageKey !== '') {
      console.log(
        customConfigService.get<string>(ENVIRONMENT_KEY.AWS_S3_BUCKET_NAME),
      );
      console.log(imageKey);
      const awsS3 = this.s3 as AWS.S3;
      await awsS3
        .deleteObject({
          Bucket: customConfigService.get<string>(
            ENVIRONMENT_KEY.AWS_S3_BUCKET_NAME,
          ),
          Key: imageKey,
        })
        .promise();
    }
  }
}
