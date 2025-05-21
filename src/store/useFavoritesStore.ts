/*============ CLIENT COMPONENT ============*/
import { create } from "zustand";
import { persist } from "zustand/middleware";

/*============ INTERFACES ============*/

//======= MOVIE'S INTERFACE

/*
- This interface handles the structure of a Movie
- NOTE: IN THE API some movies use `title`, others `name` (common in TV series too), so both properties 
- are included to support both types., I did this because it gave me an error, and I couldn't apply the 
- function addToFavorites in the Movies or TVSeries because the interfaces were missing 
- an element (title / name), so I added it to both interfaces and solved the problem.
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

/*
- This interface handles the structure of a TVSeries
- NOTE: IN THE API some TVSeries use `title`, others `name` (common in Movies too), so both properties 
- are included to support both types., I did this because it gave me an error, and I couldn't apply the 
- function addToFavorites in the Movies or TVSeries because the interfaces were missing 
- an element (title / name), so I added it to both interfaces and solved the problem.
*/
interface TVSeries {
  id: number;
  title: string;
  name: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
}

/*
- This interface handles the structure of a the FAVORITES STORE

/*
- favorites : an array of Movie or TVSeries.
- addToFavorites : adds a movie or series to the list.
- removeFromFavorites : removes an item by ID.
- alreadyOnFavorites : checks if an item with a given ID is already in favorites.
*/
interface FavoritesStore {
  favorites: (Movie | TVSeries)[];
  addToFavorites: (item: Movie | TVSeries) => void;
  removeFromFavorites: (id: number) => void;
  alreadyOnFavorites: (id: number) => boolean;
}

/*============ useFavoritesStore STORE ============*/
// I create the useFavoritesStore with create, and it follows the structure of the FavoritesStore interface.
export const useFavoritesStore = create<FavoritesStore>()(
  /*
  - What does PERSIST do? ZUSTAND handles on its own the localStorage, so it avoids me to write all the
  - localStorage code (ex. setItem, geItem).
  */
  persist(
    (set, get) => ({
      // Initially favorites is a void array, because the user clearly hasn't saved anything.
      favorites: [],

      /*
      - addToFavorites receives an item as a paremeter which can be either a Movie | (or) a TVSeries and 
      - adds a new item to favorites.
      - Uses the previous state (get().favorites) and appends the new item.
      - Updates the Zustand STATE and persists the data to localStorage.
      */
      addToFavorites: (item) => {
        const updatedFavorites = [...get().favorites, item];
        set({ favorites: updatedFavorites });
      },

      /*
      - Removes an item by ID.
      - Filters out the item from the favorites array.
      - Updates the Zustand STATE and persists the data to localStorage.
      */
      removeFromFavorites: (id) => {
        const updatedFavorites = get().favorites.filter(
          (item) => item.id !== id
        );
        set({ favorites: updatedFavorites });
      },

      /*
      - alreadyOnFavorites receives an ID (a number) as a parameter.
      - It returns a boolean condition, since it uses the (some) method to check if the an item is
      - already present on the Favorites page, if it is, it returns TRUE, else it returns FALSE.
      */
      alreadyOnFavorites: (id) => {
        return get().favorites.some((item) => item.id === id);
      },
    }),
    {
      name: "favorites", // --> 'favorites' is the key for the localStorage!
    }
  )
);
