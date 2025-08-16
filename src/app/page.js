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
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Text App</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={name}
          placeholder="Enter here"
          onChange={(e) => setName(e.target.value)}
          className="border px-3 py-2 rounded-md flex-1"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add
        </button>
      </form>

      {/* Error */}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center py-6">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Data List */}
          <h2 className="text-xl font-semibold mb-2">Saved Data:</h2>
          <ul className="list-disc pl-5">
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
