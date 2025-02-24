import { useEffect, useRef, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  StickyNote,
  Rss,
  BarChartIcon as ChartNoAxesColumnIncreasing,
  PenSquare,
  Pen,
  Menu,
} from "lucide-react";

function Sidebar(props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.pathname.includes("/admin/posts")
    ? "posts"
    : location.pathname.includes("/admin/blogs")
    ? "blogs"
    : location.pathname.replace("/admin/", "");
  const [activeNavItem, setActiveNavItem] = useState(result);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 768;
      setIsMobile(isMobileView);
      if (!isMobileView) {
        setIsSidebarOpen(true);
      }
    };

    const handleClickOutside = (e) => {
      if (
        isMobile &&
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !e.target.closest("button")
      ) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isSidebarOpen]);

  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

  const iconMap = {
    LayoutDashboard,
    Users,
    StickyNote,
    Rss,
    ChartNoAxesColumnIncreasing,
    PenSquare,
    Pen,
  };
  const navItems = [
    { name: "dashboard", icon: "LayoutDashboard" },
    { name: "users", icon: "Users" },
    { name: "posts", icon: "StickyNote" },
    { name: "blogs", icon: "Rss" },
    // { name: "analytics", icon: "ChartNoAxesColumnIncreasing" },
    { name: "add-category", icon: "PenSquare" },
    { name: "write-blog", icon: "Pen" },
  ];

  const handleLinkClick = (path) => {
    props.setProgress(70);
    setTimeout(() => {
      props.setProgress(100);
      navigate(`/admin/${path}`);
      setActiveNavItem(path);
    }, 500);
  };

  useEffect(() => {
    setActiveNavItem(result);
  }, [result]);

  return (
    <div className="flex h-[100vh] fixed overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 w-full">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`absolute top-10 left-2 z-10 text-white ${(!isMobile && isSidebarOpen) && 'hidden'}`}
      >
        <Menu size={24} />
      </button>

      <aside
        ref={sidebarRef}
        className={`w-[250px] bg-gradient-to-br from-gray-900 to-gray-800 border-r border-gray-600 py-6 px-2 shadow-2xl transition-all duration-300 ${
          isMobile ? "absolute top-0 left-0 h-full z-40" : ""
        } ${isMobile && !isSidebarOpen ? "-translate-x-full" : ""}`}
      >
        <h1 className="text-xl text-center font-semibold mb-[30px]">
          Admin Panel
        </h1>
        <nav>
          <ul className="list-none p-0">
            {navItems.map(({ name, icon }) => {
              const IconComp = iconMap[icon];
              return (
                <Link
                  onClick={() => {
                    handleLinkClick(name);
                    if (isMobile) setIsSidebarOpen(false);
                  }}
                  key={name}
                  className={`mb-[10px] flex px-6 py-2 rounded-md gap-4 cursor-pointer duration-300 ${
                    activeNavItem === name
                      ? "bg-[#a5a5a511] font-semi-bold"
                      : "hover:bg-[#a5a5a511]"
                  }`}
                >
                  {IconComp && <IconComp className="w-8 h-8" />}
                  <p className="w-[100%] text-left capitalize">
                    {name.replace("-", " ")}
                  </p>
                </Link>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Sidebar;
