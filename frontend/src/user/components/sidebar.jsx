"use client";

import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import * as LucidIcons from "lucide-react";
import axios from "axios";

export default function Sidebar({ isOpen }) {
  const [categories, setCategories] = useState([]);

  const getIconComponent = (name) => {
    // Dynamically find the component from imported icons
    const IconComponent = LucidIcons[name];
    return IconComponent ? <IconComponent size={20} /> : null;
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER_DOMAIN + "/get-categories"
      );

      const updatedCategories = [
        { name: "All", icon: "List", post: [] },
        ...data.category,
      ];
      setCategories(updatedCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="relative h-full overflow-hidden">
      <nav
        className="h-[50%] overflow-auto custom-scrollbar-transparent"
        role="navigation"
        aria-label="Main navigation"
      >
        {categories.map(({ name, icon }, index) => (
          <NavLink
            key={index}
            to={name === "All" ? "/elements" : `/${name.toLowerCase()}`}
            className={`mb-1 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-normal tracking-wide transition-colors hover:bg-[rgb(33,33,33)] text-white"
                  `}
          >
            <div className="flex items-center gap-3 ">
              {getIconComponent(icon)}
              <span className="capitalize">{name}</span>
            </div>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
