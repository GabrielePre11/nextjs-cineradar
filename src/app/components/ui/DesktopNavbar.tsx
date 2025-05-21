/*============ CLIENT COMPONENT ============*/
"use client";

/*============ IMPORT OF NEXT LINK, CN, NEXT USEPATHNAME ============ */
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

/*============ Links INTERFACE ============*/
interface Links {
  label: string;
  href: string;
}

// The navLinks follow the structure of the Links Interface.
const navLinks: Links[] = [
  { label: "Movies", href: "/movies" },
  { label: "Series", href: "/tv-series" },
  { label: "Favorites", href: "/favorites" },
];

/*============ DesktopNavbar COMPONENT ============*/

// Here I need the pathname to know where the user is.
// For example, if the user is on /tv-series, the 'Series' link will be blue.
export default function DesktopNavbar() {
  const pathname = usePathname();

  return (
    <ul className="hidden lg:flex items-center gap-3">
      {navLinks.map(({ label, href }) => (
        <li key={label} className="text-lg text-white">
          <Link href={href}>
            <span
              className={cn(
                "text-lg transition-colors duration-200 hover:text-brandeis",
                pathname === href ? "text-brandeis" : "text-white"
              )}
            >
              {label}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
