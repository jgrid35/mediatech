import { config } from 'config.js';
import { Sequelize, DataTypes, Model } from 'sequelize';

// Initialize Sequelize with your database configuration
const sequelize = new Sequelize({
    dialect: 'sqlite', // Change this to your preferred dialect (e.g., 'mysql', 'postgres')
    storage: config.database.path // Update with your SQLite database path or connection details for other databases
});

// Define the User interface
interface UserAttributes {
    username: string;
    password: string;
    role?: string | null; // Optional property
}

// Define the User model
class User extends Model<UserAttributes> implements UserAttributes {
    public username!: string; // Note the exclamation mark for non-null assertion
    public password!: string;
    public role?: string | null;
}

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false, // Required field
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false, // Required field
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true, // Not required
    }
}, {
    sequelize, // Pass the `sequelize` instance
    modelName: 'User', // Name of the model
    timestamps: false, // Disable timestamps (createdAt, updatedAt) if not needed
});

await sequelize.sync({ force: false });
    
// Export the model
export { User };