from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI(title="AX Project Planner API")

# CORS 설정 (프론트엔드 연동용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "mock_data.json")

def load_data():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/")
async def root():
    return {"message": "AX Project Planner API is running"}

@app.get("/api/dashboard")
async def get_dashboard():
    data = load_data()
    return data

@app.get("/api/teams")
async def get_teams():
    data = load_data()
    return data["teams"]

@app.get("/api/categories")
async def get_categories():
    data = load_data()
    return data["categories"]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
