import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Palette,
  Box,
  Building2,
  LogOut,
  Aperture,
  BrickWall,
  Gem,
  ChevronRight,
  Home,
  ChevronLeft,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import sidebarlogo from "../../images/sidebar_logo.png";

const LogoHeader = ({ isCollapsed = false }) => {
  return (
    <div className="p-4 flex items-center justify-center">
      <motion.div
        animate={{ scale: isCollapsed ? 0.8 : 1 }}
        className="flex items-center"
      >
        {/* Show logo in both collapsed and expanded states */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <img
            src={sidebarlogo}
            alt="logo"
            className={`h-auto ${
              isCollapsed ? "max-w-[80px] mt-4" : "max-w-[140px]"
            }`}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userToggled, setUserToggled] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);

  // Initialize state based on screen size
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024; // Collapsed by default for screens < 1024px
    }
    return true; // Fallback for SSR
  });
  const menuGroups = [
    {
      title: "MAIN",
      items: [
        { name: "Dashboard", icon: Home, to: "/dashboard" },
        { name: "Suppliers", icon: Users, to: "/supplier" },
        { name: "Client", icon: Users, to: "/client" },
      ],
    },
    {
      title: "PROPERTY",
      items: [
        { name: "Apartments", icon: Building2, to: "/apartment" },
        { name: "Colors", icon: Aperture, to: "/colours" },
        { name: "Materials", icon: BrickWall, to: "/material" },
      ],
    },
    {
      title: "FURNITURE",
      items: [
        {
          name: "Furniture Families",
          icon: Palette,
          to: "/furniture-management",
        },
        {
          name: "Furniture Sub Families",
          icon: Palette,
          to: "/furniture-sub-families",
        },
        { name: "Product Catalogue", icon: Box, to: "/product-catalogue" },
      ],
    },
    {
      title: "BUSINESS",
      items: [{ name: "Proposals", icon: Gem, to: "/proposal" }],
    },
  ];
  useEffect(() => {
    const handleResize = () => {
      if (!userToggled) {
        setIsCollapsed(window.innerWidth < 1024);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [userToggled]);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    setUserToggled(true);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const sidebarVariants = {
    expanded: { width: "320px" },
    collapsed: { width: "80px" },
  };

  return (
    <motion.div
      initial={isCollapsed ? "collapsed" : "expanded"}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ duration: 0.3 }}
      className="bg-sidebar text-white relative flex flex-col h-screen"
    >
      <button
        onClick={handleToggle}
        className="absolute -right-3 top-8 bg-white p-1 mr-2 rounded-full shadow-lg z-50"
      >
        <motion.div
         // animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-black font-extrabold" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-black font-extrabold" />
          )}
        </motion.div>
      </button>

      <LogoHeader isCollapsed={isCollapsed} />

      {/* Menu Groups */}
      <div
        className={`overflow-y-auto px-3 py-8 flex-1 ${
          isCollapsed ? "overflow-hidden" : "scrollable-view"
        }`}
        style={{
          scrollbarWidth: !isCollapsed ? "thin" : "none",
          scrollbarColor: "#EEEBE7 #262525",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            {!isCollapsed && (
              <div className="text-white/20 text-base font-semibold mb-3 px-2">
                {group.title}
              </div>
            )}
            {group.items.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className={`relative flex items-center px-2.5 py-3 mb-1.5 rounded-xl transition-all duration-200
                  ${
                    location.pathname === item.to
                      ? "bg-white/30 text-white font-bold"
                      : "text-white hover:bg-white/20"
                  }`}
                onMouseEnter={() => setActiveGroup(groupIndex)}
                onMouseLeave={() => setActiveGroup(null)}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon
                    className={`w-6 h-6 ${
                      location.pathname === item.to
                        ? "text-white font-bold text-lg"
                        : "text-slate-400"
                    }`}
                  />
                </motion.div>
                {!isCollapsed && (
                  <motion.span
                    initial={false}
                    animate={{ opacity: 1 }}
                    className="ml-4 text-lg font-medium"
                  >
                    {item.name}
                  </motion.span>
                )}
                {isCollapsed && location.pathname === item.to && (
                  <motion.div
                    className="absolute left-16 bg-white/20 text-white px-3 py-1.5 rounded-md text-lg whitespace-nowrap z-50"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {item.name}
                  </motion.div>
                )}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Add custom scrollbar styles - only applied when the scrollable-view class is present */}
      <style jsx global>{`
        .scrollable-view::-webkit-scrollbar {
          width: 6px;
        }

        .scrollable-view::-webkit-scrollbar-track {
          background: #262525;
          border-radius: 4px;
        }

        .scrollable-view::-webkit-scrollbar-thumb {
          background: #eeebe7;
          border-radius: 4px;
        }

        .scrollable-view::-webkit-scrollbar-thumb:hover {
          background: #d6d3cf;
        }
      `}</style>
      {/* Logout Section */}

      <div className="mt-auto px-3 py-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${
            isCollapsed ? "justify-center" : "px-2"
          } py-2.5 rounded-xl transition-colors duration-200 hover:bg-red-500/10`}
        >
          <LogOut
            className={`w-6 h-6 ${
              isCollapsed ? "text-white" : "text-white mr-5"
            }`}
          />
          {!isCollapsed && (
            <span className="text-lg text-white font-medium">Logout</span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
