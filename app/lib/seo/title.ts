// Корневой layout дописывает к title « | aidardev». Google показывает около 65 символов,
// поэтому бренд добавляем, только если он помещается целиком.
const BRAND_SUFFIX = ' | aidardev';
export const MAX_TITLE_LENGTH = 65;

export function fitTitle(title: string): string | { absolute: string } {
  return title.length + BRAND_SUFFIX.length > MAX_TITLE_LENGTH ? { absolute: title } : title;
}
