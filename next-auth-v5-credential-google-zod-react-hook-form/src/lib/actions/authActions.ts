"use server"
import { LoginFormFields } from "@/app/login/page";
import { RegisterFormFields } from "@/app/register/page";
import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { saltAndHashPassword } from "@/utils/helper";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

// GET USER BY EMAIL
export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    console.log("Error:", error);
    return null; // Or throw the error if you want to propagate it
  }
};

// REGISTRATION
export const userRegister = async (data: RegisterFormFields) => {
  try {
    // Check if email already exists
    const isEmailExist = await getUserByEmail(data.email);

    if (isEmailExist) {
      throw new Error("Email already exist");
    }
    // Hash the password
    const { password, ...other } = data;
    const hash = saltAndHashPassword(password);
    const newData = { ...other, hashPassword: hash };

    // Create the new user
    await db.user.create({
      data: newData,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error:", error.message || error);

    return { success: false, error: error.message || "An error occurred" };
  }
};

// LOGIN ACTIONS (GOOGLE, GITHUB)
export const login = async (provider: string) => {
  await signIn(provider, { redirectTo: "/" });
  revalidatePath("/");
};

// LOGOUT ACTIONS
export const logout = async () => {
  await signOut({ redirectTo: "/" });
  revalidatePath("/");
};

// CREDENTIALS LOGIN ACTIONS
export const loginWithCredentials = async (data: LoginFormFields) => {
  try {
    await signIn("credentials", {
      ...data,
      role: "ADMIN",
      redirectTo: "/",
    });
    
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "" };
      }
    }
    throw error;
  }
  revalidatePath("/");
};
