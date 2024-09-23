import { Sequelize, DataTypes, Model } from 'sequelize';
import { MovieAttributes, RatingAttributes } from './omdb.js';
import { config } from '../config.js';

// Initialize Sequelize with SQLite database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: config.database.path // Update with your SQLite database path or connection details for other databases
});

// Define the Rating model
class Rating extends Model<RatingAttributes> implements RatingAttributes {
    Source: string;
    Value: string;
}
Rating.init({
    Source: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Value: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Rating',
    timestamps: false // No createdAt/updatedAt fields
});


class Movie extends Model<MovieAttributes> implements MovieAttributes {
    Title: string;
    Year?: string;
    Rated?: string;
    Released?: string;
    Runtime?: string
    Genre?: string;
    Director?: string;
    Writer?: string;
    Actors?: string;
    Plot?: string;
    Language?: string;
    Country?: string;
    Awards?: string;
    Poster?: string;
    Ratings?: Array<Rating>;
    Metascore?: string;
    imdbRating?: string;
    imdbVotes?: string;
    imdbID?: string;
    Type?: string;
    DVD?: string;
    BoxOffice?: string;
    Production?: string;
    Website?: string;
    Response?: string;
    folder: string;
    fileName?: string;
    srtFileName?: string;
    available: boolean;
}

Movie.init({
    Title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Year: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Rated: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Released: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Runtime: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Genre: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Director: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Writer: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Actors: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Plot: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Language: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Awards: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Poster: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Ratings: {
        type: DataTypes.JSON, // Store ratings as a JSON array
        allowNull: true,
    },
    Metascore: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    imdbRating: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    imdbVotes: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    imdbID: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    DVD: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    BoxOffice: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Production: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Website: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Response: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    folder: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    srtFileName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Movie',
    timestamps: false,
    indexes: [
        {
            name: 'Title_index',
            fields: ['Title'],
        },
        {
            name: 'imdbID_index',
            fields: ['imdbID'],
        }
    ]
});

await sequelize.sync({ force: false });

// Export the models
export { Movie };