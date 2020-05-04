/**
 * parses a path to root directory depending on if path uses \ or /.
 * @param path the path to parse.
 */
function parseHome(path: string) {
  if (path.includes('\\')) {
    return path.substring(0, path.lastIndexOf('\\'));
  } if (path.includes('/')) {
    return path.substring(0, path.lastIndexOf('/'));
  }
  return path;
}


const HOME : string = parseHome(__dirname);
export default HOME;
