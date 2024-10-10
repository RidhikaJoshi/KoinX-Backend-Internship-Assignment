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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contants_1 = require("../contants");
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // connect to mongodb
        const connectionInstance = yield mongoose_1.default.connect(`${process.env.MONGODB_URI}/${contants_1.DB_NAME}`); // mongoose gives you returned object
        console.log(`MongoDb connected, DB HOST: ${connectionInstance.connection.host}`);
    }
    catch (error) {
        //  if error occurs while connecting to database
        console.log("Error occurred while connecting to database", error);
        process.exit(1);
    }
});
exports.default = connectDB;
