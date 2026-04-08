import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { useForm } from "react-hook-form";
import { AuthDTO } from '../types';
import { loginUser } from '../apis/authAPI'
//import { useAuthContexHook } from '../context/AuthContext';

const LoginPage = () => {

  const form = useForm<AuthDTO>();

  const { register, handleSubmit, formState } = form;

  const { errors } = formState;

  //const { SetjwtToken } = useAuthContexHook();

  const [loginForm, SetLoginForm] = useState<AuthDTO>({
    email: '',
    userName: '',
    password: '0'
  })

  const navigate = useNavigate();

  const trackField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    SetLoginForm({ ...loginForm, [name]: value });
  }

  const handleLogin = async () => {
    const response = await loginUser(loginForm);
    //SetjwtToken(response?.token)
    //navigate("/home")

  };




  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="login-form">

          <div className="form-group">
            <label htmlFor="firstName">Email</label>
            <input
              type="text"
              placeholder="Enter your email"
              {...register("email", { required: { value: true, message: "Enter your FirstName" } })}
              onChange={trackField} />
            {
              errors.email && (
                <span className="error">
                  {errors?.email?.message}
                </span>
              )
            }
          </div>

          <div className="form-group">
            <label htmlFor="lastName">UserName</label>
            <input
              type="text"
              placeholder="Enter your last name"
              {...register("userName", { required: { value: true, message: "Enter your username" } })}
              onChange={trackField} />
            {
              errors.userName && (
                <span className="error">
                  {errors?.userName?.message}
                </span>
              )
            }
          </div>

          <div className="form-group">
            <label htmlFor="pin">PIN</label>
            <input
              id="pin"
              placeholder="Enter 4-digit PIN"
              {...register("password", { required: { value: true, message: "Enter your PIN" } })}
              onChange={trackField} />
            {
              errors.password && (
                <span className="error">
                  {errors?.password?.message}
                </span>
              )
            }
          </div>

          <button
            type="submit"
            className="login-button"
          >
            Log In
          </button>
        </form>


      </div>
    </div>
  );
};

export default LoginPage;

