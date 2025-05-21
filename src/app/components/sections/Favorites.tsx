/*============ CLIENT COMPONENT ============*/
"use client";

/*============ IMPORT NEXT IMAGE, ZUSTAND'S USEFAVORITESTORE, CN, NEXT LINK ============*/
import Image from "next/image";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { cn } from "@/lib/utils";
import Link from "next/link";

/*============ REACT ICONS ============*/
// // Star for movies & series vote average
import { FaStar } from "react-icons/fa6";
// Bookmark icon that allow the user to remove a movie/ a tvSeries from favorites
import { FaBookmark } from "react-icons/fa";

//======= ITEM'S GENREMAP RECORD
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

/*============ FAVORITES COMPONENT ============*/
export default function Favorites() {
  /*============ IMPORTING THE STATES FROM USEFAVORITESTORE ============*/
  // - favorites stores a movie or a tvSeries
  const favorites = useFavoritesStore((state) => state.favorites);

  /*
  - alreadyOnFavorites is a function which takes an ID: number as a parameter to check if the movie or the
  - tvSeries have already been added to the favorites. If they have, the bookmark icon will be blue
  */
  const alreadyOnFavorites = useFavoritesStore(
    (state) => state.alreadyOnFavorites
  );

  /*
  - removeFromFavorites is a function which takes an ID: number as a parameter (the ID of the movies or tvSeries the user wants to remove), and returns only the movies or tvSeries which have differents IDs than this one! Thus it will be removed.
  */
  const removeFromFavorites = useFavoritesStore(
    (state) => state.removeFromFavorites
  );

  return (
    <section className="relative py-20">
      <div>
        <h2 className="flex items-center gap-2 pt-5 text-lg font-semibold">
          Your Favorites{" "}
          <span className=" grid place-content-center text-lg rounded-full bg-berkeley px-2.5 w-max">
            {/* Shows the number of movies or tv series added or removed (initially 0) */}
            {favorites.length}
          </span>
        </h2>

        {/*============ IF THE USER HAS ADDED MOVIES OR TVSERIES TO THE FAVORITES (ITEM), SHOW THEM ============*/}
        {favorites.length > 0 && (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 pt-3">
            {favorites.map((item) => (
              <li key={item.id} className="cursor-pointer">
                {/*======== ITEM POSTER ========*/}
                <figure className="relative rounded-lg overflow-hidden group">
                  <Link href={`/`}>
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      width={150}
                      height={225}
                      alt={item.title ?? item.name}
                      className="object-cover rounded-lg relative group-hover:scale-102 transform transition-transform duration-300"
                    ></Image>
                  </Link>

                  {/*======== ITEM VOTE AVERAGE========*/}
                  <p className="inline-flex absolute items-center gap-1 -bottom-10 left-1 bg-brandeis rounded-full px-2 py-1 ring ring-berkeley transform transition-transform duration-300 group-hover:-translate-y-12">
                    <FaStar className="text-gold" />
                    <span className="text-sm font-semibold">
                      {item.vote_average}
                    </span>
                  </p>
                </figure>

                {/*======== ITEM INFORMATIONS ========*/}
                <div className="flex flex-col gap-1.5 p-1.5">
                  <div className="flex items-center gap-1">
                    {/*======== MOVIES TITLE ========*/}
                    <h3 className="truncate text-sm font-semibold w-full">
                      {item.title ?? item.name}
                    </h3>

                    {/*======== ADD TO FAVORITES BUTTON ========*/}
                    <button className="text-lg" aria-label="Add to Favorites">
                      <FaBookmark
                        className={cn(
                          "transition-colors duration-200 hover:text-brandeis",
                          alreadyOnFavorites(item.id)
                            ? "text-brandeis"
                            : "text-white"
                        )}
                        onClick={() => removeFromFavorites(item.id)}
                      />
                    </button>
                  </div>

                  {/*======== ITEM GENRES ========*/}
                  <ul className="flex items-center gap-1">
                    {/* 
                    - Check if item.genre_ids is an ARRAY and if its length if higher than 0. 
                    - If it is, takes the first two genres IDs using slice (0,2)
                    - Map the IDs of the genres to create a li element (the genre) 
                    - genreMap[id] associate the ID of the genre to the name, defined in the RECORD genreMap
                    - If the ID is not found, the nullish coaleshing ?? operator shows 'Unknown'.
                    */}
                    {Array.isArray(item.genre_ids) &&
                      item.genre_ids.length > 0 &&
                      item.genre_ids.map((id) => (
                        <li
                          key={`${item.id}-${id}`}
                          className="text-xs bg-gray-700 w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-gray-700/70"
                        >
                          <span className="truncate">
                            {genreMap[id] ?? "Unknown"}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/*============ IF THE ARE NO MOVIES OR TVSERIES, SHOW THIS PAGE ============*/}
        {favorites.length === 0 && (
          <div className="grid place-content-center grid-cols-1 sm:grid-cols-2 pt-24 sm:pt-12 lg:pt-5">
            <figure>
              <Image
                src={"/undraw_horror-movie_9020.svg"}
                alt="No favorite movies or TV Series"
                width={1}
                height={0}
              ></Image>
            </figure>
            <div className="flex items-center justify-center mt-8">
              <p className="text-lg sm:text-2xl lg:text-3xl">
                No film or TV Series was added to favorites yet!
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
