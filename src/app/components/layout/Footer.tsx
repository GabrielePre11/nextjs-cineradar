import Image from "next/image";

import { ImPower } from "react-icons/im";
import { FaCode, FaGithub } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bottom-0 left-0 w-full z-10 bg-[#111111]">
      <ul className="flex container flex-col mx-auto max-w-7xl lg:flex-row items-center gap-3 sm:justify-between sm:px-3 sm:py-2">
        <li className="flex items-center gap-3">
          <h2 className="flex items-center gap-1.5 text-sm sm:text-lg">
            <ImPower className="text-lg sm:text-2xl text-gold" />
            Powered by
          </h2>
          <Link href={"https://www.themoviedb.org/"}>
            <figure className="relative w-20 h-15">
              <Image
                src="/tmdb_logo.svg"
                alt="TMDB Logo"
                fill
                priority
                className="object-contain"
              />
            </figure>
          </Link>
        </li>

        <li className="flex items-center gap-1.5 pb-2 lg:pb-0">
          <FaCode className="text-2xl" />
          <h3 className="flex items-center gap-1.5 text-md sm:text-lg">
            Coded by <span className="font-semibold">Gabriele Prestano</span>
          </h3>
        </li>

        <li className="flex items-center gap-2.5 pb-3 lg:pb-0">
          <h3 className="flex items-center text-md sm:text-lg">
            Contact me on
          </h3>
          <Link href={"https://github.com/GabrielePre11"}>
            <FaGithub
              className="text-2xl text-brandeis cursor-pointer transition-colors duration-300 hover:text-brandeis/60"
              aria-label="GitHub Link"
            />
          </Link>
          <Link
            href={"https://www.linkedin.com/in/gabriele-prestano-70a346357"}
          >
            <FaLinkedinIn
              className="text-2xl text-brandeis cursor-pointer transition-colors duration-300 hover:text-brandeis/60"
              aria-label="Linkedin Link"
            />
          </Link>
        </li>
      </ul>
    </footer>
  );
}
