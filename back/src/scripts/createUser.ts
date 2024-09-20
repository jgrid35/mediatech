import { Users } from "../types/userSchema.js";
import { config } from "../config.js";
import { getDbConnection } from "../mongodb.js";
import bcrypt from 'bcryptjs'

var args = process.argv.slice(2);

getDbConnection(config.mongodb.uri);

await Users.findOneAndUpdate({ username: args[0] }, { username: args[0], password: await bcrypt.hash(args[1], 10) }, { upsert: true });

process.exit(0);