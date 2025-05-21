/*============ CLIENT COMPONENT ============*/
"use client";

/*============ IMPORTING REACT ICONS, CN, REACT HOOKS AND NEXT NAVIGATION ROUTER & PATHNAME ============*/
import { IoSearchOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

/*============ SEARCHBARPROPS INTERFACE ============*/
interface SearchBarProps {
  searchOpen: boolean;
  setSearchOpen: (value: boolean) => void;
}

/*============ SearchBar (MOBILE) COMPONENT ============*/
export default function SearchBar({
  searchOpen,
  setSearchOpen,
}: SearchBarProps) {
  /*============ USESTATE, ROUTER AND PATHNAME ============*/

  /*
  - userSearchQuery stores the value of the input (the query) that the user writes.
  */
  const [userSearchQuery, setUserSearchQuery] = useState<string>("");

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

  /*============ USE EFFECT TO HANDLE THE CLOSE OF THE MOBILE SEARCHBAR ON SCROLL ============*/

  /*
  - When the mobile Searchbar is open, and the user scrolls down, the Searchbar closes.
  - The event which run the closeSearchOnScroll function() is then removed.
  */
  useEffect(() => {
    const closeSearchOnScroll = (): void => {
      setSearchOpen(false);
    };
    window.addEventListener("scroll", closeSearchOnScroll);
    return () => window.removeEventListener("scroll", closeSearchOnScroll);
  }, [setSearchOpen]);

  /*============ HANDLESEARCH FUNCTION TO RETRIEVE THE QUERY AND PUSH IT TO THE URL ============*/
  const handleSearch = () => {
    // The userQuery constant stores and converts the input to lowercase and trim spaces to
    // avoid issues with capitalization or accidental spaces.
    const userQuery = userSearchQuery.trim().toLowerCase();

    // If the user hasn't written anything, return.
    if (!userQuery) return;

    // Once entered the query, reset (close) the Searchbar and the query wrote by the user.
    setSearchOpen(false);
    setUserSearchQuery("");

    // Push the query to the URL so that Movies and Series can use useSearchParams() to retrieve it and fetch the URL.
    // encodeURIComponent: Encodes a text string as a valid component of a Uniform Resource Identifier (URI). (src: VSCODE Editor).
    router.push(`${pathname}?query=${encodeURIComponent(userQuery)}`);
  };

  return (
    <div
      className={cn(
        "absolute container flex max-w-[280px] sm:hidden px-3 py-3.5 rounded-lg -top-30 left-1/2 -translate-x-1/2 gap-2 transition-transform duration-300 bg-[#111111]",
        searchOpen ? "translate-y-48" : ""
      )}
    >
      <input
        type="text"
        name="searchInput"
        placeholder="The Conjuring..."
        value={userSearchQuery}
        // If the user presses Enter, it rusn the handleSearch function()
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        onChange={(e) => setUserSearchQuery(e.target.value)}
        className="flex w-full py-2 px-2 border border-gray-400 rounded-lg outline-0"
      />
      <button
        className="grid place-content-center px-2.5 bg-brandeis rounded-lg text-xl transition-colors duration-200 hover:bg-brandeis/80"
        onClick={handleSearch}
        aria-label="Search on mobile"
      >
        <IoSearchOutline />
      </button>
    </div>
  );
}
