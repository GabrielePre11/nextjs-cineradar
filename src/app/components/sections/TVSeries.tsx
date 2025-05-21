/*============ CLIENT COMPONENT ============*/
"use client";

/*============ IMPORT OF HOOKS, NEXT IMAGE, ZUSTAND STORE, CN, LODASH DEBOUNCE, NEXT LINK ============*/
import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { cn } from "@/lib/utils";
// Next Link
import Link from "next/link";
// Lodash Debounce
import debounce from "lodash/debounce";

/*============ IMPORT OF REACT ICONS, LOADER COMPONENT ============*/
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

/*============ IMPORT OF NEXT NAVIGATION USESEARCHPARAMS ============*/
import { useSearchParams } from "next/navigation";

/*============ INTERFACES & RECORDS ============*/

//======= MOVIE'S INTERFACE

/*
- This interface handles the structure of a TVSeries (the data of the tv series returned by the API)
*/
interface TVSeries {
  id: number;
  name: string;
  title: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
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

/*============ TVSERIES COMPONENT ============*/
export default function TVSeries() {
  /*============ USESTATE HOOKS ============*/
  /*
  - The tvSeries useState() stores the data returned by the API (data.results) and it's
  - an array because the data.results return an array of objects (which are the tv series)
  */
  const [tvSeries, setTvSeries] = useState<TVSeries[]>([]);

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
  - The error useState() handles the error! If there's an error fetching the tv series, an error page
  - will be shown! By default it's set to false because there's no error.
  */
  const [error, setError] = useState<boolean>(false);

  /*============ NEXT USESEARCHPARAMS  ============*/

  /*
  - searchParams takes a value from the URL, in this case it gets the 'query' to fetch the tvSeries
  - that the user has searched with the SEARCHBAR.
  */
  const searchParams = useSearchParams();

  /*
  - userQuery can be either the query (what the user wrote) or nothing, which means that the
  - user hasn't searched for a tvSeries yet.
  */
  const userQuery = searchParams.get("query") || "";

  /*============ DESTRUCTURE OF THE FUNCTIONS OF THE ZUSTAND'S FAVORITESTORE ============*/
  const { addToFavorites, removeFromFavorites, alreadyOnFavorites } =
    useFavoritesStore();

  /*============ USE EFFECT TO HANDLE THE RESET OF THE MOVIES AND THE PAGE NUMBER ============*/

  /*
  - Every time userQuery changes:
  - I reset the tvSeries useState to prevent loading old tv series.
  - I reset the number of the page (to 1), to do the fetch again.  
  */
  useEffect(() => {
    setTvSeries([]);
    setPageNum(1);
  }, [userQuery]);

  /*============ USE EFFECT TO HANDLE THE ASYNC FUNCTION - fetchTVSeries ============*/
  useEffect(() => {
    // I set the value of setLoading to true by default
    setLoading(true);

    const fetchTVSeries = async () => {
      // API KEY
      const tmdbAPI = process.env.NEXT_PUBLIC_TMDB_KEY;
      let defaultURL = "";

      /*
      - Here I need to check if the userQuery is available, so if the user has searched a tvSeries, if it did,
      - in the URL the query will be available (ex. /tv?query=scream) and it will be fetched! Otherwise, if
      - there's no query, so the URL is clear, the popular tv series will be fetched, as it happens by default!
      - p.s [encodeURIComponent encodes a text string as a valid component of a Uniform Resource Identifier (URI)
      - (src: ChatGPT)]
      */
      if (userQuery.trim() !== "") {
        // URL FOR SEARCHING TV SERIES BY TITLE
        defaultURL = `https://api.themoviedb.org/3/search/tv?api_key=${tmdbAPI}&query=${encodeURIComponent(
          userQuery
        )}&page=${pageNum}`;
      } else {
        // URL FOR SEARCHING POPULAR TV SERIES (DEFAULT)
        defaultURL = `https://api.themoviedb.org/3/tv/popular?api_key=${tmdbAPI}&page=${pageNum}`;
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
        - The constant 'newTvSeries' initially called 'tvSeries' but since there's a button to load more tv series
        - and there are A LOT of tv series, there's the a high risk of loading tv series that are already on 
        - the page, and since each tvSeries has a UNIQUE ID, it's impossible to have the same tv series on the page. 
        - This variable will be filtered to see if the present tv series ID IS NOT PRESENT in uniquesTvSeries.
        */
        const newTvSeries = data.results;

        setTvSeries((prev) => {
          /*
          - What's happening here?
          1. I declare a constant (existingIds), which is a Set created from the IDs of the tv series already rendered. 
          A Set is used because it automatically prevents duplicate values, unlike ARRAYS.

          2. Then I declare another constant (uniquesTvSeries), whose job is to filter the new incoming tv series (newTvSeries) and return only those that do NOT already exist in the existingIds set.

          3. Finally, when the user clicks the "Load More" button, this returns the previous tv series (...prev) 
          along with the newly filtered ones (...uniquesTvSeries).
        */
          const existingIds = new Set(prev.map((series) => series.id));
          const uniquesTvSeries = newTvSeries.filter(
            // I specify that the tvSeries follows the structure of the tvSeries's interface.
            (series: TVSeries) => !existingIds.has(series.id)
          );
          return [...prev, ...uniquesTvSeries];
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
    fetchTVSeries();
  }, [pageNum, userQuery]);

  /*============ LOAD MORE BUTTON ============*/
  // The useCallback presents the recreation of the function on every render
  const loadMore = useCallback(() => {
    setPageNum((prev) => prev + 1); // Increase the page number to load more items
  }, []);

  // Debounce the loadMore function to avoid spamming the fetch
  const debouncedLoadMore = useMemo(() => debounce(loadMore, 1000), [loadMore]);

  // And then cancel debounce on component unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      debouncedLoadMore.cancel();
    };
  }, [debouncedLoadMore]);

  return (
    <section className="relative py-20 overflow-clip">
      <figure className="relative h-[300px] sm:h-[400px] lg:h-[480px] rounded-lg">
        <Image
          src="/TVSeriesBanner.jpg"
          alt="TV Series Banner"
          className="object-cover object-right rounded-lg"
          fill
          priority
        />
        {/* 
        - fill: lets the image fill the container (in this case it's figure)
        - priority: charges the images before the others
        */}
      </figure>

      {/*======== TVSERIES ========*/}
      <h2 className="pt-5 pb-5 text-lg font-semibold">
        {/* 
        - If the userQuery is available, so the user has searched something, show a button to go
        - back to all the tv series and the results for what the user searched. On the other hand, simply show TV Series 📺
        */}
        {userQuery ? (
          <div className="flex flex-col gap-3">
            <Link href={"/tv-series"}>
              <button className="text-sm mt-5 inline-flex items-center gap-2 bg-brandeis w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-brandeis/80">
                <IoArrowBackSharp className="text-lg" /> Go Back To TV Series
              </button>
            </Link>
            <span className="text-lg">{`Results for: ${userQuery}`}</span>
          </div>
        ) : (
          `TV Series 📺`
        )}
      </h2>

      {/*======== TVSERIES NOT FOUND ========*/}
      {!loading && tvSeries.length === 0 && (
        <p className="text-center text-gray-400 mt-6" aria-live="polite">
          {`No TV Series found for ${userQuery}.`}
        </p>
      )}

      {/*======== LOADING STATE ========*/}
      {loading && (
        // If the tv series are loading, show the Loader component.
        <Loader />
      )}

      {/*======== ERROR STATE ========*/}
      {error && (
        // If there's an error fetching the tv series, show an error message.
        <div className="grid place-content-center">
          <p className="text-lg sm:text-2xl lg:text-3xl">
            Oops! ❌ There was an error loading the tv series! Try again!
          </p>
        </div>
      )}

      {/*======== TV SERIES GRID/LIST ========*/}
      {!loading && !error && tvSeries.length > 0 && (
        <ul
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 pt-3 p-2 rounded-lg"
          style={{
            backgroundImage: `linear-gradient(
    rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/TVSeriesBanner.webp')`,
          }}
        >
          {tvSeries.map((series) => (
            <li key={series.id} className="cursor-pointer">
              {/*======== TVSERIES POSTER ========*/}
              <figure className="relative rounded-lg overflow-hidden group">
                <Link href={`/tv-series/${series.id}`}>
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                    width={150}
                    height={225}
                    alt={series.name}
                    className="object-cover rounded-lg relative group-hover:scale-102 transform transition-transform duration-300"
                  ></Image>
                </Link>

                {/*======== TVSERIES VOTE AVERAGE========*/}
                <p className="inline-flex absolute items-center gap-1 -bottom-10 left-1 bg-brandeis rounded-full px-2 py-1 ring ring-berkeley transform transition-transform duration-300 group-hover:-translate-y-12">
                  <FaStar className="text-gold" />
                  <span className="text-sm font-semibold">
                    {series.vote_average}
                  </span>
                </p>
              </figure>

              {/*======== TVSERIES INFORMATIONS ========*/}
              <div className="flex flex-col gap-1.5 p-1.5">
                <div className="flex items-center gap-1">
                  {/*======== MOVIES TITLE ========*/}
                  <h3 className="truncate text-sm font-semibold w-full">
                    {series.name}
                  </h3>

                  {/*======== ADD TO FAVORITES BUTTON ========*/}
                  <button className="text-lg" aria-label="Add to Favorites">
                    <FaBookmark
                      className={cn(
                        "transition-colors duration-200 hover:text-brandeis",
                        alreadyOnFavorites(series.id)
                          ? "text-brandeis"
                          : "text-white"
                      )}
                      aria-label={
                        alreadyOnFavorites(series.id)
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                      onClick={() => {
                        if (alreadyOnFavorites(series.id)) {
                          removeFromFavorites(series.id);
                        } else {
                          addToFavorites(series);
                        }
                      }}
                    />
                  </button>
                </div>

                {/*======== TVSERIES GENRES ========*/}
                <ul className="flex items-center gap-1">
                  {/* 
                  - Check if series.genre_ids is an ARRAY and if its length if higher than 0. 
                  - If it is, takes the first two genres IDs using slice (0,2)
                  - Map the IDs of the genres to create a span element (the genre) 
                  - genreMap[id] associate the ID of the genre to the name, defined in the RECORD genreMap
                  - If the ID is not found, the nullish coaleshing ?? operator shows 'Unknown'.
                  */}
                  {Array.isArray(series.genre_ids) &&
                  series.genre_ids.length > 0 ? (
                    series.genre_ids.slice(0, 1).map((id) => (
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
            // If the page is not loading and tvSeries.length === 0 (which means the searched tvSeries hasn't been found), hide the button.
            !loading && tvSeries.length === 0 ? "hidden" : "inline-flex"
          )}
          aria-label="Load more movies"
          // For accessibility aria-busy tells to screen readers that when the tv series are loading, the button is disabled / occupied.
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
