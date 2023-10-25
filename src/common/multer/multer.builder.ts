import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import * as _ from 'lodash';
import multer from 'multer';
import { IMAGE_MIME_TYPES, MEDIA_MIME_TYPES } from 'src/constants/constant';
import { ENVIRONMENT_KEY } from 'src/modules/core/custom-config/constants/custom-config.constant';
import { Request } from 'express';
import { CustomConfigService } from 'src/modules/core/custom-config/services';
import { config } from 'dotenv';

config();
const customConfigService = new CustomConfigService(new ConfigService());

export enum ImageBuilderTypeEnum {
  UPLOAD = 'UPLOAD',
  DELETE = 'DELETE',
}

export class MulterBuilder {
  private readonly bucketName: string;
  private readonly allowedMimeTypes: Array<string> = [];
  private readonly _userId: number;

  private resource = '';
  private path = '';
  private s3: S3Client | AWS.S3;

  constructor(type: ImageBuilderTypeEnum, userId?: number | undefined) {
    this.s3 = this.setS3(type);
    this._userId = userId;
    this.bucketName = customConfigService.get<string>(
      ENVIRONMENT_KEY.AWS_S3_BUCKET_NAME,
    );
  }

  allowImageMimeTypes(): this {
    this.allowedMimeTypes.push(...IMAGE_MIME_TYPES);
    return this;
  }

  allowMediaMimeTypes(): this {
    this.allowedMimeTypes.push(...MEDIA_MIME_TYPES);
    return this;
  }

  setResource(keyword: string): this {
    this.resource = keyword;
    return this;
  }

  setPath(path: string): this {
    this.path = path;
    return this;
  }

  setS3(type: ImageBuilderTypeEnum): S3Client | AWS.S3 {
    switch (type) {
      case ImageBuilderTypeEnum.UPLOAD:
        return this.setS3WithUpload();
      case ImageBuilderTypeEnum.DELETE:
        return this.setS3WithDelete();
    }
  }

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
        const filename = !_.isNil(this.path)
          ? `${this.path}/user${userId}:${new Date().getTime()}.${extension}`
          : `user${this._userId}:${new Date().getTime()}.${extension}`;

        return callback(null, encodeURI(`${this.resource}/${filename}`));
      },
    });
  }

  async delete(imageKey?: string | undefined): Promise<void> {
    if (!_.isNil(imageKey)) {
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
