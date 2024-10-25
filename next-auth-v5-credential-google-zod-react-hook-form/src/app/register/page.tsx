// npm i react-hook-form zod @hookform/resolvers
// npm i @hookform/resolvers
// npm i zod

"use client";
import { login, userRegister } from "@/lib/actions/authActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaGithub, FaGoogle } from "react-icons/fa";
import { z } from "zod";

// ZOD SCHEMA FOR VALIDITY
const schema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 4 characters")
    .max(32, "Username must be at most 32 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(4, "Password must be at least 4 characters")
    .max(32, "Password must be at most 32 characters"),
});

// TYPES
export type RegisterFormFields = z.infer<typeof schema>;

// REGISTER COMPONENTS
const RegisterPage = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormFields>({ resolver: zodResolver(schema) });

  // HANDLE REGISTER SUBMIT
  const onSubmit: SubmitHandler<RegisterFormFields> = async (data) => {
    try {
      const response = await userRegister(data);
      if (!response.success) {
        setError("root", {
          message: response.error,
        });
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <input
              {...register("username")}
              className="border border-gray-300 outline-gray-300 rounded-md py-2 px-4"
              type="text"
              placeholder="Username"
            />
            {errors.username && (
              <div className="text-red-500">{errors.username.message}</div>
            )}
          </div>
          {/* FIRST NAME */}
          <div className="flex flex-col gap-1">
            <input
              {...register("email")}
              className="border border-gray-300 outline-gray-300 rounded-md py-2 px-4"
              type="text"
              placeholder="Email"
            />
            {errors.email && (
              <div className="text-red-500">{errors.email.message}</div>
            )}
          </div>
          {/* PASSWORD */}
          <div className="flex flex-col gap-1 relative">
            <div className="relative">
              <input
                {...register("password")}
                className="w-full border border-gray-300 outline-none rounded-md py-2 px-4"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Password"
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
            {errors.password && (
              <div className="text-red-500">{errors.password.message}</div>
            )}
          </div>

          {/* Display General Errors */}
          {errors.root && (
            <p className="text-red-500 text-center">{errors.root.message}</p>
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
              disabled={isSubmitting}
              className={`${
                isSubmitting ? "bg-gray-500" : " bg-teal-500 hover:bg-teal-600"
              } w-fit py-1.5 px-4 rounded-md text-white transition-all ease-linear duration-150`}
            >
              {isSubmitting ? "Loading..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
