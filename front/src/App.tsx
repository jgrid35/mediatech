import './App.css';
import MovieGrid from './MovieGrid';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from './hooks/AuthProvider';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import FirstLogin from './FirstLogin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/first-login" element={<ProtectedRoute><FirstLogin /></ProtectedRoute>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="App-body">
                  <div className="movie-grid-wrapper">
                    <MovieGrid />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Login />} /> {/* Default route to login */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;