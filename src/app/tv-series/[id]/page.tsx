/*============ CLIENT COMPONENT ============*/
"use client";

/*============ IMPORT OF HOOKS, NEXT IMAGE, CountryFlag COMPONENT ============*/
// Hooks
import { useEffect, useState } from "react";
// Loader Component
import Loader from "@/app/components/ui/Loader";
// Next Image
import Image from "next/image";
// Next Link
import Link from "next/link";
// CountryFlag
import CountryFlag from "@/app/components/ui/CountryFlag";
import { cn } from "@/lib/utils";

// REACT ICONS
// Star for tvSeries vote average
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

//============ CreatedBy TYPE
type CreatedBy = {
  id: number;
  original_name: string;
};

//============ Spoken Languages TYPE
type SpokenLanguages = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

//============ ProductionCompanies TYPE
type ProductionCompanies = {
  id: number;
  name: string;
};

//============ ProductionCountries TYPE
type ProductionCountries = {
  iso_3166_1: string;
  name: string;
};

//============ TVSeries INTERFACE

/*
- genres: follows the structure of Genres type.
- created_by: follows the structure of CreatedBy type.
- production_companies: follows the structure of ProductionCompanies type.
- production_countries: follows the structure of ProductionCountries type.
- spoken_languages: follows the structure of SpokenLanguages type.
*/

interface TVSeries {
  id: number;
  name: string;
  overview: string;
  in_production: boolean;
  first_air_date: string;
  last_air_date: string;
  poster_path: string;
  status: string;
  type: string;
  vote_average: number;
  number_of_episodes: number;
  number_of_seasons: number;
  genres: Genres[];
  created_by: CreatedBy[];
  spoken_languages: SpokenLanguages[];
  production_companies: ProductionCompanies[];
  production_countries: ProductionCountries[];
}

/*============ tvSeriesPage COMPONENT ============*/

