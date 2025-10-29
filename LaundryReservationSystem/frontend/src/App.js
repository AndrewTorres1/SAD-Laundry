import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
import "./App.css";

// Initial users
const initialUsers = [
  { username: "admin", password: "12345", role: "admin" },
];

function Login({ users }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      navigate("/dashboard", { state: { username: user.username, role: user.role } });
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h2>Login</h2>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <button type="submit">Login</button>
        <p style={{ marginTop: "10px" }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

function Register({ users, setUsers }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) return alert("Fill all fields");
    if (users.find(u => u.username === username)) return alert("Username already exists");

    const newUser = { username, password, role: "customer" };
    setUsers([...users, newUser]);
    alert("Account created successfully!");
    navigate("/");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h2>Register</h2>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <button type="submit">Register</button>
        <p style={{ marginTop: "10px" }}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}

function Dashboard({ reservations, setReservations }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, role } = location.state || { username: "User", role: "customer" };

  const handleLogout = () => navigate("/");

  const [activeTab, setActiveTab] = useState(role === "admin" ? "Reservations" : "Reservation");
  const [newReservation, setNewReservation] = useState({ date: "", time: "", address: "" });

  const handleStatusChange = (id, field, value) =>
    setReservations(reservations.map(r => r.id === id ? { ...r, [field]: value } : r));

  const deleteItem = (id) =>
    setReservations(reservations.filter(r => r.id !== id));

  const addReservation = () => {
    if (!newReservation.date || !newReservation.time || !newReservation.address)
      return alert("Fill all fields");

    const newId = reservations.length ? reservations[reservations.length - 1].id + 1 : 1;
    setReservations([...reservations, {
      ...newReservation,
      id: newId,
      username,
      status: "Pending",
      laundryStatus: "Pending",
      deliveryStatus: "Pending" // Default to Pending
    }]);
    setNewReservation({ date: "", time: "", address: "" });
    alert("Reservation submitted! Waiting for admin approval.");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "orange";
      case "Accepted": return "green";
      case "Finished": return "green";
      case "In Delivery": return "blue"; // Blue for in delivery
      case "Delivered": return "green";
      case "Declined": return "red";
      default: return "black";
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Side Panel */}
      <div style={{
        width: "200px",
        backgroundColor: "#2c3e50",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        <h3>Dashboard</h3>
        {role === "admin" ? (
          <>
            <button onClick={() => setActiveTab("Reservations")} style={tabButtonStyle(activeTab === "Reservations")}>Reservations</button>
            <button onClick={() => setActiveTab("Laundry")} style={tabButtonStyle(activeTab === "Laundry")}>Laundry Status</button>
            <button onClick={() => setActiveTab("Delivery")} style={tabButtonStyle(activeTab === "Delivery")}>Delivery Status</button>
          </>
        ) : (
          <button onClick={() => setActiveTab("Reservation")} style={tabButtonStyle(true)}>Reserve Laundry</button>
        )}
        <button onClick={handleLogout} style={{ marginTop: "auto", backgroundColor: "#e74c3c" }}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <h2>Welcome {username}!</h2>

        {/* Admin Tabs */}
        {role === "admin" && activeTab === "Reservations" && (
          <AdminReservations reservations={reservations} handleStatusChange={handleStatusChange} deleteItem={deleteItem} getStatusColor={getStatusColor} />
        )}
        {role === "admin" && activeTab === "Laundry" && (
          <AdminLaundry reservations={reservations} handleStatusChange={handleStatusChange} deleteItem={deleteItem} getStatusColor={getStatusColor} />
        )}
        {role === "admin" && activeTab === "Delivery" && (
          <AdminDelivery reservations={reservations} handleStatusChange={handleStatusChange} deleteItem={deleteItem} getStatusColor={getStatusColor} />
        )}

        {/* Customer Reservation */}
        {role === "customer" && (
          <CustomerDashboard
            username={username}
            newReservation={newReservation}
            setNewReservation={setNewReservation}
            addReservation={addReservation}
            reservations={reservations}
            getStatusColor={getStatusColor}
          />
        )}
      </div>
    </div>
  );
}

// Admin Components
function AdminReservations({ reservations, handleStatusChange, deleteItem, getStatusColor }) {
  return (
    <div>
      <h3>Customer Reservations</h3>
      {reservations.length === 0 && <p>No reservations yet.</p>}
      {reservations.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Username</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td>{r.time}</td>
                <td>{r.username}</td>
                <td style={{ color: getStatusColor(r.status), fontWeight: "bold" }}>{r.status}</td>
                <td>
                  <select value={r.status} onChange={(e) => handleStatusChange(r.id, "status", e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Declined">Declined</option>
                  </select>
                  <button onClick={() => deleteItem(r.id)} style={deleteButtonStyle}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AdminLaundry({ reservations, handleStatusChange, deleteItem, getStatusColor }) {
  const accepted = reservations.filter(r => r.status === "Accepted");
  return (
    <div>
      <h3>Laundry Status</h3>
      {accepted.length === 0 && <p>No accepted reservations yet.</p>}
      {accepted.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Username</th>
              <th>Laundry Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accepted.map(r => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td>{r.time}</td>
                <td>{r.username}</td>
                <td style={{ color: getStatusColor(r.laundryStatus), fontWeight: "bold" }}>{r.laundryStatus}</td>
                <td>
                  <select value={r.laundryStatus} onChange={(e) => handleStatusChange(r.id, "laundryStatus", e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Finished">Finished</option>
                  </select>
                  <button onClick={() => deleteItem(r.id)} style={deleteButtonStyle}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AdminDelivery({ reservations, handleStatusChange, deleteItem, getStatusColor }) {
  const finished = reservations.filter(r => r.laundryStatus === "Finished");
  return (
    <div>
      <h3>Delivery Status</h3>
      {finished.length === 0 && <p>No finished laundry yet.</p>}
      {finished.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Username</th>
              <th>Delivery Status</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {finished.map(r => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td>{r.time}</td>
                <td>{r.username}</td>
                <td style={{ color: getStatusColor(r.deliveryStatus), fontWeight: "bold" }}>{r.deliveryStatus}</td>
                <td>{r.address}</td>
                <td>
                  <select value={r.deliveryStatus} onChange={(e) => handleStatusChange(r.id, "deliveryStatus", e.target.value)}>
                    <option value="Pending">Pending</option> {/* Added */}
                    <option value="In Delivery">In Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <button onClick={() => deleteItem(r.id)} style={deleteButtonStyle}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Customer Component
function CustomerDashboard({ username, newReservation, setNewReservation, addReservation, reservations, getStatusColor }) {
  const userReservations = reservations.filter(r => r.username === username);
  return (
    <div>
      <h3>Make a Reservation</h3>
      <input type="date" value={newReservation.date} onChange={e => setNewReservation({ ...newReservation, date: e.target.value })} />
      <input type="time" value={newReservation.time} onChange={e => setNewReservation({ ...newReservation, time: e.target.value })} />
      <input type="text" placeholder="Delivery Address" value={newReservation.address} onChange={e => setNewReservation({ ...newReservation, address: e.target.value })} />
      <button onClick={addReservation}>Submit Reservation</button>

      <h3 style={{ marginTop: "20px" }}>Your Laundry Status</h3>
      {userReservations.length === 0 && <p>No reservations yet.</p>}
      {userReservations.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Reservation Status</th>
              <th>Laundry Status</th>
              <th>Delivery Status</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {userReservations.map(r => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td>{r.time}</td>
                <td style={{ color: getStatusColor(r.status), fontWeight: "bold" }}>{r.status}</td>
                <td style={{ color: getStatusColor(r.laundryStatus), fontWeight: "bold" }}>{r.laundryStatus}</td>
                <td style={{ color: getStatusColor(r.deliveryStatus), fontWeight: "bold" }}>{r.deliveryStatus}</td>
                <td>{r.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Styles
const tabButtonStyle = (active) => ({
  backgroundColor: active ? "#34495e" : "transparent",
  color: "white",
  border: "none",
  padding: "10px",
  textAlign: "left",
  cursor: "pointer"
});

const deleteButtonStyle = {
  marginLeft: "5px",
  backgroundColor: "#e74c3c",
  color: "white",
  border: "none",
  padding: "5px",
  cursor: "pointer"
};

// App
function App() {
  const [users, setUsers] = useState(initialUsers);
  const [reservations, setReservations] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login users={users} />} />
        <Route path="/register" element={<Register users={users} setUsers={setUsers} />} />
        <Route path="/dashboard" element={<Dashboard reservations={reservations} setReservations={setReservations} />} />
      </Routes>
    </Router>
  );
}

export default App;
