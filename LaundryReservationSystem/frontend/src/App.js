import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
import "./App.css";
import laundryBackground from "./assets/laundry.jpg";
import Sidebar from "./Sidebar";

// Initial users
const initialUsers = [
  { username: "admin", password: "12345", role: "admin" },
];

// Login Component
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
    <div className="login-container" style={{ fontFamily: "Lato, sans-serif" }}>
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

// Register Component
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
    <div className="login-container" style={{ fontFamily: "Lato, sans-serif" }}>
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

// Dashboard Component with collapsible sidebar
function Dashboard({ reservations, setReservations }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, role } = location.state || { username: "User", role: "customer" };

  const handleLogout = () => navigate("/");

  const [activeTab, setActiveTab] = useState(role === "admin" ? "Reservations" : "Reservation");
  const [newReservation, setNewReservation] = useState({ date: "", time: "", address: "", payment: "" });

  const handleStatusChange = (id, field, value) =>
    setReservations(reservations.map(r => r.id === id ? { ...r, [field]: value } : r));

  const deleteItem = (id) =>
    setReservations(reservations.filter(r => r.id !== id));

  const addReservation = () => {
    const { date, time, address, payment } = newReservation;
    if (!date || !time || !address || !payment)
      return alert("Fill all fields including payment method");

    const newId = reservations.length ? reservations[reservations.length - 1].id + 1 : 1;
    setReservations([...reservations, {
      ...newReservation,
      id: newId,
      username,
      status: "Pending",
      laundryStatus: "Pending",
      deliveryStatus: "Pending"
    }]);
    setNewReservation({ date: "", time: "", address: "", payment: "" });
    alert("Reservation submitted! Waiting for admin approval.");
  };

  // Format date and time
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "orange";
      case "Accepted": return "green";
      case "Finished": return "green";
      case "In Delivery": return "blue";
      case "Delivered": return "green";
      case "Declined": return "red";
      default: return "black";
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Lato, sans-serif" }}>
      <Sidebar
        role={role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <div style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "20px",
          borderRadius: "8px"
        }}>
          {activeTab !== "About Us" && (
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <h1>✨ Bright and Breezy Laundromat ✨</h1>
            </div>
          )}

          {activeTab === "About Us" ? (
            <AboutUs />
          ) : (
            <>
              <h2>Welcome {username}!</h2>

              {role === "admin" && activeTab === "Reservations" && (
                <AdminReservations reservations={reservations} handleStatusChange={handleStatusChange} deleteItem={deleteItem} getStatusColor={getStatusColor} formatDate={formatDate} formatTime={formatTime} />
              )}
              {role === "admin" && activeTab === "Laundry" && (
                <AdminLaundry reservations={reservations} handleStatusChange={handleStatusChange} deleteItem={deleteItem} getStatusColor={getStatusColor} formatDate={formatDate} formatTime={formatTime} />
              )}
              {role === "admin" && activeTab === "Delivery" && (
                <AdminDelivery reservations={reservations} handleStatusChange={handleStatusChange} deleteItem={deleteItem} getStatusColor={getStatusColor} formatDate={formatDate} formatTime={formatTime} />
              )}

              {role === "customer" && activeTab === "Reservation" && (
                <CustomerDashboard
                  username={username}
                  newReservation={newReservation}
                  setNewReservation={setNewReservation}
                  addReservation={addReservation}
                  reservations={reservations}
                  getStatusColor={getStatusColor}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// About Us Component
function AboutUs() {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>About Us</h2>
      <p style={{ fontSize: "36px", fontWeight: "bold", margin: "10px 0" }}>
        ✨ Bright and Breezy Laundromat ✨
      </p>
      <p style={{ fontSize: "18px", margin: "5px 0" }}>
        Owner: <strong>Bambi Guerra</strong>
      </p>
      <p style={{ fontSize: "18px", margin: "5px 0" }}>
        Address: Angeles Place, Angeles Street, Sto. Rosario Kanluran, Pateros
      </p>
      <p style={{ fontSize: "16px", marginTop: "15px", lineHeight: "1.5" }}>
        <em>
          Our goal is to provide fast, reliable, and high-quality laundry services to make your clothes fresh and bright every time.  
          We’re dedicated to serving our community with care and cleanliness.
        </em>
      </p>
    </div>
  );
}

// Admin Components
function AdminReservations({ reservations, handleStatusChange, deleteItem, getStatusColor, formatDate, formatTime }) {
  return (
    <div>
      <h3>Customer Reservations</h3>
      {reservations.length === 0 && <p>No reservations yet.</p>}
      {reservations.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Username</th>
              <th>Address</th>
              <th>Payment</th>
              <th>Reservation Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r.id}>
                <td>{formatDate(r.date)}</td>
                <td>{formatTime(r.time)}</td>
                <td>{r.username}</td>
                <td>{r.address}</td>
                <td>{r.payment}</td>
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

function AdminLaundry({ reservations, handleStatusChange, deleteItem, getStatusColor, formatDate, formatTime }) {
  const accepted = reservations.filter(r => r.status === "Accepted");
  return (
    <div>
      <h3>Laundry Status</h3>
      {accepted.length === 0 && <p>No accepted reservations yet.</p>}
      {accepted.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Username</th>
              <th>Address</th>
              <th>Payment</th>
              <th>Laundry Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accepted.map(r => (
              <tr key={r.id}>
                <td>{formatDate(r.date)}</td>
                <td>{formatTime(r.time)}</td>
                <td>{r.username}</td>
                <td>{r.address}</td>
                <td>{r.payment}</td>
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

function AdminDelivery({ reservations, handleStatusChange, deleteItem, getStatusColor, formatDate, formatTime }) {
  const finished = reservations.filter(r => r.status === "Accepted" || r.laundryStatus === "Finished");

  return (
    <div>
      <h3>Delivery Status</h3>
      {finished.length === 0 && <p>No accepted or finished laundry yet.</p>}
      {finished.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Username</th>
              <th>Address</th>
              <th>Payment</th>
              <th>Delivery Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {finished.map(r => (
              <tr key={r.id}>
                <td>{formatDate(r.date)}</td>
                <td>{formatTime(r.time)}</td>
                <td>{r.username}</td>
                <td>{r.address}</td>
                <td>{r.payment}</td>
                <td style={{ color: getStatusColor(r.deliveryStatus), fontWeight: "bold" }}>{r.deliveryStatus}</td>
                <td>
                  <select value={r.deliveryStatus} onChange={(e) => handleStatusChange(r.id, "deliveryStatus", e.target.value)}>
                    <option value="Pending">Pending</option>
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

// Customer Dashboard
function CustomerDashboard({ username, newReservation, setNewReservation, addReservation, reservations, getStatusColor, formatDate, formatTime }) {
  const userReservations = reservations.filter(r => r.username === username);

  return (
    <div>
      <h3>Make a Reservation</h3>
      <div style={{ marginBottom: "20px" }}>
        <input type="date" value={newReservation.date} onChange={(e) => setNewReservation({ ...newReservation, date: e.target.value })} />
        <input type="time" value={newReservation.time} onChange={(e) => setNewReservation({ ...newReservation, time: e.target.value })} />
        <input type="text" placeholder="Address" value={newReservation.address} onChange={(e) => setNewReservation({ ...newReservation, address: e.target.value })} />
        <select value={newReservation.payment || ""} onChange={(e) => setNewReservation({ ...newReservation, payment: e.target.value })}>
          <option value="" disabled>Select Payment Mode</option>
          <option value="Cash">Cash on Delivery</option>
          <option value="Online)">Online Payment(Gcash, Maya etc.)</option>
          <option value="Credit Card">Credit Card</option>
        </select>
        <button onClick={addReservation}>Submit</button>
      </div>

      <h3>Your Reservations</h3>
      {userReservations.length === 0 && <p>No reservations yet.</p>}
      {userReservations.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Address</th>
              <th>Payment</th>
              <th>Reservation Status</th>
              <th>Laundry Status</th>
              <th>Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            {userReservations.map(r => (
              <tr key={r.id}>
                <td>{formatDate(r.date)}</td>
                <td>{formatTime(r.time)}</td>
                <td>{r.address}</td>
                <td>{r.payment}</td>
                <td style={{ color: getStatusColor(r.status), fontWeight: "bold" }}>{r.status}</td>
                <td style={{ color: getStatusColor(r.laundryStatus), fontWeight: "bold" }}>{r.laundryStatus}</td>
                <td style={{ color: getStatusColor(r.deliveryStatus), fontWeight: "bold" }}>{r.deliveryStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const deleteButtonStyle = { marginLeft: "10px", color: "white", backgroundColor: "red", border: "none", padding: "3px 8px", cursor: "pointer" };
const tableStyle = { width: "100%", borderCollapse: "collapse", textAlign: "center", backgroundColor: "white" };

// Main App
function App() {
  const [users, setUsers] = useState(initialUsers);
  const [reservations, setReservations] = useState([]);

  return (
    <Router>
      <div style={{
        backgroundImage: `url(${laundryBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        filter: "brightness(1)",
        fontFamily: "Lato, sans-serif"
      }}>
        <Routes>
          <Route path="/" element={<Login users={users} />} />
          <Route path="/register" element={<Register users={users} setUsers={setUsers} />} />
          <Route path="/dashboard" element={<Dashboard reservations={reservations} setReservations={setReservations} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
