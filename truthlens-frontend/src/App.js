import React, { useEffect, useState } from "react";

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("home");
  const [search, setSearch] = useState("");
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

  const displayNews = category === "saved" ? savedNews : news;

  const filteredNews = displayNews.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>

      {/* 🔥 TOP NAVBAR (STICKY) */}
      <div style={styles.navbar}>
        <h2 style={{margin:0}}>📰 TruthLens</h2>

        <div style={styles.menu}>
          <NavItem text="Home" active={category==="home"} onClick={() => setCategory("home")} />
          <NavItem text="War" active={category==="war"} onClick={() => setCategory("war")} />
          <NavItem text="Sports" active={category==="sports"} onClick={() => setCategory("sports")} />
          <NavItem text="Global" active={category==="politics"} onClick={() => setCategory("politics")} />
          <NavItem text="Saved" active={category==="saved"} onClick={() => setCategory("saved")} />
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

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
                  🏢 {item.source} • 📅 {item.date}
                </p>

                {/* ✅ FULL SUMMARY */}
                <p style={styles.summary}>
                  <b>AI Summary:</b> {item.summary}
                </p>

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

      {/* 🔥 FOOTER */}
    <footer style={styles.footer}>
  <p>© 2026 TruthLens</p>
  <p>Built by Giriraj Singh Chouhan</p>
  <p>AI News Intelligence Platform</p>
</footer>
    </div>
  );
}

function NavItem({ text, icon, onClick, active }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 14px",
        marginRight: "8px",
        borderRadius: "20px",
        cursor: "pointer",
        background: active ? "#3498db" : "#f1f2f6",
        color: active ? "white" : "#333",
        fontSize: "14px",
        whiteSpace: "nowrap",
        transition: "0.2s"
      }}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    background: "#f5f6fa"
  },

  navbar: {
    position: "sticky",
    top: 0,
    background: "white",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    zIndex: 1000,
    flexWrap: "wrap"
  },

menu: {
  display: "flex",
  overflowX: "auto",
  whiteSpace: "nowrap",
  marginTop: "10px"
},

  main: {
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
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
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
    color: "#777"
  },

  summary: {
    fontSize: "14px",
    lineHeight: "1.6",
    marginTop: "10px"
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
  },

  saveBtn: {
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  readBtn: {
    textDecoration: "none",
    color: "#3498db",
    fontWeight: "bold"
  },

  footer: {
    marginTop: "30px",
    padding: "15px",
    textAlign: "center",
    background: "#1e1e2f",
    color: "white"
  }
};

export default App;