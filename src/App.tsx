import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import { setUsers, setCurrentUser } from './store/userSlice';
import { mockUsers } from './utils/mockData';
import { initializeFirebase } from './firebase';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize Firebase (mock)
    initializeFirebase();
    
    // Initialize app with mock data
    store.dispatch(setUsers(mockUsers));
    
    // Set current user to the admin user
    const adminUser = mockUsers.find(user => user.role === 'admin');
    if (adminUser) {
      store.dispatch(setCurrentUser(adminUser));
    }
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
