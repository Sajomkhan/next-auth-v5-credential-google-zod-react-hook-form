"use client";
import { login, loginWithCredentials } from "@/actions/authActions";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { FaEye, FaEyeSlash, FaGithub, FaGoogle } from "react-icons/fa";
import { z } from "zod";

// CHECK THE VALIDITY OF THE FORM
const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(4, "Password must be more than 4 characters")
    .max(32, "Password must be less than 32 characters"),
});

// TYPES FOR FORM
type FormValues = {
  email: string;
  password: string;
};

// TYPES FOR FORM ERRORS
type FormErrors = Partial<Record<keyof FormValues, string>>;

// LOGIN PAGE COMPONENT
const LoginPage = () => {
  const [formValue, setFormValue] = useState<FormValues>({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState<FormErrors>({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { pending } = useFormStatus();

  // HANDLE CHANGE OF INPUT FIELDS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  // HANDLE LOGIN SUBMIT
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
        
    // CHECK INTERNET CONNECTION
    if (!navigator.onLine) {
      alert("No internet connection. Please check your connection and try again.");
      return; 
    }

    // Validation
    const validatedFormData = signInSchema.safeParse(formValue);

    if (!validatedFormData.success) {
      const errors: FormErrors = {};
      validatedFormData.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as keyof FormValues] = err.message;
        }
      });
      setFormError(errors);
    } else {
      setFormError({});
      loginWithCredentials(formValue.email, formValue.password);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center text-sm">
      <div className="w-96 flex flex-col gap-7 bg-white text-black border border-gray-300 rounded-lg shadow-lg px-6 py-10 sm:px-10">
        <h1 className="text-2xl font-bold text-center">
          Log in to your account
        </h1>

        {/* EXTERNAL PROVIDER LOGIN */}
        <section className="w-full flex flex-col gap-6">
          <div
            onClick={() => login("google")}
            className="w-full bg-blue-500 flex gap-3 items-center justify-center rounded-md py-2 cursor-pointer"
          >
            <FaGoogle className="text-white" />
            <p className="text-white">Login with Google</p>
          </div>
          <div
            onClick={() => login("github")}
            className="w-full bg-black flex gap-3 items-center justify-center rounded-md py-2 cursor-pointer"
          >
            <FaGithub className="text-white" />
            <p className="text-white">Login with Github</p>
          </div>
        </section>

        <div className="w-full h-5 flex items-center justify-between relative">
          <span className="w-[43%] h-[1px] bg-gray-200" />
          <span className="text-gray-500 text-sm">or</span>
          <span className="w-[43%] h-[1px] bg-gray-200" />
        </div>

        {/* CREDENTIAL LOGIN FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <input
              className="border border-gray-300 outline-gray-300 rounded-md py-2 px-4"
              type="text"
              name="email"
              placeholder="Email"
              value={formValue.email}
              onChange={handleChange}
            />
            {/* ERROR DISPLAY */}
            {formError.email && (
              <p className="text-sm text-red-500">{formError.email}</p>
            )}
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
              {/* SHOW PASSWORD */}
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
            {/* SIGN UP LINK */}
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <a className="underline hover:text-teal-500" href="/register">
                Sign up
              </a>
            </p>
            {/* LOGIN BUTTON */}
            <button
              disabled={pending}
              className={`${
                pending ? "bg-gray-500" : "bg-teal-500 hover:bg-teal-600"
              } w-fit py-1.5 px-4 rounded-md text-white transition-all ease-linear duration-150`}
            >
              {pending ? "Loading..." : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
