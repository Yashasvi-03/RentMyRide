
import { motion } from "framer-motion";

function WhyChoose() {
  const data = [
    {
      title: "Best Pricing",
      desc: "Affordable rates with no hidden charges.",
    },
    {
      title: "Verified Cars",
      desc: "All cars are inspected and verified.",
    },
    {
      title: "Instant Booking",
      desc: "Book your ride in seconds easily.",
    },
  ];

  return (
    <section
      className=" -mt-10 pt-12 pb-20 px-6 text-white text-center 
      bg-transparent"
    >
      <h2 className="text-4xl font-semibold mb-16">Why Choose Us</h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {data.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 
                       p-8 rounded-xl transition duration-300
                       hover:bg-white/20 hover:scale-[1.03]"
          >
            <h3 className="text-xl font-medium mb-3">{item.title}</h3>

            <p className="text-gray-200 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default WhyChoose;
