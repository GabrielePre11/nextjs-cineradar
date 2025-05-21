/*============ CLIENT COMPONENT ============*/
"use client";

/*============ IMPORT OF HOOKS, NEXT LINK, COMPONENTS, CN, LODASH DEBOUNCE ============*/
// Next Link
import Link from "next/link";
// States Hooks
import { useEffect, useState } from "react";
// CN
import { cn } from "@/lib/utils";

// ============ SEARCHBAR AND NAVBAR COMPONENTS
// Mobile SearchBar
import SearchBar from "../ui/SearchBar";
// Desktop and Tablet SearchBar
import DesktopSearchBar from "../ui/DesktopSearchBar";

// Desktop and Tablet Navbar
import DesktopNavbar from "../ui/DesktopNavbar";

// ============ REACT ICONS
import { IoSearchOutline } from "react-icons/io5";
import { FcFilmReel } from "react-icons/fc";

/*============ HEADER COMPONENT ============*/
export default function Header() {
  /*============ USESTATES HOOKS ============*/

  /*
  - searchOpen is used to open and close the mobile Searchbar.
  - Initially, is false (so it's closed)
  */
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  /*
  - isScrolled is used to define whether the user has scrolled or not, if it did, the Header will be given new classes.
  - Initially, is false (so it's closed)
  */
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  /*
  - The useEffect handles the events to run the scrollHeader function when the user scrolls.
  - Then, it removes the eventListener.
  */
  useEffect(() => {
    const scrollHeader = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", scrollHeader);
    return () => {
      window.removeEventListener("scroll", scrollHeader);
    };
  }, []);

  return (
    <header
      className={cn(
        "top-0 left-0 w-full z-10 transition-all duration-300",
        isScrolled ? "fixed bg-[#111111]" : "absolute bg-transparent"
      )}
    >
      <div className="flex container px-3 py-4 items-center justify-between mx-auto max-w-7xl">
        {/*======== LOGO ========*/}
        <Link
          href={"/movies"}
          className="inline-flex items-center gap-1.5 text-lg"
        >
          <h2 className="flex items-center sm:text-2xl">
            Cine
            <span className="text-brandeis font-semibold">Radar</span>
          </h2>
          <FcFilmReel className="text-2xl" aria-label="Title Icon" />
        </Link>

        {/*======== SEARCH BAR [TABLET AND DESKTOP] ========*/}
        <div className="flex items-center gap-5">
          <DesktopNavbar />
          <DesktopSearchBar />
        </div>

        {/*======== SEARCH BAR [MOBILE DEVICES] ========*/}
        <SearchBar searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

        {/*======== SEARCH BAR BUTTON [MOBILE DEVICES] ========*/}
        <button
          onClick={() => {
            setSearchOpen((prev) => !prev);
          }}
          className={cn(
            "p-1.5 rounded-full transition-all duration-200 hover:bg-brandeis sm:hidden",
            searchOpen
              ? "bg-brandeis rotate-x-180 hover:bg-brandeis/80"
              : "bg-transparent"
          )}
        >
          <IoSearchOutline className="text-2xl" aria-label="Search button" />
        </button>
      </div>
    </header>
  );
}
