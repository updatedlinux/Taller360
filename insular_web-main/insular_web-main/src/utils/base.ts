export const withBase = (path: string) => {
  const raw = import.meta.env.BASE_URL || '/';
  const base = raw.endsWith('/') ? raw : raw + '/';
  const p = (path || '').replace(/^\/+/, '');
  return base + p;
};
