import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard.jsx';
import InterviewPrep from './pages/InterviewPrep';
import { UserProvider } from './context/userContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/interview-prep/:sessionId"
          element={
            <PrivateRoute>
              <InterviewPrep />
            </PrivateRoute>
          }
        />
      </Routes>
    </UserProvider>
  );
}

export default App;
