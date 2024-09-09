import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../auth/AuthForm';
import { register } from '../services/api';

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const handleSignup = async (username: string, email: string, password: string, role: string, active: boolean) => {
    try {
      await register({ username, email, password, role, active });
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. Please try again.');
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
          Create a new account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <AuthForm isLogin={false} onSubmit={handleSignup} />

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;