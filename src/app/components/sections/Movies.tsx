/*============ CLIENT COMPONENT ============*/
"use client";

/*============ IMPORT OF HOOKS, NEXT IMAGE, ZUSTAND STORE, CN, LODASH DEBOUNCE ============*/
import { useEffect, useState } from "react";
import Image from "next/image";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { cn } from "@/lib/utils";
// Lodash Debounce
import debounce from "lodash/debounce";

/*============ IMPORT OF REACT ICONS, LOADER COMPONENT, NEXT LINK ============*/
// Star for movies vote average
import { FaStar } from "react-icons/fa6";
// Bookmark icon that allow the user to save a movie into favorites
import { FaBookmark } from "react-icons/fa";
// Reload icon
import { IoReload } from "react-icons/io5";
// Back Arrow Icon
import { IoArrowBackSharp } from "react-icons/io5";

// Loader Component
import Loader from "../ui/Loader";
// Next Link
import Link from "next/link";

/*============ IMPORT OF NEXT NAVIGATION USESEARCHPARAMS ============*/
import { useSearchParams } from "next/navigation";

/*============ INTERFACES & RECORDS ============*/

//======= MOVIE'S INTERFACE

/*
- This interface handles the structure of a Movie (the data of the movie returned by the API)
*/
interface Movie {
  id: number;
  title: string;
  name: string;
  poster_path: string;
  release_date: string;
  vote_average: string;
  genre_ids: number[];
}

//======= MOVIE'S GENREMAP RECORD
/*
- Since the API returns the genres id types as numbers (ex. 28, 12),
- I had to create a Record (key, value) which in the page allows to return the name of the 
- types based on the ID (ex. 28: Action)
*/
const genreMap: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

