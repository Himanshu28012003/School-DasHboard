import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { API_BASE_URL } from "./constants";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import type {
  AuthFormState,
  AuthMode,
  MarksFormState,
  ProgressPoint,
  Result,
  SectionComparison,
  StoredUser,
  Student,
  StudentFormState,
} from "./types";
import {
  clearCurrentUser,
  getCurrentUser,
  getStoredUsers,
  saveStoredUsers,
  setCurrentUser,
} from "./utils/authStorage";

const EMPTY_AUTH_FORM: AuthFormState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const EMPTY_STUDENT_FORM: StudentFormState = {
  name: "",
  rollNumber: "",
  className: "",
  section: "",
};

const EMPTY_MARKS_FORM: MarksFormState = {
  studentId: "",
  maths: "",
  science: "",
  english: "",
  computer: "",
};

function App() {
  const savedCurrentUser = getCurrentUser();

  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(savedCurrentUser));
  const [loggedInUser, setLoggedInUser] = useState(savedCurrentUser);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authForm, setAuthForm] = useState<AuthFormState>(EMPTY_AUTH_FORM);

  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [studentForm, setStudentForm] = useState<StudentFormState>(EMPTY_STUDENT_FORM);
  const [marksForm, setMarksForm] = useState<MarksFormState>(EMPTY_MARKS_FORM);
  const [progressStudentId, setProgressStudentId] = useState("");
  const [progressData, setProgressData] = useState<ProgressPoint[]>([]);
  const [progressLoading, setProgressLoading] = useState(false);
  const [chartClassName, setChartClassName] = useState("");
  const [sectionComparisonData, setSectionComparisonData] = useState<SectionComparison[]>([]);
  const [sectionComparisonLoading, setSectionComparisonLoading] = useState(false);

  const totalStudents = useMemo(() => students.length, [students]);
  const totalResults = useMemo(
    () => results.filter((item) => item.total !== null).length,
    [results]
  );
  const classOptions = useMemo(() => {
    const classes = new Set<string>();
    students.forEach((student) => {
      if (student.className) classes.add(student.className);
    });
    return Array.from(classes).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [students]);

  const handleAuthModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthError("");
    setAuthMessage("");
  };

  const handleAuthFormChange = (field: keyof AuthFormState, value: string) => {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleStudentFormChange = (field: keyof StudentFormState, value: string) => {
    setStudentForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleMarksFormChange = (field: keyof MarksFormState, value: string) => {
    setMarksForm((prev) => ({ ...prev, [field]: value }));
  };

  const fetchStudents = async () => {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (!response.ok) {
      throw new Error("Failed to load students");
    }
    const data = await response.json();
    setStudents(data.students || []);
  };

  const fetchResults = async () => {
    const response = await fetch(`${API_BASE_URL}/results`);
    if (!response.ok) {
      throw new Error("Failed to load results");
    }
    const data = await response.json();
    setResults(data.results || []);
  };

  const refreshAll = async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([fetchStudents(), fetchResults()]);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    void refreshAll();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!progressStudentId && students.length > 0) {
      setProgressStudentId(String(students[0].id));
    }
    if (!chartClassName && classOptions.length > 0) {
      setChartClassName(classOptions[0]);
    }
  }, [isAuthenticated, progressStudentId, chartClassName, students, classOptions]);

  useEffect(() => {
    const fetchStudentProgress = async () => {
      if (!isAuthenticated || !progressStudentId) {
        setProgressData([]);
        return;
      }

      setProgressLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/results/progress/${progressStudentId}`);
        if (!response.ok) {
          setProgressData([]);
          return;
        }
        const data = await response.json();
        setProgressData(data.progress || []);
      } catch {
        setProgressData([]);
      } finally {
        setProgressLoading(false);
      }
    };

    void fetchStudentProgress();
  }, [isAuthenticated, progressStudentId, results]);

  useEffect(() => {
    const fetchSectionComparison = async () => {
      if (!isAuthenticated || !chartClassName) {
        setSectionComparisonData([]);
        return;
      }

      setSectionComparisonLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/results/comparison/sections?className=${encodeURIComponent(chartClassName)}`
        );
        if (!response.ok) {
          setSectionComparisonData([]);
          return;
        }
        const data = await response.json();
        setSectionComparisonData(data.sections || []);
      } catch {
        setSectionComparisonData([]);
      } finally {
        setSectionComparisonLoading(false);
      }
    };

    void fetchSectionComparison();
  }, [isAuthenticated, chartClassName, results]);

  const handleAuthSubmit = (event: FormEvent) => {
    event.preventDefault();
    setAuthError("");
    setAuthMessage("");

    const email = authForm.email.trim().toLowerCase();
    const password = authForm.password.trim();

    if (!email || !password) {
      setAuthError("Email and password are required");
      return;
    }

    const users = getStoredUsers();

    if (authMode === "signup") {
      const fullName = authForm.fullName.trim();

      if (!fullName) {
        setAuthError("Full name is required");
        return;
      }
      if (password.length < 6) {
        setAuthError("Password must be at least 6 characters");
        return;
      }
      if (authForm.confirmPassword !== authForm.password) {
        setAuthError("Passwords do not match");
        return;
      }
      if (users.some((user) => user.email === email)) {
        setAuthError("This email is already registered");
        return;
      }

      const newUser: StoredUser = { fullName, email, password };
      saveStoredUsers([...users, newUser]);
      setCurrentUser(fullName);
      setLoggedInUser(fullName);
      setIsAuthenticated(true);
      setAuthMessage("Account created successfully");
      return;
    }

    const user = users.find((item) => item.email === email && item.password === password);

    if (!user) {
      setAuthError("Invalid email or password");
      return;
    }

    setCurrentUser(user.fullName);
    setLoggedInUser(user.fullName);
    setIsAuthenticated(true);
    setAuthMessage("Login successful");
  };

  const handleLogout = () => {
    clearCurrentUser();
    setIsAuthenticated(false);
    setLoggedInUser("");
    setAuthForm(EMPTY_AUTH_FORM);
    setAuthMessage("");
    setAuthError("");
  };

  const handleAddStudent = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentForm.name,
          rollNumber: Number(studentForm.rollNumber),
          className: studentForm.className,
          section: studentForm.section.toUpperCase(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not add student");
      }

      setMessage("Student added successfully");
      setStudentForm(EMPTY_STUDENT_FORM);
      await refreshAll();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not add student");
    }
  };

  const handleSaveMarks = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/results/marks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: Number(marksForm.studentId),
          maths: Number(marksForm.maths),
          science: Number(marksForm.science),
          english: Number(marksForm.english),
          computer: Number(marksForm.computer),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not save marks");
      }

      setMessage("Marks saved and result calculated successfully");
      setMarksForm(EMPTY_MARKS_FORM);
      await refreshAll();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save marks");
    }
  };

  if (!isAuthenticated) {
    if (authMode === "signup") {
      return (
        <SignupPage
          authMode={authMode}
          form={authForm}
          message={authMessage}
          error={authError}
          onModeChange={handleAuthModeChange}
          onFormChange={handleAuthFormChange}
          onSubmit={handleAuthSubmit}
        />
      );
    }

    return (
      <LoginPage
        authMode={authMode}
        form={authForm}
        message={authMessage}
        error={authError}
        onModeChange={handleAuthModeChange}
        onFormChange={handleAuthFormChange}
        onSubmit={handleAuthSubmit}
      />
    );
  }

  return (
    <DashboardPage
      loggedInUser={loggedInUser}
      totalStudents={totalStudents}
      totalResults={totalResults}
      loading={loading}
      message={message}
      error={error}
      students={students}
      results={results}
      studentForm={studentForm}
      marksForm={marksForm}
      progressStudentId={progressStudentId}
      progressData={progressData}
      progressLoading={progressLoading}
      chartClassName={chartClassName}
      classOptions={classOptions}
      sectionComparisonData={sectionComparisonData}
      sectionComparisonLoading={sectionComparisonLoading}
      onLogout={handleLogout}
      onRefresh={() => {
        void refreshAll();
      }}
      onProgressStudentChange={setProgressStudentId}
      onChartClassChange={setChartClassName}
      onStudentFormChange={handleStudentFormChange}
      onMarksFormChange={handleMarksFormChange}
      onAddStudent={handleAddStudent}
      onSaveMarks={handleSaveMarks}
    />
  );
}

export default App;
