/*============ CLIENT COMPONENT ============*/
"use client";

/*============ IMPORT OF HOOKS, NEXT IMAGE, CountryFlag COMPONENT ============*/
// Hooks
import { useEffect, useState } from "react";
// Next Link
import Link from "next/link";
// Loader Component
import Loader from "@/app/components/ui/Loader";
// Next Image
import Image from "next/image";
// CountryFlag
import CountryFlag from "@/app/components/ui/CountryFlag";

// REACT ICONS
// Star for movies vote average
import { FaStar } from "react-icons/fa";
// Back Arrow Icon
import { IoArrowBackSharp } from "react-icons/io5";

/*============ TYPES AND INTERFACES ============*/

//============ GENRES TYPE

/*
- Here (In the detailed page of the MOVIE / TV SERIES), the Genres have a name, thus, I don't have to create
- Record <key, value> present in the Movies or TVSeries component. 
*/
type Genres = {
  id: number;
  name: string;
};

//============ ProductionCompanies TYPE
type ProductionCompanies = {
  id: number;
  name: string;
};

//============ ProductionCountries TYPE

/*
- The iso_3166_1 is not only used as a key for displaying the countries, but it's also passed as a prop
- to the CountryFlag's component to display the flag.
*/
type ProductionCountries = {
  iso_3166_1: string;
  name: string;
};

//============ Spoken Languages TYPE
type SpokenLanguages = {
  iso_639_1: string;
  name: string;
  english_name: string;
};

//============ Movie's INTERFACE

/*
- genres: follows the structure of Genres type.
- production_companies: follows the structure of ProductionCompanies type.
- production_countries: follows the structure of ProductionCountries type.
- spoken_languages: follows the structure of SpokenLanguages type.
*/

interface Movie {
  id: number;
  poster_path: string;
  overview: string;
  genres: Genres[];
  title: string;
  vote_average: number;
  production_companies: ProductionCompanies[];
  production_countries: ProductionCountries[];
  spoken_languages: SpokenLanguages[];
  status: string;
  release_date: string;
  budget: number;
  revenue: number;
}

/*============ moviePage COMPONENT ============*/

/*
NEXT JS 15 error: A param property was accessed directly with params.id. params is now a Promise and should be unwrapped with React.use() before accessing properties of the underlying params object. In this version of Next.js direct access to param properties is still supported to facilitate migration, but in a future version, you will be required to unwrap params with React.use().

- Solved with this: https://stackoverflow.com/questions/79465960/react-a-param-property-was-accessed-directly-with-params
*/

