"use client";
import { useEffect, useState } from "react";

export default function PeoplePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    city: "",
    country: "",
  });
  const [q, setQ] = useState("");

  async function fetchList() {
    setLoading(true);
    try {
      const res = await fetch(`/api/people?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const method = editing ? "PATCH" : "POST";
    const url = editing ? `/api/people/${editing._id}` : "/api/people";
    const payload = { ...form, age: Number(form.age) };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setForm({ name: "", age: "", email: "", phone: "", city: "", country: "" });
      setEditing(null);
      fetchList();
    } else {
      const err = await res.json();
      alert(err?.error || "Request failed");
    }
  }

  async function onDelete(id) {
    if (!id) return;
    if (!confirm("Delete this record?")) return;
    const res = await fetch(`/api/people/${id}`, { method: "DELETE" });
    if (res.ok) fetchList();
  }

  function onEdit(p) {
    setEditing(p);
    setForm({ ...p, age: String(p.age) });
  }

  return (
    <div style={{ maxWidth: 920, margin: "40px auto", padding: 16, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>People CRUD</h1>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 8,
          alignItems: "end",
          margin: "16px 0",
        }}
      >
        {["name", "age", "email", "phone", "city", "country"].map((key) => (
          <div key={key} style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>{key.toUpperCase()}</label>
            <input
              name={key}
              value={form[key]}
              onChange={onChange}
              type={key === "age" ? "number" : "text"}
              required
              style={{ padding: 8, border: "1px solid #ddd", borderRadius: 8 }}
            />
          </div>
        ))}
        <button
          type="submit"
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: 0,
            background: "black",
            color: "white",
            fontWeight: 600,
          }}
        >
          {editing ? "Update" : "Create"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({ name: "", age: "", email: "", phone: "", city: "", country: "" });
            }}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: 0,
              background: "#eee",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Search bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name/email/phone/city/country"
          style={{ flex: 1, padding: 8, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <button
          onClick={fetchList}
          style={{ padding: "8px 12px", borderRadius: 10, border: 0, background: "#222", color: "white" }}
        >
          Search
        </button>
        <button
          onClick={() => {
            setQ("");
            fetchList();
          }}
          style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #ddd", background: "white" }}
        >
          Reset
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["name", "age", "email", "phone", "city", "country", "actions"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #eee",
                      padding: 8,
                      fontSize: 12,
                      opacity: 0.7,
                    }}
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p._id}>
                  <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>{p.name}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>{p.age}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>{p.email}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>{p.phone}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>{p.city}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>{p.country}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3", display: "flex", gap: 6 }}>
                    <button
                      onClick={() => onEdit(p)}
                      style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", background: "white" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(p._id)}
                      style={{ padding: "6px 10px", borderRadius: 8, border: 0, background: "#e11", color: "white" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p style={{ opacity: 0.6, marginTop: 12 }}>No records.</p>}
        </div>
      )}
    </div>
  );
}
