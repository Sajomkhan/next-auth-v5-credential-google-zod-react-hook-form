"use client";
import { login, register } from "@/actions/authActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { FaEye, FaEyeSlash, FaGithub, FaGoogle } from "react-icons/fa";
import { z } from "zod";

// CHECK THE VALIDITY OF THE FORM
const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is requrired" })
    .min(3, "Name must be more than 3 character")
    .max(32, "Name must be less than 32 character"),
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Passowrd" })
    .min(1, "Password is required")
    .min(4, "Password must be more than 4 characters")
    .max(32, "Password must be less than 32 characters"),
});

// TYPES FOR FORM
export type FormValues = {
  name: string;
  email: string;
  password: string;
};

// TYPES FOR FORM ERRORS
type FormErrors = Partial<Record<keyof FormValues, string>> & {
  general?: string;
};

// REGISTER COMPONENTS
const RegisterPage = () => {
  const [formValue, setFormValue] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState<FormErrors>({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { pending } = useFormStatus();
  const router = useRouter();

  // HANDLE CHANGE OF INPUT FIELDS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  // HANDLE REGISTER SUBMIT
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // CHECK INTERNET CONNECTION
    if (!navigator.onLine) {
      alert(
        "No internet connection. Please check your connection and try again."
      );
      return;
    }

    // Validation
    const validatedFormData = registerSchema.safeParse(formValue);

    if (!validatedFormData.success) {
      const errors: FormErrors = {};
      validatedFormData.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as keyof FormValues] = err.message;
        }
      });
      setFormError(errors);
    } else {
      // Register Action
      try {
        const result = await register(validatedFormData.data);
        if (result.success) {
          setFormError({});
          router.push("/login");
        } else {
          alert(result.error);
          setFormError({ general: result.error });  // Server error catching
        }
      } catch (err) {
        console.error("An unexpected error occurred:", err);
        setFormError({
          general: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center text-sm">
      <div className="w-96 flex flex-col gap-7 bg-white text-black border border-gray-300 rounded-lg shadow-lg px-6 py-10 sm:px-10">
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
          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <input
              className="border border-gray-300 outline-gray-300 rounded-md py-2 px-4"
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
            />
            <p className="text-sm text-red-500">{formError.name}</p>
          </div>
          {/* FIRST NAME */}
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
              {/* SHOW PASSWORD*/}
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
          
        {/* Display General Errors */}
        {formError.general && (
          <p className="text-red-500 text-center">
            {formError.general}
          </p>
        )}

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
