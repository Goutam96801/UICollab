import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Mail, Sparkles, Star } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

export default function BlogComingSoon() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e) => {
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
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Animated Background */}
      {/* <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3b0764,transparent)]" />
      </div> */}
      <Toaster />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Coming Soon Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Coming Soon</span>
            <Sparkles className="w-4 h-4" />
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              We're Crafting Something{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Special
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
              We're working hard to bring you a unique way of writing and reading blogs. 
              A platform where creativity meets technology, making every story worth telling.
            </p>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12"
          >
            {[
              { icon: Star, title: "Interactive Stories", description: "Engage with content in ways you've never experienced before" },
              { icon: Sparkles, title: "Rich Media Support", description: "Bring your stories to life with immersive media integration" },
              { icon: Mail, title: "Community First", description: "Connect with like-minded creators and readers" }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="p-6 rounded-xl bg-zinc-900/50 backdrop-blur border border-zinc-800"
              >
                <feature.icon className="w-6 h-6 text-purple-400 mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                <p className="text-zinc-400">Be the first to know when we launch.</p>
                <div className="flex gap-2">
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
                        Notifying
                      </>
                    ) : (
                      "Notify Me"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-purple-500/10 text-purple-400 p-4 rounded-lg max-w-md mx-auto"
              >
                Thanks for subscribing! We'll keep you posted.
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-zinc-600">
        <p>© {new Date().getFullYear()} UICollab. All rights reserved.</p>
      </footer>
    </div>
  );
}

