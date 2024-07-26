const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).send('Authorization header missing');
    }
    if (authHeader !== '123456789') {
        return res.status(402).send('Invalid Authorization');
    }
    next();
};

module.exports = { checkAuth };
