import { EImageBuilderType, MulterBuilder } from './multer.builder';

/**
 * @summary 이미지 Key Array를 가지고 S3에 업로드 된 이미지 삭제
 * @author  Jason
 * @param   { (string | null)[] } imageKeyList
 */
export const deleteUploadedImageByKeyList = async (
  imageKeyList: (string | null)[],
): Promise<void> => {
  const imageDeleteBuilder = new MulterBuilder(EImageBuilderType.DELETE);

  for (const imageKey of imageKeyList) {
    await imageDeleteBuilder.delete(imageKey);
  }

  return;
};
