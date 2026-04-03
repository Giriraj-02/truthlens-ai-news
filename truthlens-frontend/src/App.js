import React, { useEffect, useState } from "react";

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("home");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [savedNews, setSavedNews] = useState([]); // ⭐ NEW

  // 🔥 Load saved news from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedNews")) || [];
    setSavedNews(stored);
  }, []);

  // 🔥 Fetch news
  useEffect(() => {
    if (category === "saved") return;

    setLoading(true);

    let url = "http://localhost:8080/api/news/external";

    if (category === "war") url = "http://localhost:8080/api/news/war";
    else if (category === "sports") url = "http://localhost:8080/api/news/sports";
    else if (category === "politics") url = "http://localhost:8080/api/news/politics";

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

  }, [category]);

  // 🔥 Save / Unsave
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

  // 🔥 Heading
  const getHeading = () => {
    if (category === "home") return "📰 Latest News";
    if (category === "war") return "⚔️ War News";
    if (category === "sports") return "🏏 Sports News";
    if (category === "politics") return "🌍 Global & India News";
    if (category === "saved") return "⭐ Saved News";
    return "📰 News";
  };

  // 🔥 Time Ago
  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = (now - past) / 1000;

    if (diff < 60) return `${Math.floor(diff)} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  // 🔍 Data source
  const displayNews = category === "saved" ? savedNews : news;

  // 🔍 Filter
  const filteredNews = displayNews.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      display: "flex",
      background: darkMode ? "#121212" : "#fff",
      color: darkMode ? "white" : "black"
    }}>

      {/* 🔥 Sidebar */}
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

      {/* 🔥 Main */}
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
                  🏢 {item.source} <br />
                  📅 {item.date ? timeAgo(item.date) : "No date"}
                </p>

                <p><b>AI-Summary:</b> {item.summary}</p>

                <p>Credibility: {(item.score * 100).toFixed(1)}%</p>

                <div style={styles.progressBar}>
                  <div style={{
                    ...styles.progressFill,
                    width: `${item.score * 100}%`,
                    background: item.score > 0.6 ? "#2ecc71" : "#f39c12"
                  }}></div>
                </div>

                <p style={{
                  color: item.fake ? "red" : "green",
                  fontWeight: "bold"
                }}>
                  {item.fake ? "Fake ❌" : "Real ✅"}
                </p>

                {/* ⭐ SAVE BUTTON */}
                <button
                  onClick={() => toggleSave(item)}
                  style={styles.saveBtn}
                >
                  {isSaved ? "⭐ Saved" : "☆ Save"}
                </button>

                {/* 🔗 READ MORE */}
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={styles.button}>
                    Read Full Article →
                  </a>
                )}

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
        background: active ? "#444" : "transparent"
      }}
    >
      {text}
    </p>
  );
}

// 🎨 Styles
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
    padding: "10px",
    width: "60%",
    borderRadius: "8px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "white",
    padding: "15px",
    borderRadius: "10px"
  },

  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px"
  },

  meta: {
    fontSize: "12px",
    color: "#888"
  },

  progressBar: {
    background: "#eee",
    height: "8px",
    borderRadius: "10px"
  },

  progressFill: {
    height: "100%"
  },

  button: {
    display: "block",
    marginTop: "10px",
    color: "blue"
  },

  saveBtn: {
    marginTop: "10px",
    padding: "6px",
    cursor: "pointer"
  },

  toggle: {
    marginTop: "20px",
    padding: "8px"
  }
};

export default App;