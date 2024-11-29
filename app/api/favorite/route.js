import connectDB from "@/utils/connectDB";
import Favorites from "@/models/Favorites";

export async function POST(req) {
  await connectDB();

  try {
    const reqbody = await req.json();
    const { email, movieId, movieName, thumbnail } = reqbody;

    if (!email) {
      return new Response(
        JSON.stringify({
          error: "Please log in to save your favorite movies.",
        }),
        { status: 400 }
      );
    }

    if (!movieId || !movieName || !thumbnail) {
      return new Response(
        JSON.stringify({
          error: "All movie details (ID, name, thumbnail) are required.",
        }),
        { status: 400 }
      );
    }

    console.log(`Email: ${email}, Movie ID: ${movieId}`);

    const existingFavorite = await Favorites.findOne({ email });

    if (existingFavorite) {
      const isMovieAlreadyFavorite = existingFavorite.movies.some(
        (movie) => movie.movieId === movieId
      );

      if (isMovieAlreadyFavorite) {
        return new Response(
          JSON.stringify({
            message: "Already favorited this movie.",
          }),
          { status: 400 }
        );
      }

      existingFavorite.movies.push({ movieId, movieName, thumbnail });

      await existingFavorite.save();

      return new Response(
        JSON.stringify({
          message: "Movie added",
          favorite: existingFavorite,
        }),
        { status: 200 }
      );
    } else {
      const favorite = await Favorites.create({
        email,
        movies: [{ movieId, movieName, thumbnail }],
      });

      return new Response(
        JSON.stringify({
          message: "Movies Has been saved!",
          favorite,
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error saving favorite:", error);

    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred. Please try again later.",
      }),
      { status: 500 }
    );
  }
}
