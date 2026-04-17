import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center text-black px-6">
        {/* Big 404 */}
        <h1 className="text-[120px] md:text-[180px] font-extrabold leading-none drop-shadow-lg text-theme-blue">
          404
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl font-semibold mb-4">
          Page not found
        </p>

        {/* Description */}
        <p className="text-sm md:text-base opacity-90 mb-8">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Button */}
        <Link
          href="/"
          className="inline-block rounded-full bg-white text-theme-blue px-6 py-3 font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;