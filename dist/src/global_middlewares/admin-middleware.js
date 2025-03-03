"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.fromUTF8ToBase64 = exports.fromBase64ToUTF8 = void 0;
const db_1 = require("../db/db");
const setting_1 = require("../setting");
const fromBase64ToUTF8 = (code) => {
    const buffer = Buffer.from(code, 'base64');
    const decodeAuth = buffer.toString('utf8');
    return decodeAuth;
};
exports.fromBase64ToUTF8 = fromBase64ToUTF8;
const fromUTF8ToBase64 = (code) => {
    const buffer = Buffer.from(code, 'utf8');
    const codeAuth = buffer.toString('base64');
    return codeAuth;
};
exports.fromUTF8ToBase64 = fromUTF8ToBase64;
const adminMiddleware = (req, res, next) => {
    const auth = req.headers['authorization']; //Basic XXX
    if (!auth) {
        res
            .status(db_1.HTTP_STATUSES.UNAUTHORIZED_401)
            .json({});
        return;
    }
    if (auth.slice(0, 6) !== 'Basic ') {
        res
            .status(db_1.HTTP_STATUSES.UNAUTHORIZED_401)
            .json({});
        return;
    }
    // const decodedAuth = fromBase64ToUTF8(auth.splice(6))
    const codedAuth = (0, exports.fromUTF8ToBase64)(setting_1.SETTINGS.ADMIN);
    // if(decodedAuth !== SETTINGS.ADMIN)
    if (auth.slice(6) !== codedAuth) {
        res
            .status(db_1.HTTP_STATUSES.UNAUTHORIZED_401)
            .json({});
        return;
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
