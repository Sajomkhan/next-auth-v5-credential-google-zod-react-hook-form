"use client";
import { login } from "@/actions/authActions";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { FaEye, FaEyeSlash, FaGithub, FaGoogle } from "react-icons/fa";

type FormValues = {
  username: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const [formValue, setFormValue] = useState<FormValues>({
    username: "",
    fname: "",
    lname: "",
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState<FormValues>({
    username: "",
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { pending } = useFormStatus();

  // HANDLE CHANGE OF INPUT FIELDS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  // CHECK THE VALIDITY OF THE FORM
  const validate = (values: FormValues) => {
    const error: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const uppercaseRegex = /[A-Z]/;

    // Email validation
    if (!values.email) {
      error.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
      error.email = "Invalid email address";
    } else if (uppercaseRegex.test(values.email)) {
      error.email = "Email must not contain uppercase letters";
    } else if (values.email.length > 60) {
      error.email = "Email name must be upto 60 characters";
    }

    // Username validation
    if (!values.username) {
      error.username = "Username is required";
    } else if (values.username.length < 2 || values.username.length > 30) {
      error.username = "Username must be between 2 and 30 characters";
    }

    // First name validation
    if (!values.fname) {
      error.fname = "First name is required";
    } else if (values.fname.length < 2 || values.fname.length > 30) {
      error.fname = "First name must be between 2 and 30 characters";
    }

    // Last name validation
    if (!values.lname) {
      error.lname = "Last name is required";
    } else if (values.lname.length > 30) {
      error.lname = "Last name must be between 2 and 30 characters";
    }

    // Password validation
    if (!values.password) {
      error.password = "Password is required";
    } else if (values.password.length < 4 || values.password.length > 30) {
      error.password = "Password must be at least 4 characters";
    }
    return error;
  };

  // HANDLE CHANGE OF INPUT FIELDS
  useEffect(() => {
    console.log(formError);
    if (Object.keys(formError).length === 0 && isSubmit) {
      console.log(formValue);
    }
  }, [formError]);

  // HANDLE REGISTER SUBMIT
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(validate(formValue));
    setIsSubmit(true);
    // if (Object.keys(formError).length === 0 && isSubmit) {
    //   console.log(formValue);
    // login("credential", formValue);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center text-sm ">
      <div className="w-96 flex flex-col gap-7 bg-white text-black rounded-lg px-6 py-10 sm:px-10">
        <h1 className="text-2xl font-bold text-center">Create your account</h1>

        {/* EXPERNAL PROVIDER */}
        <section className="w-full flex flex-col gap-6 ">
          {/* GOOGLE LOGIN */}
          <div
            onClick={() => login("google")}
            className=" w-full bg-blue-500 flex gap-3 items-center justify-center rounded-md py-2 cursor-pointer"
          >
            <FaGoogle className="text-white" />
            <p className="text-white">Login with Google</p>
          </div>
          {/* GITHUB LOGIN */}
          <div
            onClick={() => login("github")}
            className=" w-full bg-black flex gap-3 items-center justify-center rounded-md py-2 cursor-pointer"
          >
            <FaGithub className="text-white" />
            <p className="text-white">Login with Github</p>
          </div>
        </section>

        {/* SEPERATOR */}
        <div className="w-full h-5 flex items-center justify-between relative">
          <span className="w-[43%] h-[1px] bg-gray-200" />
          <span className="text-gray-500 text-sm">or</span>
          <span className="w-[43%] h-[1px] bg-gray-200" />
        </div>

        {/* CRADENTIAL REGISTER FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* USERNAME */}
          <div className="flex flex-col gap-1">
            <input
              className="border border-gray-300 outline-gray-300 rounded-md py-2 px-4"
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
            />
            <p className="text-sm text-red-500">{formError.username}</p>
          </div>
          {/* FIRST NAME */}
          <div className="flex flex-col gap-1">
            <input
              className="border border-gray-300 outline-gray-300 rounded-md py-2 px-4"
              type="text"
              name="fname"
              placeholder="First Name"
              onChange={handleChange}
            />
            <p className="text-sm text-red-500">{formError.fname}</p>
          </div>
          {/* LAST NAME */}
          <div className="flex flex-col gap-1">
            <input
              className="border border-gray-300 outline-gray-300 rounded-md py-2 px-4"
              type="text"
              name="lname"
              placeholder="Last Name"
              onChange={handleChange}
            />
            <p className="text-sm text-red-500">{formError.lname}</p>
          </div>
          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <input
              className="border border-gray-300 outline-gray-300 rounded-md py-2 px-4"
              type="text"
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />
            <p className="text-sm text-red-500">{formError.email}</p>
          </div>
          {/* PASSWORD */}
          <div className="flex flex-col gap-1 relative">
            <div className="relative">
              <input
                className="w-full border border-gray-300 outline-none rounded-md py-2 px-4"
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formValue.password}
                onChange={handleChange}
              />
              {/* EYE ICON*/}
              {isPasswordVisible ? (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  <FaEye
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  />
                </span>
              ) : (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  <FaEyeSlash
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  />
                </span>
              )}
            </div>
            {/* ERROR DISPLAY */}
            {formError.password && (
              <p className="text-sm text-red-500">{formError.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            {/* GO FOR SING UP */}
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <a className="underline hover:text-teal-500" href="/login">
                Log In
              </a>
            </p>
            {/* REGISTER BUTTON */}
            <button
              disabled={pending}
              className={`${
                pending ? "bg-gray-500" : " bg-teal-500 hover:bg-teal-600"
              } w-fit py-1.5 px-4 rounded-md text-white transition-all ease-linear duration-150`}
            >
              {pending ? "Loading..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
