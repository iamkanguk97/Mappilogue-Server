export class PostMarkCategoryResponseDto {
  private readonly markCategoryId: number;
  private readonly title: string;
  private readonly sequence: number;

  private constructor(markCategoryId: number, title: string, sequence: number) {
    this.markCategoryId = markCategoryId;
    this.title = title;
    this.sequence = sequence;
  }

  static from(
    markCategoryId: number,
    title: string,
    sequence: number,
  ): PostMarkCategoryResponseDto {
    return new PostMarkCategoryResponseDto(markCategoryId, title, sequence);
  }
}
