import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

export const fetchCourses = () => api.get("/courses").then(r => r.data);
export const fetchCourse = (id, language = "English") =>
  api.get(`/courses/${id}`, { params: { language } }).then(r => r.data);
export const fetchJobs = () => api.get("/jobs").then(r => r.data);
export const fetchJob = (id) => api.get(`/jobs/${id}`).then(r => r.data);
export const fetchSessions = () => api.get("/sessions").then(r => r.data);
export const fetchMentors = () => api.get("/mentors").then(r => r.data);
export const askDoubt = (question, language = "English", context) =>
  api.post("/doubts/ask", { question, language, context }).then(r => r.data);
export const generateAssignment = (course_id, lesson_id, lesson_title, bloom_level) =>
  api.post("/assignment/generate", { course_id, lesson_id, lesson_title, bloom_level }).then(r => r.data);
export const evaluateAssignment = (payload) =>
  api.post("/assignment/evaluate", payload).then(r => r.data);
export const saveNote = (payload) => api.post("/notes", payload).then(r => r.data);
export const fetchNotes = (course_id) =>
  api.get("/notes", { params: course_id ? { course_id } : {} }).then(r => r.data);
export const deleteNote = (id) => api.delete(`/notes/${id}`).then(r => r.data);
export const fetchStats = () => api.get("/dashboard/stats").then(r => r.data);