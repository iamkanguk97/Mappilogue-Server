export type TMarkImages =
  | {
      [fieldname: string]: Express.Multer.File[];
    }
  | Express.Multer.File[];
