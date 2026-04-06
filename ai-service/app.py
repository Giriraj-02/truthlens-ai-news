from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class NewsInput(BaseModel):
    content: str

@app.get("/")
def home():
    return {"message": "AI Service Running 🚀"}

# ✅ Fake detection
@app.post("/detect")
def detect_fake(news: NewsInput):
    text = news.content.lower()

    if "fake" in text or "rumor" in text or "scam" in text:
        return {"label": "FAKE", "score": 0.3}
    else:
        return {"label": "REAL", "score": 0.8}

# ✅ FULL SUMMARY (NO TRUNCATION)
@app.post("/summarize")
def summarize(news: NewsInput):
    content = news.content

    if not content:
        return {"summary": "No summary available"}

    return {"summary": content}  # FULL TEXT