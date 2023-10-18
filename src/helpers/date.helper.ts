/**
 * @title 한국 시간 구하는 함수
 */
export const getKoreaTime = () => {
  const offset = 1000 * 60 * 60 * 9;
  const koreaNow = new Date(new Date().getTime() + offset);
  return koreaNow.toISOString();
};
