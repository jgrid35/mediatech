import mongoose, { Mongoose } from "mongoose";

let instance: Mongoose | null = null;

export const getDbConnection = async (uri: string) => {
    if (Boolean(instance)) return instance
    instance = await mongoose.connect(uri);
    return instance
}