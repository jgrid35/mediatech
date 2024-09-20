import { model, Schema } from 'mongoose';
import { GetMovieResponse, Rating } from 'types/omdb.js';

const RatingSchema = new Schema<Rating>({
    Source: { type: String, required: false },
    Value: { type: String, required: false }
})
const MovieSchema = new Schema<GetMovieResponse>({
    Title: { type: String, required: true },
    Year: { type: String, required: false },
    Rated: { type: String, required: false },
    Released: { type: String, required: false },
    Runtime: { type: String, required: false },
    Genre: { type: String, required: false },
    Director: { type: String, required: false },
    Writer: { type: String, required: false },
    Actors: { type: String, required: false },
    Plot: { type: String, required: false },
    Language: { type: String, required: false },
    Country: { type: String, required: false },
    Awards: { type: String, required: false },
    Poster: { type: String, required: false },
    Ratings: [RatingSchema],
    Metascore: { type: String, required: false },
    imdbRating: { type: String, required: false },
    imdbVotes: { type: String, required: false },
    imdbID: { type: String, required: false },
    Type: { type: String, required: false },
    DVD: { type: String, required: false },
    BoxOffice: { type: String, required: false },
    Production: { type: String, required: false },
    Website: { type: String, required: false },
    Response: { type: String, required: false },
    folder: { type: String, required: true },
    fileName: { type: String, required: false },
    available: { type: Boolean, required: true}
})

MovieSchema.index({ Title: 1 });
MovieSchema.index({ imdbID: 1 });

export const MovieCollection = model('Movie', MovieSchema);