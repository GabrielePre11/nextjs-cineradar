import { LuLoaderCircle } from "react-icons/lu";

export default function Loader() {
  return (
    <div className="grid place-content-center text-4xl my-8 animate-spin z-50">
      <LuLoaderCircle aria-label="Loader / Loading Icon" />
    </div>
  );
}
