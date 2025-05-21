/*============ CLIENT COMPONENT ============*/
"use client";

/*============ IMPORT OF HOOKS, NEXT IMAGE, NEXT LINK, CN, USEPATHNAME, REACT ICONS ============ */
// Next Link
import Link from "next/link";
// Next Navigation usePathname
import { usePathname } from "next/navigation";
// CN
import { cn } from "@/lib/utils";

/*============ REACT ICONS */
// Movies Icon
import { PiFilmSlate } from "react-icons/pi";
// Favorites and Series Icons
import { FaStar, FaTv } from "react-icons/fa";

/*============ HOOKS */
import { useState, useEffect, useRef } from "react";

/*============ MobileNavbar COMPONENT ============*/
export default function MobileNavbar() {
  // isScrolled is used to handles the scrolling and determines if the navbar is visible or not.
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  /*
  - Here the useRef is used to store the last position of the scroll, which initially is 0.
  - But, differently than the useState it doesn't render again.
  */
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Every time the user scrolls this function (scrollNavbar) is called.
    const scrollNavbar = () => {
      // Obtain the current vertical position (in px)
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // If the user is SCROLLING DOWN and it UNDER 50px hide the navbar.
        setIsScrolled(false);
      } else {
        // The user is scrolling UP or it's at the start of the page (show the navbar)
        setIsScrolled(true);
      }

      // It saves the current value to compare it when the user scrolls again
      lastScrollY.current = currentScrollY;
    };

    // Add and then remove the event which runs the function on scroll (scrollNavbar)
    window.addEventListener("scroll", scrollNavbar);
    return () => {
      window.removeEventListener("scroll", scrollNavbar);
    };
  }, []);

  /*============ Links INTERFACE ============*/
  interface Links {
    icon: React.ReactNode;
    label: string;
    href: string;
  }

  // The navLinks follow the structure of the Links Interface.
  const navLinks: Links[] = [
    { icon: <PiFilmSlate />, label: "Movies", href: "/movies" },
    { icon: <FaStar />, label: "Favorites", href: "/favorites" },
    { icon: <FaTv />, label: "Series", href: "/tv-series" },
  ];

  // Here I need the pathname to know where the user is.
  // For example, if the user is on /tv-series, the 'Series' link will be blue.
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "fixed left-0 bottom-0 w-full z-10 transition-transform duration-300 lg:hidden",
        isScrolled ? "translate-y-0" : "translate-y-full"
      )}
    >
      <nav className="mx-auto sm:max-w-2xl bg-[#111111] rounded-tl-lg rounded-tr-lg">
        <ul className="flex items-center justify-around py-2.5 px-3">
          {navLinks.map(({ icon, label, href }) => (
            <li key={label}>
              <Link
                href={`${href}`}
                className="flex flex-col items-center justify-center gap-1"
              >
                <span
                  className={cn(
                    "text-2xl transition-colors duration-200 hover:text-brandeis",
                    pathname === href ? "text-brandeis" : "text-white"
                  )}
                >
                  {icon}
                </span>
                <h3 className="text-xs font-semibold">{label}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
