"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [names, setNames] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state

  // Fetch all names
  const fetchNames = async () => {
    try {
      setLoading(true); // start loading
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
    } finally {
      setLoading(false); // stop loading
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
      setLoading(true); // start loading
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
    } finally {
      setLoading(false); // stop loading
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

      {loading ? (
        // ✅ Spinner animation
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #3498db",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              animation: "spin 1s linear infinite",
            }}
          />
          <span>Loading...</span>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      ) : (
        <>
          <h2>Saved Data:</h2>
          <ul>
            {Array.isArray(names) && names.length > 0 ? (
              names.map((n) => <li key={n._id}>{n.name}</li>)
            ) : (
              <li>No Data Found</li>
            )}
          </ul>
        </>
      )}
    </div>
  );
}
