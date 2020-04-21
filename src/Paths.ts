const HOME : string = parseHome(__dirname);
export {
    HOME
};



function parseHome(path: string) {
    if(path.includes('\\')) {
        return path.substring(0,path.lastIndexOf('\\'));
    } else if(path.includes('/')) {
        return path.substring(0,path.lastIndexOf('/'));
    }
    return path;
}