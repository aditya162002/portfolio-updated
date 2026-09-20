import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 sm:mt-16 py-10">
      <div>
        <h3 className="text-white text-2xl sm:text-3xl font-bold font-poppins max-sm:text-center">
          Have a project in mind?
        </h3>
        <p className="text-gray-500 mt-2 text-sm max-sm:text-center">
          Let&apos;s build something that ships.
        </p>
      </div>
      <Link
        to="/contact"
        className="px-8 py-3 rounded-xl text-white text-sm font-semibold border border-sky-400/30 bg-sky-500/10 hover:bg-sky-500/20 transition-all duration-300 whitespace-nowrap hover:-translate-y-0.5"
      >
        Get in Touch →
      </Link>
    </section>
  );
};

export default CTA;
