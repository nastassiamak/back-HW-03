"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogValidators = exports.findBlogValidator = exports.websiteUrlValidator = exports.descriptionValidator = exports.nameValidator = void 0;
const express_validator_1 = require("express-validator");
const admin_middleware_1 = require("../../global_middlewares/admin-middleware");
const db_1 = require("../../db/db");
const inputCheckErrorsMiddleware_1 = require("../../global_middlewares/inputCheckErrorsMiddleware");
// name: string // max 15
// description: string // max 500
// websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
exports.nameValidator = (0, express_validator_1.body)('name')
    .isString().withMessage('not string')
    .trim().isLength({ min: 1, max: 15 })
    .withMessage('more then 15 or 0');
exports.descriptionValidator = (0, express_validator_1.body)('description')
    .isString().withMessage('not string')
    .trim().isLength({ min: 1, max: 500 })
    .withMessage('more then 500 or 0');
exports.websiteUrlValidator = (0, express_validator_1.body)('websiteUrl')
    .isString().withMessage('not string')
    .trim().isURL().withMessage('not url')
    .isLength({ min: 1, max: 100 }).withMessage('more then 100 or 0');
/*
export const createdAtValidator = body('createdAt')
    .isString()
    .withMessage('not string')
    .trim()
    .matches(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)$/)
    .withMessage('not valid date format');

export const isMembershipValidator = body('isMembership')
    .isBoolean().withMessage('must be a boolean')
    .toBoolean(); // Опционально, чтобы преобразовать входное значение в булевый тип
*/
const findBlogValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (typeof id !== "string" || id.trim().length === 0) {
        res.sendStatus(db_1.HTTP_STATUSES.BAD_REQUEST_400);
    }
    next();
});
exports.findBlogValidator = findBlogValidator;
exports.blogValidators = [
    admin_middleware_1.adminMiddleware,
    exports.nameValidator,
    exports.descriptionValidator,
    exports.websiteUrlValidator,
    //createdAtValidator,
    //isMembershipValidator,
    inputCheckErrorsMiddleware_1.inputCheckErrorsMiddleware,
];
