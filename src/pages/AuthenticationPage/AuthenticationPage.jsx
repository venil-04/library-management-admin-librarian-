import React, { useState } from 'react';
import Login from '../LoginPage/LoginPage.jsx'; // Adjust the path as needed
import Signup from '../SignUpPage/SignupPage.jsx'; // Adjust the path as needed
import './Auth.css'; // Import your CSS for styling

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(prevState => !prevState);
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        {isLogin ? <Login /> : <Signup />}
        <p>{isLogin ? "Don't have an account?" : "Already have an account?"}<span onClick={toggleForm}>{isLogin ? " Sign Up" : " Login"}</span></p>
      </div>
    </div>
  );
};

export default AuthPage;
