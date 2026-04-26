import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Jobs from "./pages/Jobs";
import Sessions from "./pages/Sessions";
import Mentors from "./pages/Mentors";
import DoubtSolver from "./pages/DoubtSolver";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="App">
      <Toaster position="top-right" richColors closeButton />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/doubt-solver" element={<DoubtSolver />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}