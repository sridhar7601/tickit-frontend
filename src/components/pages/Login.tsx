import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../auth/AuthForm';
import { login } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async (username: string, email: string, password: string, role: string, active: boolean) => {
    try {
      const response = await login({ username, password });
      const { token, user } = response.data;
  
      // Save the token with the same key 'token'
      localStorage.setItem('token', token);
  
      // Save user details under a different key, e.g., 'userDetails'
      localStorage.setItem('userDetails', JSON.stringify(user));
  
      alert('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };
  

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        /> */}
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <AuthForm isLogin={true} onSubmit={handleLogin} />

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{' '}
          <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;