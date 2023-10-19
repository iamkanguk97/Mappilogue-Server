import { IMAGE_MIME_TYPES, MEDIA_MIME_TYPES } from 'src/constants/constant';
import { BadRequestException } from '@nestjs/common';
import * as _ from 'lodash';
import multer from 'multer';
import { ImageBuilderTypeEnum, MulterBuilder } from './multer.builder';
import { UserExceptionCode } from '../exception-code/user.exception-code';
import { Request } from 'express';

export enum FileTypeEnum {
  IMAGE = 'IMAGE',
  MEDIA = 'MEDIA',
}

export const fileFilter =
  (kind: FileTypeEnum) => (req: Request, file: any, cb: any) => {
    const types =
      kind === FileTypeEnum.IMAGE ? IMAGE_MIME_TYPES : MEDIA_MIME_TYPES;
    const mimeTypes = types.find((im) => im === file.mimetype);

    if (_.isNil(mimeTypes)) {
      cb(
        new BadRequestException(UserExceptionCode.ProfileImageFileFormatError),
        false,
      );
    }

    if (kind === FileTypeEnum.MEDIA) {
      file.originalname = `${new Date().getTime()}`;
    }

    return cb(null, true);
  };

export const CreateProfileImageMulterOption = (): multer.Options => {
  return {
    fileFilter: fileFilter(FileTypeEnum.IMAGE),
    storage: new MulterBuilder(ImageBuilderTypeEnum.UPLOAD)
      .allowImageMimeTypes()
      .setResource('image')
      .setPath('user')
      .build(),
    limits: { fileSize: 1024 * 1024 * 20 },
  };
};
