from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import json
import re
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from google import genai
from google.genai import types
from seed_data import COURSES, JOBS, SESSIONS, MENTORS

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

GEMINI_MODEL = "gemini-2.5-flash"

app = FastAPI(title="Edu-AI Core")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class DoubtRequest(BaseModel):
    question: str
    language: str = "English"
    context: Optional[str] = None

class TranslateRequest(BaseModel):
    text: str
    target_language: str

class AssignmentRequest(BaseModel):
    course_id: str
    lesson_id: str
    lesson_title: str
    bloom_level: str = "Understand"

class AssignmentEvaluateRequest(BaseModel):
    course_id: str
    lesson_id: str
    bloom_level: str
    questions: List[Dict[str, Any]]
    answers: List[str]

class NoteCreate(BaseModel):
    course_id: Optional[str] = None
    lesson_id: Optional[str] = None
    title: str
    content: str
    pdf_data: Optional[str] = None

class Note(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    course_id: Optional[str] = None
    lesson_id: Optional[str] = None
    title: str
    content: str
    pdf_data: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ---------- Helpers ----------
async def gemini_chat(system_message: str, user_text: str, session_id: str = None) -> str:
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")
    client = genai.Client(api_key=api_key)
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_text,
            config=types.GenerateContentConfig(system_instruction=system_message)
        )
        return response.text
    except Exception as e:
        logging.exception("Gemini error")
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")
# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Edu-AI Core API", "version": "1.0"}


@api_router.get("/courses")
async def list_courses():
    courses = [{k: v for k, v in c.items() if k != "lessons"} for c in COURSES]
    result = [{**c, "lessons_count": len(next(x for x in COURSES if x["id"] == c["id"])["lessons"])} for c in courses]
    return {"courses": result}


@api_router.get("/courses/{course_id}")
async def get_course(course_id: str, language: Optional[str] = "English"):
    course = next((c for c in COURSES if c["id"] == course_id), None)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    result = {**course}
    if language and language.lower() != "english":
        try:
            translated_desc = await gemini_chat(
                f"You are a professional translator. Translate to {language}. Return only the translation, no explanation.",
                course["description"],
                session_id=f"trans-{course_id}",
            )
            result["description_translated"] = translated_desc.strip()
            result["language"] = language
        except Exception as e:
            logging.warning(f"Translation failed: {e}")
    return result


@api_router.get("/jobs")
async def list_jobs():
    return {"jobs": JOBS}


