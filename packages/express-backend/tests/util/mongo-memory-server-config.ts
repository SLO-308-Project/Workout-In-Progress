import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

// Sets up in memory mongodb server
const connect = async () =>
{
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
};

// Closes server
const close = async () =>
{
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
};

export {connect, close};
