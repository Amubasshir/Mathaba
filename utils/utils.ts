export function getParentPath(pathname: string) {
  if (!pathname || pathname === '/') {
    return '/';
  }
  
  const cleanPath = pathname.endsWith('/') && pathname !== '/' 
    ? pathname.slice(0, -1) 
    : pathname;
  
  const lastSlashIndex = cleanPath.lastIndexOf('/');
  
  if (lastSlashIndex <= 0) {
    return '/';
  }
  
  return cleanPath.substring(0, lastSlashIndex);
}