export default function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  /*============ USESTATE HOOKS ============*/

  // Stores the Movie, which can be either a Movie or null (initally null 'cause the user hasn't clicked a movie yet)
  const [movie, setMovie] = useState<Movie | null>(null);

  // Handles the loading state
  const [loading, setLoading] = useState<boolean>(true);

  // Handles the error state
  const [error, setError] = useState<boolean>(false);

  /*============ USE EFFECT TO HANDLE THE ASYNC FUNCTION - fetchMovie ============*/
  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      const { id } = await params;

      // API KEY
      const tmdbAPI = process.env.NEXT_PUBLIC_TMDB_KEY;

      // URL TO FETCH TO RECEIVE THE DATA OF THE MOVIE WITH A SPECIFIC ID ${id}
      const defaultURL = `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbAPI}&language=en-US`;

      try {
        // Fetching the url...
        const response = await fetch(defaultURL);

        // If the response is not okay, then throw an error and tell me the status of the response.
        if (!response.ok) {
          throw new Error(`Failed to fetch movies. Status: ${response.status}`);
        }

        // The data follows the structure of the Movie's interface.
        const data: Movie = await response.json();

        setMovie(data);
        setError(false);
      } catch (error: unknown) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [params]);

  return (
    <section className="grid grid-cols-1 py-24 overflow-clip">
      {/*======== LOADING STATE ========*/}
      {loading && (
        // If the movies are loading, show the Loader component.
        <Loader />
      )}

      {/*======== MOVIE DETAILS ========*/}
      {!loading && !error && (
        // If there's no error and the movie is ready to be displayed, show all the details
        // note: the optional chaining operator (.?) checks if the value is undefined without giving an error.
        <>
          <div className="flex items-center justify-center">
            {/*======== MOVIES POSTER ========*/}
            <figure className="relative rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
                width={200}
                height={225}
                alt={movie?.title ?? "Unknown"}
                priority // Consigliato da NextJS per Largest Contentful Paint (LCP)
                className="object-cover rounded-lg relative group-hover:scale-102 transform transition-transform duration-300"
              ></Image>

              {/*======== MOVIES VOTE AVERAGE========*/}
              <p className="inline-flex absolute items-center gap-1 -bottom-10 left-1.5 bg-brandeis rounded-full px-2 py-1 ring ring-berkeley transform transition-transform duration-300 group-hover:-translate-y-12">
                <FaStar className="text-gold text-lg" />
                <span className="text-lg font-semibold">
                  {movie?.vote_average}
                </span>
              </p>
            </figure>
          </div>

          <div className="flex flex-col p-0.5 sm:p-1 gap-5">
            {/*======== MOVIES TITLE AND RELEASE DATA ========*/}
            <div className="py-2 sm:py-4 lg:py-6 px-2 sm:px-2.5">
              {/*======== GO BACK TO MOVIES BUTTON ========*/}
              <Link href={"/movies"}>
                <button className="text-sm mt-5 inline-flex items-center gap-2 bg-brandeis w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-brandeis/80">
                  <IoArrowBackSharp className="text-lg" /> Go Back To Movies
                </button>
              </Link>

              <h2 className="text-3xl mt-2 sm:text-4xl lg:text-5xl font-semibold pb-2">
                {movie?.title}
              </h2>
              <p className="text-sm lg:text-lg bg-gray-700 w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-gray-700/70">
                {movie?.release_date}
              </p>
            </div>

            {/*======== MOVIES OVERVIEW ========*/}
            <div className="flex flex-col bg-[#111111] p-2 sm:p-4 rounded-lg ring-2 ring-brandeis">
              {/*======== OVERVIEW ========*/}
              <h3 className="text-xl sm:text-3xl lg:text-4xl font-semibold">
                Overview
              </h3>

              {/*======== OVERVIEW LIST ========*/}
              <ul className="grid grid-cols-1 gap-3.5 sm:gap-5 lg:gap-8 pt-5">
                {/*======== GENRE ========*/}
                <li className="flex flex-col gap-0.5 lg:gap-1.5">
                  <span className="text-lg sm:text-2xl lg:text-3xl">Genre</span>
                  <ul className="flex items-center gap-1">
                    {movie?.genres.slice(0, 2).map((genre) => (
                      <li
                        key={genre.id}
                        className="text-xs sm:text-sm bg-gray-700 w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-gray-700/70"
                      >
                        <span className="truncate">{genre.name}</span>
                      </li>
                    ))}
                  </ul>
                </li>

                {/*======== PRODUCTION COMPANIES ========*/}
                <li className="flex flex-col gap-0.5 lg:gap-1.5">
                  <span className="text-lg sm:text-2xl lg:text-3xl">
                    Produced by
                  </span>
                  <ul className="flex items-center gap-1 flex-wrap">
                    {movie?.production_companies.map((company) => (
                      <li
                        key={company.id}
                        className="text-xs sm:text-sm bg-gray-700 w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-gray-700/70"
                      >
                        {company.name}
                      </li>
                    ))}
                  </ul>
                </li>

                {/*======== PRODUCTION COUNTRIES ========*/}
                <li className="flex flex-col gap-0.5 lg:gap-1.5">
                  <span className="text-lg sm:text-2xl lg:text-3xl">
                    Produced in
                  </span>
                  <ul className="flex items-center gap-1 flex-wrap">
                    {movie?.production_countries.map((country) => (
                      <li
                        key={country.iso_3166_1}
                        className="text-xs bg-gray-700 w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-gray-700/70"
                      >
                        <span className="flex items-center gap-2 text-sm">
                          <CountryFlag iso={country.iso_3166_1} />
                          {country.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>

                {/*======== SPOKEN LANGUAGES ========*/}
                <li className="flex flex-col gap-0.5 lg:gap-1.5">
                  <span className="text-lg sm:text-2xl lg:text-3xl">
                    Spoken Languages
                  </span>
                  <ul className="flex items-center gap-1">
                    {movie?.spoken_languages.map((lang) => (
                      <li
                        className="text-xs bg-gray-700 w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-gray-700/70"
                        key={lang.iso_639_1}
                      >
                        <span className="flex items-center gap-2 text-sm">
                          {lang.english_name} ● {lang.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>

                {/*======== MOVIE'S PLOT ========*/}
                <li className="flex flex-col gap-0.5 lg:gap-1.5">
                  <span className="text-lg sm:text-2xl lg:text-3xl">Plot</span>
                  <p className="text-sm lg:text-[1rem] text-gray-300 lg:max-w-[900px]">
                    {movie?.overview}
                  </p>
                </li>

                {/*======== MOVIE'S BUDGET ========*/}
                <li className="flex flex-col gap-0.5 lg:gap-1.5">
                  <span className="text-lg sm:text-2xl lg:text-3xl">
                    Budget
                  </span>
                  <p className="text-sm bg-gray-700 w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-gray-700/70">{`$${movie?.budget}`}</p>
                </li>

                {/*======== MOVIE'S REVENUE ========*/}
                <li className="flex flex-col gap-0.5 lg:gap-1.5">
                  <span className="text-lg sm:text-2xl lg:text-3xl">
                    Revenue
                  </span>
                  <p className="text-sm bg-gray-700 w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-gray-700/70">{`$${movie?.revenue}`}</p>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
