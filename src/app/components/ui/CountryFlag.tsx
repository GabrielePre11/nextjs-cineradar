/*============ CountryFlagProps INTERFACE ============*/
interface CountryFlagProps {
  // iso: is the ISO 3166-1 alpha-2 code of a country (ex. "US", "IT", "FR").
  iso: string;
}

/*============ CountryFlagProps COMPONENT ============*/

/*
- This component receveis an iso as a parameter to display the flag of a coutry.
*/

export default function CountryFlag({ iso }: CountryFlagProps) {
  const countryCode = iso.toLowerCase();

  return (
    <img
      src={`https://flagcdn.com/40x30/${countryCode}.png`}
      srcSet={`
          https://flagcdn.com/80x60/${countryCode}.png 2x,
          https://flagcdn.com/120x90/${countryCode}.png 3x
        `}
      alt={`Flag of ${iso}`}
      loading="lazy"
      style={{ width: "25px", height: "auto" }}
    />
  );
}
