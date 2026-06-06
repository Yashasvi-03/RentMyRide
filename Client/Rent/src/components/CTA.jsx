import { useNavigate } from "react-router-dom";

function CTA() {
  const navigate=useNavigate();
  return (
    <section className="py-24 px-6 text-center">
      <h2 className="text-4xl font-semibold mb-6">Ready to Book Your Ride?</h2>

      <p className="text-gray-300 mb-10">
        Choose your dream car and start your journey today.
      </p>

      <button
        onClick={() => navigate("/cars")}
        className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition duration-300 text-white text-lg"
      >
        Explore Cars 
      </button>
    </section>
  );
}
export default CTA;
