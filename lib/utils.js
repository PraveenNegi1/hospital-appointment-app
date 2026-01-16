import slugify from 'slugify';

export const generateSlug = (name) => {
  return slugify(name, { lower: true, strict: true });
};