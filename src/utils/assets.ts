export const getAssetPath = (assetPath: string): string => {
  const normalized = assetPath.replace(/^\/+/, '');
  return `${import.meta.env.BASE_URL}${normalized}`;
};
