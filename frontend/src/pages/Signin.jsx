import { useEffect, useState } from "react";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { BottomWarning } from "../components/BottomWarning";
import { Navigate } from "react-router-dom";
import axios from "axios";

export const SignIn = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [r, setR] = useState("");

  const url = "http://localhost:3000/api/v1/user/signin";
  const data = {
    username,
    first_name: firstName,
    last_name: lastName,
    email,
    password,
  };
  const headers = {
    "Content-Type": "application/json",
  }
  const signIn = async () => {
    try {
      const response = await axios.post(url, data, { headers });
      const token = response.data.token;
      localStorage.setItem("authToken", token);
      setR(response.data.message);
      Navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setR(error.response.data.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div>{r} </div>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <Heading title="Sign In" />
        </div>
        <div className="text-center mb-4">
          <SubHeading label="Enter your information to create an account" />
        </div>
        <div className="space-y-5">
          <InputBox label="Username" placeholder="john doe" type="text" onChange={(e) => setUsername(e.target.value)} />
          <InputBox label="First Name" placeholder="john" type="text" onChange={(e) => setFirstName(e.target.value)} />
          <InputBox label="Last Name" placeholder="doe" type="text" onChange={(e) => setLastName(e.target.value)} />
          <InputBox label="Email" placeholder="john@doe.com" type="email" onChange={(e) => setEmail(e.target.value)} />
          <InputBox label="Password" placeholder="123456" type="password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="mt-6">
          <Button onClick={signIn} label="Sign in" className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600" />
        </div>
        <div className="mt-4 text-center">
          <BottomWarning label="Already have an account?" link="/signup" linkLabel="Sign up" />
        </div>
      </div>
    </div >
  );
};
