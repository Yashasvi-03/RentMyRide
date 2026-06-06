

import { motion } from "framer-motion";

function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Choose Car",
      desc: "Browse and select your favorite car.",
    },
    {
      step: "02",
      title: "Book Instantly",
      desc: "Fill details and confirm booking.",
    },
    {
      step: "03",
      title: "Enjoy Ride",
      desc: "Drive and enjoy your journey.",
    },
  ];

  return (
    <section
      className="py-10 pt-12 pb-20  px-6 text-white text-center 
      bg-transparent"
    >
      <h2 className="text-4xl font-bold mb-16">
        How It <span className="text-blue-400">Works</span>
      </h2>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {steps.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 
                       p-8 rounded-2xl transition duration-300 cursor-pointer
                       hover:bg-gradient-to-br hover:from-blue-500 hover:to-indigo-600
                       hover:border-transparent hover:scale-105"
          >
            <div className="text-4xl font-bold text-blue-400 mb-4">
              {item.step}
            </div>

            <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>

            <p className="text-gray-200">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
