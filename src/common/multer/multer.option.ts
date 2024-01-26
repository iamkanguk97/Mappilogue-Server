import {
  IMAGE_MIME_TYPES,
  MEDIA_MIME_TYPES,
  S3_BASE_IMAGE_DIRECTORY,
} from 'src/constants/constant';
import { BadRequestException } from '@nestjs/common';
import { ImageBuilderTypeEnum, MulterBuilder } from './multer.builder';
import { UserExceptionCode } from '../exception-code/user.exception-code';
import { Request } from 'express';
import { DomainNameEnum } from 'src/constants/enum';
import { isDefined } from 'src/helpers/common.helper';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export enum FileTypeEnum {
  IMAGE = 'IMAGE',
  MEDIA = 'MEDIA',
}

/**
 * @summary 파일 유효성 확인 함수
 * @author  Jason
 * @param   { FileTypeEnum } kind
 */
export const fileFilter =
  (kind: FileTypeEnum) =>
  (
    _: Request,
    file: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    },
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const types =
      kind === FileTypeEnum.IMAGE ? IMAGE_MIME_TYPES : MEDIA_MIME_TYPES;
    const mimeTypes = types.find((im) => im === file.mimetype);

    if (!isDefined(mimeTypes)) {
      cb(
        new BadRequestException(UserExceptionCode.ImageFileFormatError),
        false,
      );
    }

    if (kind === FileTypeEnum.MEDIA) {
      file.originalname = `${new Date().getTime()}`;
    }

    return cb(null, true);
  };

/**
 * @summary 프로필 이미지 업로드 Multer 옵션
 * @author  Jason
 * @returns { MulterOptions }
 */
export const CreateProfileImageMulterOption = (): MulterOptions => {
  return {
    fileFilter: fileFilter(FileTypeEnum.IMAGE),
    storage: new MulterBuilder(ImageBuilderTypeEnum.UPLOAD)
      .allowImageMimeTypes()
      .setResource(S3_BASE_IMAGE_DIRECTORY)
      .setPath(DomainNameEnum.USER)
      .build(),
    limits: { fileSize: 1024 * 1024 * 20 },
  };
};

/**
 * @summary 기록 이미지 업로드 Multer 옵션
 * @author  Jason
 * @returns { MulterOptions }
 */
export const CreateMarkImageMulterOption = (): MulterOptions => {
  return {
    fileFilter: fileFilter(FileTypeEnum.IMAGE),
    storage: new MulterBuilder(ImageBuilderTypeEnum.UPLOAD)
      .allowImageMimeTypes()
      .setResource(S3_BASE_IMAGE_DIRECTORY)
      .setPath(DomainNameEnum.MARK)
      .markImageBuild(),
    limits: { fileSize: 1024 * 1024 * 20 },
  };
};
