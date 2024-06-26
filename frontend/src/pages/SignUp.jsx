import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { BottomWarning } from "../components/BottomWarning";

export const SignUp = () => {
  const signUp = () => { };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <Heading title="Sign Up" />
        </div>
        <div className="text-center mb-4">
          <SubHeading label="Enter your credentials to access your account" />
        </div>
        <div className="space-y-4">
          <InputBox label="Username" placeholder="john doe" type="text" />
          <InputBox label="Email" placeholder="john@doe.com" type="text" />
          <InputBox label="Password" placeholder="123456" type="text" />
        </div>
        <div className="mt-6">
          <Button onClick={signUp} label="Sign up" className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600" />
        </div>
        <div className="mt-4 text-center">
          <BottomWarning label="Don't have an account?" link="/signin" linkLabel="Sign in" />
        </div>
      </div>
    </div>
  );
};
