import { User } from "../types/userSchema.js";
import bcrypt from 'bcryptjs'

var args = process.argv.slice(2);

// Attempt to find the user or create a new one
const [user, created] = await User.findOrCreate({
    where: { username: args[0] },
    defaults: {
        password: await bcrypt.hash(args[1], 10),
    }
});

// If the user was found, update the password
if (!created) {
    user.password = await bcrypt.hash(args[1], 10);
    await user.save();
}

console.log(created ? 'User created' : 'User updated');

process.exit(0);