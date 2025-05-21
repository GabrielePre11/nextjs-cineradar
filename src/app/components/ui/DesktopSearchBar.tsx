/*============ CLIENT COMPONENT ============*/
"use client";

/*============ IMPORTING REACT ICONS, REACT HOOKS AND NEXT NAVIGATION ROUTER & PATHNAME ============*/
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { IoSearchOutline } from "react-icons/io5";

/*============ SearchBar (DEKSTOP AND TABLETS) COMPONENT ============*/
export default function DesktopSearchBar() {
  /*============ USESTATE, ROUTER AND PATHNAME ============*/

  /*
  - userSearchQuery stores the value of the input (the query) that the user writes.
  */
  const [userDesktopSearchQuery, setUserDesktopSearchQuery] =
    useState<string>("");

  /*
  - The router pushes the user's query to the URL, keeping the current pathname
  - (ex. /movies or /tv-series) and appending ?query=${encodeURIComponent(userQuery).
  */
  const router = useRouter();

  /*
  - The Pathname's rule is to retrieve the current path from the URL (ex. /movies or /tv-series),
  - usePathname ONLY retrives the PATH, nothing else.
  */
  const pathname = usePathname();

  /*============ handleDesktopSearch FUNCTION TO RETRIEVE THE QUERY AND PUSH IT TO THE URL ============*/
  const handleDesktopSearch = () => {
    // The userQuery constant stores and converts the input to lowercase and trim spaces to
    // avoid issues with capitalization or accidental spaces.
    const userDesktopQuery = userDesktopSearchQuery.trim().toLowerCase();

    // If the user hasn't written anything, return.
    if (!userDesktopQuery) return;

    // Once entered the query, reset (close) the Searchbar and the query wrote by the user.
    setUserDesktopSearchQuery("");

    // Push the query to the URL so that Movies and Series can use useSearchParams() to retrieve it and fetch the URL.
    // encodeURIComponent: Encodes a text string as a valid component of a Uniform Resource Identifier (URI). (src: VSCODE Editor).
    router.push(`${pathname}?query=${encodeURIComponent(userDesktopQuery)}`);
  };

  return (
    <div className="hidden sm:flex items-center border border-gray-400 rounded-lg relative w-full max-w-[300px]">
      <input
        type="text"
        value={userDesktopSearchQuery}
        onChange={(e) => setUserDesktopSearchQuery(e.target.value)}
        // If the user presses Enter, it rusn the handleSearch function()
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleDesktopSearch();
          }
        }}
        name="desktopSearchInput"
        placeholder="Search..."
        className="border-0 outline-0 py-2 px-2 text-sm w-full"
      />
      <button
        className="grid place-content-cente p-2 text-2xl rounded-lg transition duration-200 hover:scale-105"
        onClick={handleDesktopSearch}
        aria-label="Search on tablet and desktop"
      >
        <IoSearchOutline />
      </button>
    </div>
  );
}
