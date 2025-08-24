import React, { useContext, useState } from 'react';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authDataContext } from '../Context/AuthContext';
import { userDataContext } from '../Context/UserContext';
import { toast } from 'react-toastify';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { serverUrl, loading, setLoading } = useContext(authDataContext);
  const { setUserData } = useContext(userDataContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      console.log(result);
      setUserData(result.data);
      toast.success('Signup Successfully');
      navigate('/');
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-background relative px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-10 left-5 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-md"
      >
        <FaArrowLeftLong className="w-6 h-6" />
      </button>

      {/* Form */}
      <form
        onSubmit={handleSignUp}
        className="w-full max-w-[500px] bg-white p-8 rounded-xl shadow-lg flex flex-col gap-6"
      >
        <h1 className="text-3xl font-semibold text-text">Welcome to AirVista</h1>

        {/* Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-lg text-text">Username</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full h-11 px-4 border-2 border-secondary rounded-lg text-base"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-lg text-text">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-11 px-4 border-2 border-secondary rounded-lg text-base"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2 relative">
          <label htmlFor="password" className="text-lg text-text">Password</label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full h-11 px-4 border-2 border-secondary rounded-lg text-base"
          />
          {showPassword ? (
            <IoMdEyeOff
              className="absolute right-3 bottom-3 w-5 h-5 text-text cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoMdEye
              className="absolute right-3 bottom-3 w-5 h-5 text-text cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white py-2 rounded-lg text-lg hover:opacity-90 transition duration-200 disabled:opacity-60"
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>

        {/* Login Link */}
        <p className="text-base text-text text-center">
          Already have an account?{' '}
          <span
            className="text-primary font-medium cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