/*============ MOVIES COMPONENT ============*/
export default function Movies() {
  /*============ USESTATE HOOKS ============*/
  /*
  - The movies useState() stores the data returned by the API (data.results) and it's
  - an array because the data.results return an array of objects (which are the movies)
  */
  const [movies, setMovies] = useState<Movie[]>([]);

  /*
  - The pageNum useState() stores the number of page (which is set to 1 by default), but
  - can be incremented with the loadMore function.
  */
  const [pageNum, setPageNum] = useState<number>(1);

  /*
  - The loading useState() handles the loading of the movies, when the API starts to returning the
  - data, the loading value is already set to true, but once the data is charged, it becomes false!
  */
  const [loading, setLoading] = useState<boolean>(true);

  /*
  - The error useState() handles the error! If there's an error fetching the movies, an error page
  - will be shown! By default it's set to false because there's no error.
  */
  const [error, setError] = useState<boolean>(false);

  /*============ NEXT USESEARCHPARAMS  ============*/

  /*
  - searchParams takes a value from the URL, in this case it gets the 'query' to fetch the movie
  - that the user has searched with the SEARCHBAR.
  */
  const searchParams = useSearchParams();

  /*
  - userQuery can be either the query (what the user wrote) or nothing, which means that the
  - user hasn't searched for a movie yet.
  */
  const userQuery = searchParams.get("query") || "";

  /*============ DESTRUCTURE OF THE FUNCTIONS OF THE ZUSTAND'S FAVORITESTORE ============*/
  const { addToFavorites, removeFromFavorites, alreadyOnFavorites } =
    useFavoritesStore();

  /*============ USE EFFECT TO HANDLE THE RESET OF THE MOVIES AND THE PAGE NUMBER ============*/

  /*
  - Every time userQuery changes:
  - I reset the movies useState to prevent loading old movies.
  - I reset the number of the page (to 1), to do the fetch again.  
  */
  useEffect(() => {
    setMovies([]);
    setPageNum(1);
  }, [userQuery]);

  /*============ USE EFFECT TO HANDLE THE ASYNC FUNCTION - fetchMovies ============*/
  useEffect(() => {
    const fetchMovies = async () => {
      // I set the value of setLoading to true by default
      setLoading(true);

      // API KEY
      const tmdbAPI = process.env.NEXT_PUBLIC_TMDB_KEY;
      let defaultURL = "";

      /*
      - Here I need to check if the userQuery is available, so if the user has searched a movie, if it did,
      - in the URL the query will be available (ex. /movies?query=scream) and it will be fetched! Otherwise, if
      - there's no query, so the URL is clear, the popular movie will be fetched, as it happens by default!
      - p.s [encodeURIComponent encodes a text string as a valid component of a Uniform Resource Identifier (URI)
      - (src: ChatGPT)]
      */
      if (userQuery.trim() !== "") {
        // URL FOR SEARCHING MOVIES BY TITLE
        defaultURL = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbAPI}&query=${encodeURIComponent(
          userQuery
        )}&page=${pageNum}`;
      } else {
        // URL FOR SEARCHING POPULAR MOVIES (DEFAULT)
        defaultURL = `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbAPI}&page=${pageNum}`;
      }

      try {
        // Fetching the url...
        const response = await fetch(defaultURL);

        // If the response is not okay, then throw an error and tell me the status of the response.
        if (!response.ok) {
          throw new Error(`Failed to fetch movies. Status: ${response.status}`);
        }

        const data = await response.json();

        /*
        - The constant 'newMovies' initially called 'movies' but since there's a button to load more movies
        - and there are A LOT of movies, there's the a high risk of loading movies that are already on 
        - the page, and since each movie has a UNIQUE ID, it's impossible to have the same movies on the page. 
        - This variable will be filtered to see if the present movies ID IS NOT PRESENT in uniquesMovies.
        */
        const newMovies = data.results;

        setMovies((prev) => {
          /*
          - What's happening here?
          1. I declare a constant (existingIds), which is a Set created from the IDs of the movies already rendered. 
          A Set is used because it automatically prevents duplicate values, unlike ARRAYS.

          2. Then I declare another constant (uniqueMovies), whose job is to filter the new incoming movies (newMovies) and return only those that do NOT already exist in the existingIds set.

          3. Finally, when the user clicks the "Load More" button, this returns the previous movies (...prev) 
          along with the newly filtered ones (...uniqueMovies).
        */
          const existingIds = new Set(prev.map((movie) => movie.id));
          const uniquesMovies = newMovies.filter(
            // I specify that the movie follows the structure of the Movie's interface.
            (movie: Movie) => !existingIds.has(movie.id)
          );
          return [...prev, ...uniquesMovies];
        });
        setError(false);
      } catch (error: unknown) {
        setError(true);
        if (error instanceof Error) {
          console.error("Error:", error.message);
        } else {
          console.error("Unknown error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    // The useEffect runs the async function when pageNum (thanks to the Load More Button) or userQuery (thanks to the query) change!
    fetchMovies();
  }, [pageNum, userQuery]);

  const loadMore = (): void => {
    // When the function is called by clicking the Load More button, the number of the page increments, charging the new movies!
    setPageNum((prev) => prev + 1);
  };

  /*============ DECLARING THE DEBOUNCE FOR LOAD MORE ============*/

  /*
  - I applied a debounce of 1000ms to the loadMore button to prevent the user to spam and making too much
  - API calls. Since the debounce is like creating a Timeout, it's important to delete it, with the useEffect!
  */
  const debouncedLoadMore = debounce(loadMore, 1000);

  useEffect(() => {
    return () => {
      debouncedLoadMore.cancel();
    };
  }, []);

  return (
    <section className="relative py-20 overflow-clip">
      <figure className="relative h-[300px] sm:h-[400px] lg:h-[480px] rounded-lg">
        <Image
          src="/MoviesBanner.webp"
          alt="Movies Banner"
          className="object-cover object-center rounded-lg"
          fill
          priority
        />
        {/* 
        - fill: lets the image fill the container (in this case it's figure)
        - priority: charges the images before the others
        */}
      </figure>

      {/*======== MOVIES ========*/}
      <h2 className="pt-5 pb-5 text-lg font-semibold" aria-live="polite">
        {/* 
        - If the userQuery is available, so the user has searched something, show a button to go
        - back to all the movies and the results for what the user searched. On the other hand, simply show Movies 🍿
        */}
        {userQuery ? (
          <div className="flex flex-col gap-3">
            <Link href={"/movies"}>
              <button className="text-sm mt-5 inline-flex items-center gap-2 bg-brandeis w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-brandeis/80">
                <IoArrowBackSharp className="text-lg" /> Go Back To Movies
              </button>
            </Link>
            <span className="text-lg">{`Results for: ${userQuery}`}</span>
          </div>
        ) : (
          `Movies 🍿`
        )}
      </h2>

      {/*======== MOVIE NOT FOUND ========*/}
      {!loading && movies.length === 0 && (
        <p className="text-center text-gray-400 mt-6" aria-live="polite">
          No movies found for "{userQuery}".
        </p>
      )}

      {/*======== LOADING STATE ========*/}
      {loading && (
        // If the movies are loading, show the Loader component.
        <Loader />
      )}

      {/*======== ERROR STATE ========*/}
      {error && (
        // If there's an error fetching the movies, show an error message.
        <div className="grid place-content-center">
          <p className="text-lg sm:text-2xl lg:text-3xl">
            Oops! ❌ There was an error loading the movies! Try again!
          </p>
        </div>
      )}

      {/*======== MOVIES GRID/LIST ========*/}
      {!loading && !error && movies.length > 0 && (
        // If there's no error and the movies are ready to be displayed, show the list of movies!
        <ul
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 pt-3 p-2 rounded-lg"
          style={{
            backgroundImage: `linear-gradient(
        rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/movies-bg.png')`,
          }}
        >
          {movies.map((movie) => (
            <li key={movie.id} className="cursor-pointer">
              {/*======== MOVIES POSTER ========*/}
              <figure className="relative rounded-lg overflow-hidden group">
                <Link href={`/movies/${movie.id}`}>
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    width={150}
                    height={225}
                    alt={movie.title}
                    className="object-cover rounded-lg relative group-hover:scale-102 transform transition-transform duration-300"
                  ></Image>
                </Link>

                {/*======== MOVIES VOTE AVERAGE========*/}
                <p className="inline-flex absolute items-center gap-1 -bottom-10 left-1 bg-brandeis rounded-full px-2 py-1 ring ring-berkeley transform transition-transform duration-300 group-hover:-translate-y-12">
                  <FaStar className="text-gold" />
                  <span className="text-sm font-semibold">
                    {movie.vote_average}
                  </span>
                </p>
              </figure>

              {/*======== MOVIE INFORMATIONS ========*/}
              <div className="flex flex-col gap-1.5 p-1.5">
                <div className="flex items-center gap-1">
                  {/*======== MOVIES TITLE ========*/}
                  <h3 className="truncate text-sm font-semibold w-full">
                    {movie.title}
                  </h3>

                  {/*======== ADD TO FAVORITES BUTTON ========*/}
                  <button className="text-lg" aria-label="Add to Favorites">
                    <FaBookmark
                      className={cn(
                        "transition-colors duration-200 hover:text-brandeis",
                        alreadyOnFavorites(movie.id)
                          ? "text-brandeis"
                          : "text-white"
                      )}
                      aria-label={
                        alreadyOnFavorites(movie.id)
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                      onClick={() => {
                        if (alreadyOnFavorites(movie.id)) {
                          removeFromFavorites(movie.id);
                        } else {
                          addToFavorites(movie);
                        }
                      }}
                    />
                  </button>
                </div>

                {/*======== MOVIES GENRES ========*/}
                <ul className="flex items-center gap-1">
                  {/* 
                  - Check if movie.genre_ids is an ARRAY and if its length if higher than 0. 
                  - If it is, takes the first two genres IDs using slice (0,2)
                  - Map the IDs of the genres to create a span element (the genre) 
                  - genreMap[id] associate the ID of the genre to the name, defined in the RECORD genreMap
                  - If the ID is not found, the nullish coaleshing ?? operator shows 'Unknown'.
                  */}
                  {Array.isArray(movie.genre_ids) &&
                  movie.genre_ids.length > 0 ? (
                    movie.genre_ids.slice(0, 2).map((id) => (
                      <span
                        key={id}
                        className="text-xs truncate bg-gray-700 w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-gray-700/70"
                      >
                        {genreMap[id] ?? "Unknown"}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs bg-gray-700 w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-gray-700/70">
                      Unknown
                    </span>
                  )}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/*======== LOAD MORE MOVIES BUTTON ========*/}
      <div className="grid place-content-center">
        <button
          className={cn(
            "items-center gap-2 mt-10 mb-3 bg-berkeley px-2 py-1 rounded-full transition-colors duration-300 hover:bg-berkeley/70",
            // If the page is not loading and movies.length === 0 (which means the searched movie hasn't been found), hide the button.
            !loading && movies.length === 0 ? "hidden" : "inline-flex"
          )}
          aria-label="Load more movies"
          // For accessibility aria-busy tells to screen readers that when the movies are loading, the button is disabled / occupied.
          aria-busy={loading}
          aria-live="polite"
          disabled={loading}
          onClick={debouncedLoadMore}
        >
          {loading ? "Loading..." : "Load more"}
          <IoReload className="text-lg" />
        </button>
      </div>
    </section>
  );
}
