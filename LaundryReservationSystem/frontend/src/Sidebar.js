import React, { useState } from "react";

const Sidebar = ({ role, activeTab, setActiveTab, handleLogout }) => {
  const [expanded, setExpanded] = useState(false);

  // Tabs for admin
  const adminTabs = [
    { key: "Reservations", label: "Reservations" },
    { key: "Laundry", label: "Laundry Status" },
    { key: "Delivery", label: "Delivery Status" },
  ];

  const toggleSidebar = () => setExpanded(!expanded);

  const sidebarStyle = {
    width: expanded ? "200px" : "60px",
    backgroundColor: "#2c3e50",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    transition: "width 0.3s",
    overflow: "hidden",
    height: "100vh",
  };

  const buttonStyle = (tabKey) => ({
    backgroundColor: activeTab === tabKey ? "#34495e" : "transparent",
    color: "white",
    border: "none",
    padding: "10px",
    marginBottom: "5px",
    textAlign: expanded ? "left" : "center",
    cursor: "pointer",
    borderLeft: activeTab === tabKey ? "4px solid #e74c3c" : "none",
    whiteSpace: "nowrap",
    overflow: "hidden",
  });

  return (
    <div style={sidebarStyle}>
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        style={{
          marginBottom: "20px",
          backgroundColor: "transparent",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        {expanded ? "☰ Close" : "☰"}
      </button>

      {/* Tabs based on role */}
      {role === "admin"
        ? adminTabs.map((tab) => (
            <button
              key={tab.key}
              style={buttonStyle(tab.key)}
              onClick={() => setActiveTab(tab.key)}
            >
              {expanded ? tab.label : tab.label[0]}
            </button>
          ))
        : (
          <button
            style={buttonStyle("Reservation")}
            onClick={() => setActiveTab("Reservation")}
          >
            {expanded ? "Reserve Laundry" : "R"}
          </button>
        )}

      {/* ✅ About Us Button - just above Logout */}
      <button
        style={{
          ...buttonStyle("About Us"),
          marginTop: "auto",
          backgroundColor: activeTab === "About Us" ? "#34495e" : "transparent",
        }}
        onClick={() => setActiveTab("About Us")}
      >
        {expanded ? "About Us" : "About"}
      </button>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "#e74c3c",
          color: "white",
          border: "none",
          padding: "10px",
          cursor: "pointer",
          textAlign: expanded ? "left" : "center",
          marginTop: "5px",
        }}
      >
        {expanded ? "Logout" : "L"}
      </button>
    </div>
  );
};

export default Sidebar;
