export const UrlSlicer = function(req, res, next) {
    if (req.path.substr(-1) == '/' && req.path.length > 1) {
        const query = req.url.slice(req.path.length);
        return res.redirect(req.path.slice(0, -1) + query);
    } else {
        return next();
    }
};
