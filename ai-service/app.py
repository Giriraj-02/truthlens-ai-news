from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
import os

app = FastAPI()

# 🔥 Load models (startup pe ek baar load honge)
fake_news_model = pipeline("text-classification", model="distilbert-base-uncased")
summarizer = pipeline("text-generation", model="google/flan-t5-small")

class NewsInput(BaseModel):
    content: str

@app.get("/")
def home():
    return {"message": "AI Service Running 🚀"}

@app.post("/detect")
def detect_fake(news: NewsInput):
    result = fake_news_model(news.content)
    return {
        "label": result[0]['label'],
        "score": result[0]['score']
    }

@app.post("/summarize")
def summarize(news: NewsInput):
    prompt = f"summarize: {news.content}"
    result = summarizer(prompt, max_length=60)
    return {
        "summary": result[0]['generated_text']
    }