/*
NEXT JS 15 error: A param property was accessed directly with params.id. params is now a Promise and should be unwrapped with React.use() before accessing properties of the underlying params object. In this version of Next.js direct access to param properties is still supported to facilitate migration, but in a future version, you will be required to unwrap params with React.use().

- Solved with this: https://stackoverflow.com/questions/79465960/react-a-param-property-was-accessed-directly-with-params
*/
export default function TvSeriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  /*============ USESTATE HOOKS ============*/

  // Stores the tvSeries, which can be either a tvSeries or null (initally null 'cause the user hasn't clicked a tvSeries yet)
  const [tvSeries, setTvSeries] = useState<TVSeries | null>(null);

  // Handles the loading state
  const [loading, setLoading] = useState<boolean>(true);

  // Handles the error state
  const [error, setError] = useState<boolean>(false);

  /*============ USE EFFECT TO HANDLE THE ASYNC FUNCTION - fetchTVSeries ============*/
  useEffect(() => {
    const fetchTVSeries = async () => {
      setLoading(true);
      const { id } = await params;

      // API KEY
      const tmdbAPI = process.env.NEXT_PUBLIC_TMDB_KEY;

      // URL TO FETCH TO RECEIVE THE DATA OF THE TVSERIES WITH A SPECIFIC ID ${id}
      const defaultURL = `https://api.themoviedb.org/3/tv/${id}?api_key=${tmdbAPI}&language=en-US`;

      try {
        // Fetching the url...
        const response = await fetch(defaultURL);

        // If the response is not okay, then throw an error and tell me the status of the response.
        if (!response.ok) {
          throw new Error(
            `Failed to fetch tv series. Status: ${response.status}`
          );
        }

        // The data follows the structure of the TVSeries interface.
        const data: TVSeries = await response.json();

        setTvSeries(data);
        console.log(data);
        setError(false);
      } catch (error: unknown) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTVSeries();
  }, [params]);

  return (
    <section className="grid grid-cols-1 py-24 overflow-clip">
      {/*======== LOADING STATE ========*/}
      {loading && (
        // If the tv series are loading, show the Loader component.
        <Loader />
      )}

      {/*======== TVSERIES DETAILS ========*/}
      {!loading && !error && (
        // If there's no error and the tvSeries is ready to be displayed, show all the details
        // note: the optional chaining operator (.?) checks if the value is undefined without giving an error.
        <>
          <div className="flex items-center justify-center">
            {/*======== TV-SERIES POSTER ========*/}
            <figure className="relative rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src={`https://image.tmdb.org/t/p/w500${tvSeries?.poster_path}`}
                width={200}
                height={225}
                alt={tvSeries?.name ?? "Unknown"}
                priority // Consigliato da NextJS per Largest Contentful Paint (LCP)
                className="object-cover rounded-lg relative group-hover:scale-102 transform transition-transform duration-300"
              ></Image>

              {/*======== TV-SERIES VOTE AVERAGE========*/}
              <p className="inline-flex absolute items-center gap-1 -bottom-10 left-1.5 bg-brandeis rounded-full px-2 py-1 ring ring-berkeley transform transition-transform duration-300 group-hover:-translate-y-12">
                <FaStar className="text-gold text-lg" />
                <span className="text-lg font-semibold">
                  {tvSeries?.vote_average}
                </span>
              </p>
            </figure>
          </div>

          <div className="flex flex-col p-0.5 sm:p-1 gap-5">
            {/*======== TV-SERIES TITLE AND RELEASE DATA ========*/}
            <div className="py-2 sm:py-4 lg:py-6 px-2 sm:px-2.5">
              {/*======== GO BACK TO TV-SERIES BUTTON ========*/}
              <Link href={"/tv-series"}>
                <button className="text-sm mt-5 mb-2 inline-flex items-center gap-2 bg-brandeis w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-brandeis/80">
                  <IoArrowBackSharp className="text-lg" /> Go Back To TV Series
                </button>
              </Link>

              <h2 className="text-3xl mt-2 sm:text-4xl lg:text-5xl font-semibold pb-2">
                {tvSeries?.name}
              </h2>
              <p className="text-sm lg:text-lg bg-gray-700 w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-gray-700/70">
                {tvSeries?.first_air_date} • {tvSeries?.last_air_date}
              </p>
            </div>

            {/*======== TV-SERIES OVERVIEW ========*/}
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
                    {tvSeries?.genres.slice(0, 2).map((genre) => (
                      <li
                        key={genre.id}
                        className="text-xs sm:text-sm bg-gray-700 w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-gray-700/70"
                      >
                        <span className="truncate">{genre.name}</span>
                      </li>
                    ))}
                  </ul>
                </li>

                {/*======== STATUS ========*/}
                <li className="flex flex-col gap-0.5 lg:gap-1.5">
                  <span className="text-lg sm:text-2xl lg:text-3xl">
                    Status
                  </span>
                  <span className="text-xs sm:text-sm bg-gray-700 w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-gray-700/70">
                    {tvSeries?.status}
                  </span>
                </li>

                {/*======== CREATED BY ========*/}
                <li className="flex flex-col gap-0.5 lg:gap-1.5">
                  <span className="text-lg sm:text-2xl lg:text-3xl">
                    Created by
                  </span>
                  {tvSeries?.created_by.length === 0 ? (
                    <span className="text-xs sm:text-sm bg-gray-700 w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-gray-700/70">
                      Unknown
                    </span>
                  ) : (
                    <ul className="flex items-center gap-1 flex-wrap">
                      {tvSeries?.created_by.map((creator) => (
                        <li
                          key={creator.id}
                          className="text-xs sm:text-sm bg-gray-700 w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-gray-700/70"
                        >
                          {creator.original_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {/*======== IS IT IN PRODUCTION ========*/}
                <li className="flex flex-col gap-0.5 lg:gap-1.5">
                  <span className="text-lg sm:text-2xl lg:text-3xl">
                    In Production
                  </span>
                  <span
                    className={cn(
                      "text-xs sm:text-s w-max px-1.5 py-1 rounded-lg transition-colors duration-300",
                      tvSeries?.in_production
                        ? "bg-green-600 hover:bg-green-600/80"
                        : "bg-red-600 hover:bg-red-600/70"
                    )}
                  >
                    {tvSeries?.in_production ? "Yes" : "No"}
                  </span>
                </li>

                {/*======== PRODUCTION COMPANIES ========*/}
                <li className="flex flex-col gap-0.5 lg:gap-1.5">
                  <span className="text-lg sm:text-2xl lg:text-3xl">
                    Producted by
                  </span>
                  <ul className="flex items-center gap-1 flex-wrap">
                    {tvSeries?.production_companies.map((company) => (
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
                    {tvSeries?.production_countries.map((country) => (
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
                    {tvSeries?.spoken_languages.map((lang) => (
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

                {/*======== TV-SERIES PLOT ========*/}
                <li className="flex flex-col gap-0.5 lg:gap-1.5">
                  <span className="text-lg sm:text-2xl lg:text-3xl">Plot</span>
                  <p className="text-sm lg:text-[1rem] text-gray-300 lg:max-w-[900px]">
                    {tvSeries?.overview}
                  </p>
                </li>

                {/*======== TV-SERIES TOTAL EPISODES & SEASONS ========*/}
                <li className="flex flex-col gap-0.5 lg:gap-1.5">
                  <span className="text-lg sm:text-2xl lg:text-3xl">
                    Episodes & Seasons
                  </span>
                  <p className="text-xs md:text-sm bg-gray-700 w-max px-1.5 py-1 rounded-lg transition-colors duration-300 hover:bg-gray-700/70">
                    {tvSeries?.number_of_episodes} episodes ●{" "}
                    {tvSeries?.number_of_seasons} seasons
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
