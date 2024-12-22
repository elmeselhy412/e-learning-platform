'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation'; // Import useRouter

type Module = {
  _id: string;
  title: string;
};

type QuestionDto = {
  question: string;
  difficulty: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
  correctAnswer: string;
};

const CreateQuizPage = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState<string[]>([]);
  const [newCorrectOption, setNewCorrectOption] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const router = useRouter();
  
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get("http://localhost:4000/modules");
        setModules(response.data);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };
    fetchModules();
  }, []);

  const handleAddQuestion = () => {
    const optionsArray = newOptions.map((opt) => ({
      text: opt,
      isCorrect: opt === newCorrectOption,
    }));

    setQuestions([
      ...questions,
      {
        question: newQuestion,
        difficulty,
        options: optionsArray,
        correctAnswer: newCorrectOption, // Add correctAnswer
      },
    ]);

    setNewQuestion("");
    setNewOptions([]);
    setNewCorrectOption("");
  };

  const handleSubmit = async () => {
    try {
      if (!selectedModuleId) {
        alert("Please select a module");
        return;
      }
      await axios.post(`http://localhost:4000/quizzes/create`, {
        moduleId: selectedModuleId,
        questions,
      });
      alert("Quiz created successfully!");
      router.push('/instructor/home'); // Redirect to home page

    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white text-center">
          <h2>Create a Quiz</h2>
        </div>
        <div className="card-body">
          <div className="mb-4">
            <label htmlFor="moduleId" className="form-label">Select Module</label>
            <select
              id="moduleId"
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              className="form-select"
            >
              <option value="">-- Select a Module --</option>
              {modules.map((module) => (
                <option key={module._id} value={module._id}>
                  {module.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <h5>Add a Question</h5>
            <div className="mb-3">
              <label htmlFor="newQuestion" className="form-label">Question Text</label>
              <input
                id="newQuestion"
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter the question"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newOptions" className="form-label">Options (one per line)</label>
              <textarea
                id="newOptions"
                value={newOptions.join("\n")}
                onChange={(e) => setNewOptions(e.target.value.split("\n"))}
                placeholder="Enter options, one per line"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newCorrectOption" className="form-label">Correct Option</label>
              <input
                id="newCorrectOption"
                type="text"
                value={newCorrectOption}
                onChange={(e) => setNewCorrectOption(e.target.value)}
                placeholder="Enter the correct option"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="difficulty" className="form-label">Difficulty</label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="form-select"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <button className="btn btn-secondary" onClick={handleAddQuestion}>
              Add Question
            </button>
          </div>

          <button className="btn btn-primary" onClick={handleSubmit}>
            Create Quiz
          </button>
        </div>
        <div className="card-footer text-muted text-center">
          Total Questions: {questions.length}
        </div>
      </div>
    </div>
  );
};

export default CreateQuizPage;
