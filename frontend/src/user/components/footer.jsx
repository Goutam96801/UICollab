import { motion } from "framer-motion";
import {
  Loader2,
  Mail,
  Twitter,
  Facebook,
  Instagram,
  Github,
  Linkedin,
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscription = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    setTimeout(async () => {
      try {
        const response = await axios.post(
          process.env.REACT_APP_SERVER_DOMAIN + "/subscribe",
          { email }
        );

        setIsSubmitting(false);
        toast.success(response?.data?.message);
        e.target.reset();
      } catch (error) {
        const errorMessage = error?.response?.data?.message;
        setIsSubmitting(false);
        toast.error(errorMessage || "something went wrong");
      }
    }, 1500);
  };
  return (
    <footer className="bg-[#0D1117] text-white py-16">
      <Toaster />
      <div className=" mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div {...fadeIn}>
            <img src="/logo.png" width={150} alt="" className="mb-4" />
            <p className="text-gray-400 max-w-xs">
              Empowering UI developers to create, collaborate, and innovate.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  UI Components
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Resources
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
            <h3 className="text-lg font-semibold mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Stay updated with the latest UI trends and tips.
            </p>
            <form onSubmit={handleSubscription} className=" space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                    Subscribing
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center mt-16 pt-8 border-t border-gray-800"
          {...fadeIn}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-400 mb-4 md:mb-0">
            © 2025 UICollab. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
