import mongoose from "mongoose";

// Define the schema for the Favorites collection
const FavoriteSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  movies: [
    {
      movieId: { type: String, required: true },
      movieName: { type: String, required: true },
      thumbnail: { type: String, required: true },
    },
  ],
});

// Export the Favorites model
export default mongoose.models.Favorites || mongoose.model("Favorites", FavoriteSchema);
