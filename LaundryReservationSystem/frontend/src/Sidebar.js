import React, { useState } from "react";

const Sidebar = ({ role, activeTab, setActiveTab, handleLogout }) => {
  const [expanded, setExpanded] = useState(false);

  const adminTabs = [
    { key: "Reservations", label: "Reservations" },
    { key: "Laundry", label: "Laundry Status" },
    { key: "Delivery", label: "Delivery Status" },
  ];

  const toggleSidebar = () => setExpanded(!expanded);

  const sidebarStyle = {
    width: expanded ? "220px" : "60px",
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

      <button
        onClick={handleLogout}
        style={{
          marginTop: "auto",
          backgroundColor: "#e74c3c",
          color: "white",
          border: "none",
          padding: "10px",
          cursor: "pointer",
          textAlign: expanded ? "left" : "center",
        }}
      >
        {expanded ? "Logout" : "L"}
      </button>
    </div>
  );
};

export default Sidebar;
