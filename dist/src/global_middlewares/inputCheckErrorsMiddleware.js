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
exports.inputCheckErrorsMiddleware = void 0;
const express_validator_1 = require("express-validator");
const db_1 = require("../db/db");
const inputCheckErrorsMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const e = (0, express_validator_1.validationResult)(req);
    if (!e.isEmpty()) {
        const eArray = e.array({ onlyFirstError: true });
        res
            .status(db_1.HTTP_STATUSES.BAD_REQUEST_400)
            .json({
            errorsMessages: eArray.map(x => ({ field: x.path, message: x.msg }))
        });
        return;
    }
    next();
});
exports.inputCheckErrorsMiddleware = inputCheckErrorsMiddleware;
