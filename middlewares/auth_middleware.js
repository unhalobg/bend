// @ts-check

const jwt = require("jsonwebtoken");

var apiMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.spsecretkey) throw "No Permission";

        /**
         * @var {string} spSecretKey
         */
        const spSecretKey = req.headers.spsecretkey.trim();

        if (process.env.API_SECRET)
        {
            const verifiedSpSecretKey = jwt.verify(spSecretKey, process.env.API_SECRET);
            if (verifiedSpSecretKey == process.env.API_SECRET) {
                next();
            } else {
                throw "No Permission";
            }
        } else {
				res.status(404).json({
				error: true,
				message: "Environment variable missing",
				data: null,
			});
		}
        
    } catch (error) {
        res.status(403).json({
            error: true,
            message: error,
            data: null,
        });
    }
}

var authMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization) throw "No Authorization";

        const token = req.headers.authorization.split("Bearer")[1].trim();

        if (process.env.TOKEN_SECRET)
        {
            /**
            * @var {string | jwt.JwtPayload} payload
            */
            const payload = jwt.verify(token, process.env.TOKEN_SECRET);
            req.payload = payload;
            next();
        } else {
				res.status(404).json({
				error: true,
				message: "Environment variable missing",
				data: null,
			});
		}
    } catch (error) {
        res.status(403).json({
            error: true,
            message: "You need to be logged in to perform this action",
            data: null,
        });
    }
}

module.exports = {
    apiMiddleware,
    authMiddleware,
}