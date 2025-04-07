"use client"

import { useState } from "react";
import { Image, Mic, Video, Trash2, ImagePlus, Check, PlusCircle, MinusCircle, Save } from "lucide-react";
import { QuizTitle } from "./QuizTitle"; // Import QuizTitle
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

export default function QuizCreation() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "",
      options: [
        { id: "1", text: "", image: null, isCorrect: false },
        { id: "2", text: "", image: null, isCorrect: false },
        { id: "3", text: "", image: null, isCorrect: false },
        { id: "4", text: "", image: null, isCorrect: false },
      ],
      media: { image: null, audio: null, video: null },
    },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [multipleCorrect, setMultipleCorrect] = useState(false);
  const [title, setTitle] = useState(""); // State for quiz title
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for submission


  // const validateQuiz = () => {
  //   if (questions.length < 10) {
  //     toast.error("Minimum 10 questions required to submit");
  //     return false;
  //   }
  //   if (questions.length > 30) {
  //     toast.error("Maximum 30 questions allowed");
  //     return false;
  //   }
  //   return true;
  // };

  // Handle media upload for questions
  const handleQuestionMediaUpload = async (type, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      try {
        const response = await fetch("http://localhost:8080/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload file");
        }

        const result = await response.json();
        const fileUrl = result.url; // URL of the uploaded file

        const newQuestions = [...questions];
        newQuestions[currentQuestionIndex].media[type] = {
          url: fileUrl,
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + "MB", // Convert size to MB
        };
        setQuestions(newQuestions);

        // Show success toast
        toast.success(`${type} uploaded successfully!`);
      } catch (error) {
        console.error("Error uploading file:", error);
        // Show error toast
        toast.error("Failed to upload file. Please try again.");
      }
    }
  };

  // Handle option image upload
  const handleOptionImageUpload = async (questionIndex, optionId, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");

      try {
        const response = await fetch("http://localhost:8080/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload file");
        }

        const result = await response.json();
        const fileUrl = result.url; // URL of the uploaded file

        const newQuestions = [...questions];
        const optionIndex = newQuestions[questionIndex].options.findIndex((o) => o.id === optionId);
        newQuestions[questionIndex].options[optionIndex].image = {
          url: fileUrl,
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + "MB", // Convert size to MB
        };
        setQuestions(newQuestions);

        // Show success toast
        toast.success("Option image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading file:", error);
        // Show error toast
        toast.error("Failed to upload option image. Please try again.");
      }
    }
  };

  // Handle removing media from a question
  const handleRemoveQuestionMedia = (type) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].media[type] = null;
    setQuestions(newQuestions);

    // Show success toast
    toast.success(`${type} removed successfully!`);
  };

  // Handle removing option image
  const handleRemoveOptionImage = (questionIndex, optionId) => {
    const newQuestions = [...questions];
    const optionIndex = newQuestions[questionIndex].options.findIndex((o) => o.id === optionId);
    newQuestions[questionIndex].options[optionIndex].image = null;
    setQuestions(newQuestions);

    // Show success toast
    toast.success("Option image removed successfully!");
  };

  const handleCorrectAnswerToggle = (questionIndex, optionId) => {
    const newQuestions = [...questions];
    const options = newQuestions[questionIndex].options;
    const optionIndex = options.findIndex((o) => o.id === optionId);

    if (multipleCorrect) {
      options[optionIndex].isCorrect = !options[optionIndex].isCorrect;
    } else {
      options.forEach((option, index) => {
        option.isCorrect = index === optionIndex;
      });
    }

    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        question: "",
        options: [
          { id: "1", text: "", image: null, isCorrect: false },
          { id: "2", text: "", image: null, isCorrect: false },
          { id: "3", text: "", image: null, isCorrect: false },
          { id: "4", text: "", image: null, isCorrect: false },
        ],
        media: { image: null, audio: null, video: null },
      },
    ]);
    setCurrentQuestionIndex(questions.length);

    // Show success toast
    toast.success("Question added successfully!");
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
      setCurrentQuestionIndex(Math.min(currentQuestionIndex, newQuestions.length - 1));

      // Show success toast
      toast.success("Question removed successfully!");
    }
  };

  const saveAsDraft = () => {
    console.log("Saving as draft:", questions);
    // Show success toast
    toast.success("Quiz saved as draft!");
  };

  const handleSubmit = async () => {

    // if(!validateQuiz()) return;

    setIsSubmitting(true);

    try {
      // Retrieve user ID (Assuming it's stored in localStorage or a context)
      const userId = localStorage.getItem("userId"); // Update this based on how you store user info
      if (!userId) {
        throw new Error("User ID is missing. Please log in.");
      }

      const transformedQuestions = questions.map((question) => ({
        ...question,
        media: {
          image: question.media.image?.url || null,
          audio: question.media.audio?.url || null,
          video: question.media.video?.url || null,
        },
        options: question.options.map((option) => ({
          ...option,
          image: option.image?.url || null,
        })),
      }));

      const quizData = {
        userId, // Add userId to the request body
        title: title,
        questions: transformedQuestions,
      };

      console.log("Submitting quiz data:", quizData);

      const response = await fetch("http://localhost:8080/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.message || "Failed to submit quiz");
      }

      const result = await response.json();
      console.log("Quiz submitted successfully:", result);
      toast.success("Quiz submitted successfully!");

      // Clear the form after submission
      setQuestions([
        {
          id: 1,
          question: "",
          options: [
            { id: "1", text: "", image: null, isCorrect: false },
            { id: "2", text: "", image: null, isCorrect: false },
            { id: "3", text: "", image: null, isCorrect: false },
            { id: "4", text: "", image: null, isCorrect: false },
          ],
          media: { image: null, audio: null, video: null },
        },
      ]);
      setTitle("");
      setCurrentQuestionIndex(0);
      setMultipleCorrect(false);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  // Function to open media in a new tab
  const openMedia = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="min-vh-100 bg-dark text-white py-5">
      <div className="container">
        {/* Toastify Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* Pass title and setTitle as props to QuizTitle */}
        <QuizTitle title={title} setTitle={setTitle} />

        {/* Question Number Navigation */}
        <div className="mb-4 d-flex justify-content-center">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`btn btn-outline-light rounded mx-1 ${currentQuestionIndex === index ? "active" : ""}`}
              onClick={() => setCurrentQuestionIndex(index)}
              style={{ backgroundColor: "#ffc400", border: "2px solid white" }}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Question Input Area */}
        <div className="mb-4 p-4 bg-dark bg-gradient rounded" style={{ border: "3px solid #ffc400" }}>
          <textarea
            className="form-control bg-dark text-white border-0 mb-3"
            placeholder="Type your question here..."
            value={questions[currentQuestionIndex].question}
            onChange={(e) => {
              const newQuestions = [...questions];
              newQuestions[currentQuestionIndex].question = e.target.value;
              setQuestions(newQuestions);
            }}
            rows={4}
            style={{
              fontSize: "1.25rem",
              textAlign: "center",
              color: "white",
              resize: "none",
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}

          />
          <div className="d-flex gap-2 justify-content-center">
            {["image", "audio", "video"].map((type) => (
              <div key={type}>
                <input
                  type="file"
                  id={`question${type}`}
                  className="d-none"
                  accept={`${type}/*`}
                  onChange={(e) => handleQuestionMediaUpload(type, e)}
                />
                <label htmlFor={`question${type}`} className="btn btn-outline-light">
                  {type === "image" && <Image size={20} />}
                  {type === "audio" && <Mic size={20} />}
                  {type === "video" && <Video size={20} />}
                </label>
                {questions[currentQuestionIndex].media[type] && (
                  <div className="mt-2 d-flex align-items-center gap-2">
                    <button
                      className="btn btn-link text-white p-0"
                      onClick={() => openMedia(questions[currentQuestionIndex].media[type].url)}
                    >
                      {questions[currentQuestionIndex].media[type].name} - {questions[currentQuestionIndex].media[type].size}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveQuestionMedia(type)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Answer Options */}
        <div className="row g-4 mb-4">
          {questions[currentQuestionIndex].options.map((option, index) => (
            <div key={option.id} className="col-md-6">
              <div className="bg-dark bg-gradient p-3 rounded"
                style={{ border: "3px solid #ffc400" }}>
                <textarea
                  className="form-control bg-dark text-white border-0 mb-2"
                  placeholder="Type answer option here..."
                  value={option.text}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[currentQuestionIndex].options[index].text = e.target.value;
                    setQuestions(newQuestions);
                  }}
                />
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => {
                        const newQuestions = [...questions];
                        newQuestions[currentQuestionIndex].options[index].image = null;
                        setQuestions(newQuestions);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                    <input
                      type="file"
                      id={`optionImage${option.id}`}
                      className="d-none"
                      accept="image/*"
                      onChange={(e) => handleOptionImageUpload(currentQuestionIndex, option.id, e)}
                    />
                    <label htmlFor={`optionImage${option.id}`} className="btn btn-warning btn-sm">
                      <ImagePlus size={16} />
                    </label>
                  </div>
                  <button
                    className={`btn ${option.isCorrect ? "btn-success" : "btn-outline-light"} btn-sm`}
                    onClick={() => handleCorrectAnswerToggle(currentQuestionIndex, option.id)}
                  >
                    <Check size={16} />
                  </button>
                </div>
                {option.image && (
                  <div className="mt-2 d-flex align-items-center gap-2">
                    <button
                      className="btn btn-link text-white p-0"
                      onClick={() => openMedia(option.image.url)}
                    >
                      {option.image.name} - {option.image.size}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveOptionImage(currentQuestionIndex, option.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Answer Type Toggle */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${!multipleCorrect ? "btn-warning" : "btn-outline-light"}`}
              onClick={() => setMultipleCorrect(false)}
            >
              Single correct answer
            </button>
            <button
              type="button"
              className={`btn ${multipleCorrect ? "btn-warning" : "btn-outline-light"}`}
              onClick={() => setMultipleCorrect(true)}
            >
              Multiple correct answers
            </button>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-success" onClick={addQuestion}>
              <PlusCircle size={20} className="me-2" />
              Add Question
            </button>
            <button
              className="btn btn-danger"
              onClick={() => removeQuestion(currentQuestionIndex)}
              disabled={questions.length === 1}
            >
              <MinusCircle size={20} className="me-2" />
              Remove Question
            </button>
          </div>
        </div>

        {/* Add More Questions and Remove Question buttons */}


        {/* Submit and Save as Draft buttons */}
        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-primary btn-lg" style={{fontWeight:800, width:400}} onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}