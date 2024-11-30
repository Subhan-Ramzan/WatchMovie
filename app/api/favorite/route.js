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

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required." }), {
        status: 400,
      });
    }

    const userFavorites = await Favorites.findOne({ email });

    if (!userFavorites || userFavorites.movies.length === 0) {
      return new Response(
        JSON.stringify({ error: "No favorite movies found for this email." }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ movies: userFavorites.movies }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again later." }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const movieId = searchParams.get("movieId");

    if (!email || !movieId) {
      return new Response(
        JSON.stringify({ error: "Email and movieId are required." }),
        { status: 400 }
      );
    }

    const userFavorites = await Favorites.findOne({ email });

    if (!userFavorites) {
      return new Response(
        JSON.stringify({ error: "No favorites found for this email." }),
        { status: 404 }
      );
    }

    const updatedMovies = userFavorites.movies.filter(
      (movie) => movie.movieId !== movieId
    );

    if (updatedMovies.length === userFavorites.movies.length) {
      return new Response(
        JSON.stringify({ error: "Movie not found in favorites." }),
        { status: 404 }
      );
    }

    userFavorites.movies = updatedMovies;
    await userFavorites.save();

    return new Response(
      JSON.stringify({
        message: "Movie removed from favorites",
        movies: updatedMovies,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing favorite:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again later." }),
      { status: 500 }
    );
  }
}
