import {HTTP_STATUSES} from "../db/db";
import {Request, Response, NextFunction} from "express";
import {SETTINGS} from "../setting";


export const fromBase64ToUTF8 = (code: string) => {
    const buffer = Buffer.from(code, 'base64');
        const decodeAuth = buffer.toString('utf8');
        return decodeAuth;
}

export const fromUTF8ToBase64 = (code: string) => {
    const buffer = Buffer.from(code, 'utf8');
    const codeAuth = buffer.toString('base64');
    return codeAuth;
}

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'] as string //Basic XXX
    if (!auth) {
        res
            .status(HTTP_STATUSES.UNAUTHORIZED_401)
            .json({})
        return;
    }

    if(auth.slice(0, 6) !== 'Basic ') {
        res
            .status(HTTP_STATUSES.UNAUTHORIZED_401)
            .json({})
        return;
    }

    // const decodedAuth = fromBase64ToUTF8(auth.splice(6))
    const codedAuth = fromUTF8ToBase64(SETTINGS.ADMIN)


   // if(decodedAuth !== SETTINGS.ADMIN)
    if (auth.slice(6) !== codedAuth) {
        res
            .status(HTTP_STATUSES.UNAUTHORIZED_401)
            .json({})
        return;
    }

    next()

}