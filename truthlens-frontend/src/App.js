import React, { useEffect, useState } from "react";

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("home");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [savedNews, setSavedNews] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedNews")) || [];
    setSavedNews(stored);
  }, []);

  useEffect(() => {
    if (category === "saved") return;

    setLoading(true);

    let url = "https://truthlens-ai-news-2.onrender.com/api/news/external";

    if (category === "war") url = "https://truthlens-ai-news-2.onrender.com/api/news/war";
    else if (category === "sports") url = "https://truthlens-ai-news-2.onrender.com/api/news/sports";
    else if (category === "politics") url = "https://truthlens-ai-news-2.onrender.com/api/news/politics";

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

  }, [category]);

  const toggleSave = (item) => {
    let updated;
    const exists = savedNews.find(n => n.title === item.title);

    if (exists) {
      updated = savedNews.filter(n => n.title !== item.title);
    } else {
      updated = [...savedNews, item];
    }

    setSavedNews(updated);
    localStorage.setItem("savedNews", JSON.stringify(updated));
  };

  const getHeading = () => {
    if (category === "home") return "📰 Latest News";
    if (category === "war") return "⚔️ War News";
    if (category === "sports") return "🏏 Sports News";
    if (category === "politics") return "🌍 Global & India News";
    if (category === "saved") return "⭐ Saved News";
    return "📰 News";
  };

  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = (now - past) / 1000;

    if (diff < 60) return `${Math.floor(diff)} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const displayNews = category === "saved" ? savedNews : news;

  const filteredNews = displayNews.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      background: darkMode ? "#121212" : "#f5f6fa",
      color: darkMode ? "white" : "black"
    }}>

      {/* Sidebar */}
      <div style={{
        ...styles.sidebar,
        background: darkMode ? "#1f1f1f" : "#1e1e2f"
      }}>
        <h2>📰 TruthLens</h2>

        <MenuItem text="Home" active={category==="home"} onClick={() => setCategory("home")} />
        <MenuItem text="War" active={category==="war"} onClick={() => setCategory("war")} />
        <MenuItem text="Sports" active={category==="sports"} onClick={() => setCategory("sports")} />
        <MenuItem text="Global & India News" active={category==="politics"} onClick={() => setCategory("politics")} />
        <MenuItem text="Saved News" active={category==="saved"} onClick={() => setCategory("saved")} />

        <button onClick={() => setDarkMode(!darkMode)} style={styles.toggle}>
          {darkMode ? "☀ Light" : "🌙 Dark"} 
        </button>
      </div>

      {/* Main */}
      <div style={styles.main}>

        <h1>{getHeading()}</h1>

        <input
          type="text"
          placeholder="🔍 Search news..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        {loading && category !== "saved" && <p>Loading...</p>}

        <div style={styles.grid}>
          {filteredNews.map((item, index) => {
            const isSaved = savedNews.find(n => n.title === item.title);

            return (
              <div key={index} style={styles.card}>

                {item.image && <img src={item.image} alt="news" style={styles.image} />}

                <h3>{item.title}</h3>

                <p style={styles.meta}>
                  🏢 {item.source} • 📅 {item.date ? timeAgo(item.date) : "No date"}
                </p>

                {/* FULL AI SUMMARY */}
                <p style={styles.summary}>
                  <b>AI Summary:</b> {item.summary}
                </p>

                {/* ACTION BUTTONS */}
                <div style={styles.actions}>
                  <button onClick={() => toggleSave(item)} style={styles.saveBtn}>
                    {isSaved ? "⭐ Saved" : "☆ Save"}
                  </button>

                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" style={styles.readBtn}>
                      Read →
                    </a>
                  )}
                </div>

                {/* REAL / FAKE AT BOTTOM */}
                <p style={{
                  marginTop: "10px",
                  color: item.fake ? "#e74c3c" : "#2ecc71",
                  fontWeight: "bold"
                }}>
                  {item.fake ? "Fake ❌" : "Real ✅"}
                </p>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

function MenuItem({ text, onClick, active }) {
  return (
    <p
      onClick={onClick}
      style={{
        padding: "10px",
        cursor: "pointer",
        borderRadius: "6px",
        background: active ? "#444" : "transparent"
      }}
    >
      {text}
    </p>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    color: "white",
    minHeight: "100vh",
    padding: "20px"
  },

  main: {
    flex: 1,
    padding: "20px"
  },

  search: {
    marginBottom: "20px",
    padding: "12px",
    width: "100%",
    maxWidth: "500px",
    borderRadius: "10px",
    border: "1px solid #ccc"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "white",
    padding: "15px",
    borderRadius: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },

  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px"
  },

  meta: {
    fontSize: "12px",
    color: "#777",
    marginBottom: "10px"
  },

  summary: {
    fontSize: "14px",
    lineHeight: "1.5",
    marginBottom: "10px"
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  saveBtn: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer"
  },

  readBtn: {
    textDecoration: "none",
    color: "#3498db",
    fontWeight: "bold"
  },

  toggle: {
    marginTop: "20px",
    padding: "8px",
    cursor: "pointer"
  }
};

export default App;