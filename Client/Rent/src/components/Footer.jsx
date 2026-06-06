
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="relative mt-20 px-6 pt-20 pb-10  backdrop-blur-xl bg-white/5 text-white overflow-hidden">
      {/*  Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-indigo-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[300px] h-[300px] bg-purple-500/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
        {/* Logo + About */}
        <div>
          <h1 className="text-2xl font-bold">
            Rent<span className="text-indigo-400">MyRide</span>
          </h1>
          <p className="mt-4 text-gray-300 text-sm leading-relaxed">
            Experience premium car rentals with comfort, style and trust.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="hover:text-white cursor-pointer transition">Home</li>
            <li className="hover:text-white cursor-pointer transition">Cars</li>
            <li className="hover:text-white cursor-pointer transition">
              Bookings
            </li>
            <li className="hover:text-white cursor-pointer transition">
              Profile
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>Luxury Cars</li>
            <li>Budget Cars</li>
            <li>Daily Rentals</li>
            <li>Long Term Rentals</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>

          <div className="flex gap-4">
            <div className="p-3 bg-white/10 rounded-full hover:bg-indigo-500 transition cursor-pointer">
              <FaFacebookF />
            </div>

            <div className="p-3 bg-white/10 rounded-full hover:bg-pink-500 transition cursor-pointer">
              <FaInstagram />
            </div>

            <div className="p-3 bg-white/10 rounded-full hover:bg-blue-400 transition cursor-pointer">
              <FaTwitter />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="relative text-center mt-14 border-t border-white/10 pt-6 text-gray-400 text-sm">
        © 2026 RentMyRide. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
