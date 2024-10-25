"use client";
import { logout } from "@/actions/authActions";
import { MdLogout } from "react-icons/md";

const Logout = () => {
  return (
    <div className="p-2">
      <button
        className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
        role="menuitem"
        onClick={() => logout()}
      >
        <MdLogout />
        Logout
      </button>
    </div>
  );
};

export default Logout;
