type Primitive = number | Date | string | boolean | undefined | null | bigint;

export type TPickPrimitive<Entity extends object> = {
  [key in keyof Entity as Entity[key] extends Primitive
    ? key
    : never]: Entity[key];
};
