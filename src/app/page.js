"use client";
import { useState, useEffect } from "react";

export default function PeoplePage() {
  const [people, setPeople] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    city: "",
    country: "",
  });

  // Fetch people from API & update localStorage
  const fetchPeople = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/people");
      const data = await res.json();
      const items = data.items || [];
      setPeople(items);
      localStorage.setItem("peopleCache", JSON.stringify(items));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Load from localStorage first for fast display
  useEffect(() => {
    const cached = localStorage.getItem("peopleCache");
    if (cached) setPeople(JSON.parse(cached));
    fetchPeople(); // fetch fresh data
  }, []);

  // Add or Update person
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await fetch(`/api/people/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
          headers: { "Content-Type": "application/json" },
        });
      } else {
        await fetch("/api/people", {
          method: "POST",
          body: JSON.stringify(form),
          headers: { "Content-Type": "application/json" },
        });
      }
      setForm({ name: "", age: "", email: "", phone: "", city: "", country: "" });
      setEditingId(null);
      setShowForm(false);
      await fetchPeople();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Edit person
  const editPerson = (person) => {
    setForm({
      name: person.name,
      age: person.age,
      email: person.email,
      phone: person.phone,
      city: person.city,
      country: person.country,
    });
    setEditingId(person._id);
    setShowForm(true);
  };

  // Delete person
  const deletePerson = async (id) => {
    setLoading(true);
    try {
      await fetch(`/api/people/${id}`, { method: "DELETE" });
      await fetchPeople();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // ---------- Inline Styles ----------
  const containerStyle = {
    maxWidth: "950px",
    margin: "20px auto",
    padding: "10px",
    fontFamily: "Arial, sans-serif",
    position: "relative",
  };

  const spinnerStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    border: "6px solid #f3f3f3",
    borderTop: "6px solid #000",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
    zIndex: 9999,
  };

  const formWrapper = {
    marginBottom: "30px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#f9f9f9",
  };

  const inputStyle = {
    width: "48%",
    padding: "10px",
    margin: "6px 1%",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const buttonBase = {
    margin: "5px 2px",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.2s",
    border: "1px solid #000",
  };

  const buttonBlack = { ...buttonBase, background: "#000", color: "#fff" };
  const buttonWhite = { ...buttonBase, background: "#fff", color: "#000" };

  const tableWrapperStyle = { overflowX: "auto" };
  const tableStyle = { width: "100%", borderCollapse: "collapse" };
  const thtdStyle = { border: "1px solid #ccc", padding: "10px", textAlign: "left" };
  const thStyle = { ...thtdStyle, background: "#000", color: "#fff" };

  // Responsive CSS
  const responsiveStyle = `
    @media (max-width: 700px) {
      table, thead, tbody, th, td, tr { display: block; width: 100%; }
      thead { display: none; }
      tr { margin-bottom: 15px; border: 1px solid #ddd; border-radius: 8px; padding: 10px; }
      td { border: none; text-align: left; padding: 6px 0; }
      td:before { font-weight: bold; display: block; margin-bottom: 3px; color: #000; }
      td:nth-of-type(1):before { content: "S.No"; }
      td:nth-of-type(2):before { content: "Name"; }
      td:nth-of-type(3):before { content: "Age"; }
      td:nth-of-type(4):before { content: "Email"; }
      td:nth-of-type(5):before { content: "Phone"; }
      td:nth-of-type(6):before { content: "City"; }
      td:nth-of-type(7):before { content: "Country"; }
      td:nth-of-type(8):before { content: "Actions"; }
      input { width: 96% !important; margin: 6px 2% !important; }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{responsiveStyle}</style>

      {loading && <div style={spinnerStyle}></div>}

      <h2 style={{ textAlign: "center", color: "#000" }}>👤 People Manager</h2>

      {/* Toggle Form Button */}
      {!showForm && (
        <button style={buttonBlack} onClick={() => setShowForm(true)}>
          ➕ Add User
        </button>
      )}

      {/* Form */}
      {showForm && (
        <form style={formWrapper} onSubmit={handleSubmit}>
          <input
            style={inputStyle}
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            style={inputStyle}
            placeholder="Age"
            type="number"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />
          <input
            style={inputStyle}
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            style={inputStyle}
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            style={inputStyle}
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <input
            style={inputStyle}
            placeholder="Country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
          <div>
            <button type="submit" style={buttonBlack}>
              {editingId ? "✏️ Update User" : " Add User"}
            </button>
            <button
              type="button"
              style={buttonWhite}
              onClick={() => {
                setForm({ name: "", age: "", email: "", phone: "", city: "", country: "" });
                setEditingId(null);
                setShowForm(false);
              }}
            >
               Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div style={tableWrapperStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>S.No</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Age</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>City</th>
              <th style={thStyle}>Country</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {people.length > 0 ? (
              people.map((p, i) => (
                <tr key={p._id}>
                  <td style={thtdStyle}>{i + 1}</td>
                  <td style={thtdStyle}>{p.name}</td>
                  <td style={thtdStyle}>{p.age}</td>
                  <td style={thtdStyle}>{p.email}</td>
                  <td style={thtdStyle}>{p.phone}</td>
                  <td style={thtdStyle}>{p.city}</td>
                  <td style={thtdStyle}>{p.country}</td>
                  <td style={thtdStyle}>
                    <button style={buttonBlack} onClick={() => editPerson(p)}>
                      Edit
                    </button>
                    <button style={buttonWhite} onClick={() => deletePerson(p._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={thtdStyle} colSpan="8" align="center">
                  No people found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
