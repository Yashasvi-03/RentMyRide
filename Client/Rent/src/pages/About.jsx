import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

function About() {
  return (
    <>
    <Navbar/>
      <div className="bg-gradient-to-br from-blue-950 via-gray-900 to-blue-950  text-white min-h-screen px-6 py-16">
        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">Our Journey</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            How RentMyRide started and how we are changing the way people rent
            cars in India.
          </p>
        </motion.div>

        {/*  STORY SECTION */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4"> The Idea</h2>
            <p className="text-gray-400 leading-relaxed">
              RentMyRide was born from a simple problem — renting a car in local
              areas was confusing, untrusted, and time-consuming. We decided to
              build a platform where users can easily find verified cars and
              agencies.
            </p>
          </motion.div>

          <motion.img
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            src="https://images.unsplash.com/photo-1525609004556-c46c7d6cf023"
            className=" rounded-2xl shadow-lg h-200px"
          />
        </div>

        {/*  MISSION SECTION */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.img
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
            className="rounded-2xl shadow-lg"
          />

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4"> Our Mission</h2>
            <p className="text-gray-400 leading-relaxed">
              To make car rental simple, transparent, and accessible for
              everyone. We aim to connect users with trusted agencies and
              provide a smooth booking experience.
            </p>
          </motion.div>
        </div>

        {/*  TIMELINE */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
             Our Progress
          </h2>

          <div className="space-y-10">
            <div className="border-l-2 border-blue-500 pl-6">
              <h3 className="text-xl font-semibold">2025 - Idea Started</h3>
              <p className="text-gray-400">
                We identified problems in local car rental systems.
              </p>
            </div>

            <div className="border-l-2 border-purple-500 pl-6">
              <h3 className="text-xl font-semibold">2025 - MVP Built</h3>
              <p className="text-gray-400">
                We built the first working version using MERN stack.
              </p>
            </div>

            <div className="border-l-2 border-pink-500 pl-6">
              <h3 className="text-xl font-semibold">2026 - Growing Platform</h3>
              <p className="text-gray-400">
                Now expanding with agencies, bookings, and admin panel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
