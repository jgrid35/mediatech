import mongoose, { Mongoose } from "mongoose";

let instance: Mongoose | null = null;

export const getDbConnection = async (uri: string) => {
    if (Boolean(instance)) return instance
    try {
        console.log(`MongoDB - connecting to ${uri}`);
        instance = await mongoose.connect(uri);
    }
    catch (err) {
        console.log(`MongoDB - can't connect to ${uri}`, err);
    }
    return instance
}