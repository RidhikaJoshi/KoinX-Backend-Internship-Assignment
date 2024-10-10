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
exports.asyncHandler = void 0;
const asyncHandler = (fn) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // fn is a function that is passed as a parameter
        // fn is an async function that takes req, res, next as parameters
        yield fn(req, res, next);
    }
    catch (error) {
        // error is of type unknown
        // error is casted to an object with code and message properties
        // statusCode is assigned the value of code if code is between 100 and 600
        const err = error;
        const statusCode = (err.code && err.code >= 100 && err.code < 600) ? err.code : 500;
        res.status(statusCode).json({
            success: false,
            message: err.message || "Something went wrong",
        });
    }
}); // higher order function
exports.asyncHandler = asyncHandler;
