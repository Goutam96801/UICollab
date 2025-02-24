import {  Globe, Layers, Zap } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { AdminContext } from "../../App"
import AdminAuthentication from "../components/admin-authentication";

export default function AdminHome() {

    let { adminAuth: {access_token}} = useContext(AdminContext);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const closeOnEscapeKey = (e) =>
      e.key === "Escape" ? setAuthOpen(false) : null;
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, []);

  useEffect(() => {
    if (authOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [authOpen]);

  const handleCloseBtn = () => {
    setAuthOpen(false);
  };
    
  return (
    <div className="flex flex-col min-h-screen ">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <img className="logo max-w-[85px]" src="/logo.svg" alt=""></img>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className=" px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to UICollab Admin
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Manage your UI components, track usage, and analyze performance all in one place.
                </p>
              </div>
              <div className="space-y-4">
                {!access_token ? (
            <button
              onClick={() => setAuthOpen(true)}
              className="bg-[#212121] px-4 py-2 font-bold rounded-md"
            >
              Sign In or Create Admin Account
            </button>) :
            <Navigate to="/admin/dashboard"/>
                }
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-600">
          <div className=" px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <Globe className="h-10 w-10 text-blue-600" />
                <h2 className="text-2xl font-bold">Global Reach</h2>
                <p className="max-w-[300px] text-gray-500">
                  Your components used by developers worldwide. Track global usage and impact.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Layers className="h-10 w-10 text-blue-600" />
                <h2 className="text-2xl font-bold">Component Management</h2>
                <p className="max-w-[300px] text-gray-500">
                  Easily manage, update, and version your UI components from a central dashboard.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Zap className="h-10 w-10 text-blue-600" />
                <h2 className="text-2xl font-bold">Performance Insights</h2>
                <p className="max-w-[300px] text-gray-500">
                  Get real-time analytics on component performance and user engagement.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className=" px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Join UICollab Today</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Start managing your UI components and tracking their impact across the web.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <input className="max-w-lg flex-1 px-2 py-1 rounded" placeholder="Enter your email" type="email" />
                  <button type="submit" className="bg-[#212121] px-2 py-1 rounded">Sign Up</button>
                </form>
                <p className="text-xs text-gray-500">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2025 UICollab. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
      {authOpen ? <AdminAuthentication handleCloseBtn={handleCloseBtn} /> : null}
    </div>
  )
}