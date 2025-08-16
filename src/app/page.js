"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [names, setNames] = useState([]);
  const [error, setError] = useState("");

  // Fetch all names
  const fetchNames = async () => {
    try {
      const res = await fetch("/api/names");
      const data = await res.json();
      if (Array.isArray(data)) {
        setNames(data);
      } else {
        setNames([]);
        setError("Unexpected API response");
      }
    } catch (err) {
      setError("Failed to fetch names");
    }
  };

  // On mount → load names
  useEffect(() => {
    fetchNames();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    try {
      const res = await fetch("/api/names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Failed to add name");
        return;
      }

      setName(""); // reset input
      setError("");
      fetchNames(); // refresh list
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Text App</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={name}
          placeholder="Enter here"
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "8px 12px" }}>
          Add 
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Saved Data:</h2>
      <ul>
        {Array.isArray(names) && names.length > 0 ? (
          names.map((n) => <li key={n._id}>{n.name}</li>)
        ) : (
          <li>No Data Found</li>
        )}
      </ul>
    </div>
  );
}
