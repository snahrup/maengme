from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

app = FastAPI(title="MaengMe API", version="0.1.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class TimerSession(BaseModel):
    id: Optional[str] = None
    start_time: datetime
    duration_ms: int
    laps: List[int] = []
    prime_hits: List[int] = []
    created_at: Optional[datetime] = None

class Product(BaseModel):
    id: str
    name: str
    strain: str
    vendor: str
    image_url: str

# Routes
@app.get("/")
def read_root():
    return {"message": "MaengMe API", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/sessions")
def create_session(session: TimerSession):
    # Stub for session creation
    return {"message": "Session created", "session_id": "stub-id"}

@app.get("/products")
def get_products():
    # Stub for products endpoint
    return {"products": [], "count": 0}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