@api_router.get("/jobs/{job_id}")
async def get_job(job_id: str):
    job = next((j for j in JOBS if j["id"] == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@api_router.get("/sessions")
async def list_sessions():
    return {"sessions": SESSIONS}


@api_router.get("/sessions/{session_id}")
async def get_session(session_id: str):
    s = next((x for x in SESSIONS if x["id"] == session_id), None)
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    return s


@api_router.get("/mentors")
async def list_mentors():
    return {"mentors": MENTORS}


@api_router.post("/doubts/ask")
async def ask_doubt(req: DoubtRequest):
    system = (
        "You are Edu-AI, a patient and clear teaching assistant for students learning programming, "
        "data science, and computer science. Answer in a structured, encouraging manner. "
        "Use short paragraphs and code blocks where helpful. "
        f"IMPORTANT: Respond entirely in {req.language}."
    )
    user_text = req.question
    if req.context:
        user_text = f"Context: {req.context}\n\nQuestion: {req.question}"
    answer = await gemini_chat(system, user_text)
    await db.doubts.insert_one({
        "id": str(uuid.uuid4()),
        "question": req.question,
        "language": req.language,
        "answer": answer,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"answer": answer, "language": req.language}


@api_router.post("/translate")
async def translate(req: TranslateRequest):
    system = f"You are a professional translator. Translate the user text to {req.target_language}. Return ONLY the translation. Preserve formatting."
    translated = await gemini_chat(system, req.text)
    return {"translated": translated.strip(), "target_language": req.target_language}


@api_router.post("/assignment/generate")
async def generate_assignment(req: AssignmentRequest):
    bloom_descriptions = {
        "Remember": "Recall facts and basic concepts. Multiple choice with definitions.",
        "Understand": "Explain ideas or concepts. Conceptual MCQs with reasoning.",
        "Apply": "Use information in new situations. Code-prediction or scenario-based questions.",
        "Analyze": "Draw connections among ideas. Compare-and-contrast or debug-the-code questions.",
        "Evaluate": "Justify a stand or decision. Pick-the-best-approach with rationale.",
        "Create": "Produce new or original work. Open-ended design questions.",
    }
    level_desc = bloom_descriptions.get(req.bloom_level, bloom_descriptions["Understand"])
    system = (
        "You are an adaptive learning AI that creates assignments using Bloom's Taxonomy. "
        "Output STRICTLY valid JSON with this schema: "
        '{"questions": [{"id": 1, "question": "...", "options": ["A...","B...","C...","D..."], "correct_index": 0, "explanation": "..."}]} '
        "Generate exactly 4 questions. No markdown, no commentary, JSON only."
    )
    user_prompt = (
        f"Lesson: {req.lesson_title}\n"
        f"Bloom level: {req.bloom_level} — {level_desc}\n"
        f"Generate 4 multiple-choice questions targeting this level."
    )
    raw = await gemini_chat(system, user_prompt, session_id=f"asg-{req.course_id}-{req.lesson_id}")
    cleaned = raw.strip()
    cleaned = re.sub(r"^```json\s*|\s*```$", "", cleaned, flags=re.MULTILINE).strip()
    cleaned = re.sub(r"^```\s*|\s*```$", "", cleaned, flags=re.MULTILINE).strip()
    try:
        parsed = json.loads(cleaned)
    except Exception:
        m = re.search(r"\{[\s\S]*\}", cleaned)
        if m:
            parsed = json.loads(m.group(0))
        else:
            raise HTTPException(status_code=502, detail="Could not parse AI response")
    return {"bloom_level": req.bloom_level, **parsed}


@api_router.post("/assignment/evaluate")
async def evaluate_assignment(req: AssignmentEvaluateRequest):
    correct = 0
    feedback = []
    for q, ans in zip(req.questions, req.answers):
        is_correct = str(ans).strip() == str(q.get("correct_index", -1)).strip()
        if is_correct:
            correct += 1
        feedback.append({
            "question": q.get("question"),
            "your_answer": ans,
            "correct_answer": q.get("correct_index"),
            "is_correct": is_correct,
            "explanation": q.get("explanation", ""),
        })
    total = len(req.questions) or 1
    score_pct = round(correct / total * 100)

    bloom_order = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"]
    current_idx = bloom_order.index(req.bloom_level) if req.bloom_level in bloom_order else 1
    if score_pct >= 75:
        next_idx = min(current_idx + 1, len(bloom_order) - 1)
        verdict = "promoted"
    elif score_pct >= 40:
        next_idx = current_idx
        verdict = "stay"
    else:
        next_idx = max(current_idx - 1, 0)
        verdict = "demoted"
    next_level = bloom_order[next_idx]

    await db.assignment_attempts.insert_one({
        "id": str(uuid.uuid4()),
        "course_id": req.course_id,
        "lesson_id": req.lesson_id,
        "bloom_level": req.bloom_level,
        "score": score_pct,
        "next_level": next_level,
        "verdict": verdict,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {
        "score": score_pct,
        "correct": correct,
        "total": total,
        "feedback": feedback,
        "next_level": next_level,
        "verdict": verdict,
    }


@api_router.post("/notes")
async def create_note(req: NoteCreate):
    note = Note(**req.model_dump())
    doc = note.model_dump()
    await db.notes.insert_one(doc)
    return note


@api_router.get("/notes")
async def list_notes(course_id: Optional[str] = None):
    q = {}
    if course_id:
        q["course_id"] = course_id
    notes = await db.notes.find(q, {"_id": 0}).sort("created_at", -1).to_list(200)
    return {"notes": notes}


@api_router.get("/notes/{note_id}")
async def get_note(note_id: str):
    note = await db.notes.find_one({"id": note_id}, {"_id": 0})
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@api_router.delete("/notes/{note_id}")
async def delete_note(note_id: str):
    res = await db.notes.delete_one({"id": note_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"deleted": True}


@api_router.get("/dashboard/stats")
async def dashboard_stats():
    notes_count = await db.notes.count_documents({})
    doubts_count = await db.doubts.count_documents({})
    attempts_count = await db.assignment_attempts.count_documents({})
    return {
        "notes_count": notes_count,
        "doubts_count": doubts_count,
        "assignments_attempted": attempts_count,
        "courses_count": len(COURSES),
        "jobs_count": len(JOBS),
        "sessions_count": len(SESSIONS),
        "mentors_count": len(MENTORS),
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()