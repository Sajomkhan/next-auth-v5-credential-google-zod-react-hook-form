"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MdLogout, MdOutlineMenu } from "react-icons/md";
import { useState } from "react";
import { logout } from "@/lib/actions/authActions";
import { FaX } from "react-icons/fa6";

const sidebarMenu = [
  {
    link: "/",
    menu: "Home",
  },
  {
    link: "/services",
    menu: "Services",
  },
  {
    link: "/blog",
    menu: "Blog",
  },
  {
    link: "/admin",
    menu: "Admin",
  },
];

const Navbar = ({ session }: { session: any }) => {
  const pathname = usePathname();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="bg-white border-b">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14  items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12">
            {/* LOGO */}
            <Link className="block text-teal-500 text-2xl font-bold" href="/">
              LOGO
            </Link>
          </div>
          {/* NAV MANU FOR DESTOP */}
          <div className="flex items-center gap-4 md:gap-12">
            <nav className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm">
                {sidebarMenu.map((menu) => (
                  <li
                    className={`${
                      menu.link === pathname ? "border-b border-gray-500" : ""
                    } w-fit hover:border-gray-500 py-0.5`}
                    key={menu.menu}
                  >
                    <Link href={menu.link} className="">
                      {menu.menu}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* USER PROFILE DROPDOWN SECTION */}
            {!session?.user?.email ? (
              // LOGIN BUTTON
              <Link href="/login">
                <div className="bg-teal-500 text-white px-3 py-1 rounded-md">
                  Login
                </div>
              </Link>
            ) : (
              <div className="relative">
                {/* PROFILE IMAGE */}
                <button
                  type="button"
                  className="flex justify-center items-center overflow-hidden rounded-full shadow-inner"
                  onClick={() => setProfileDropdown(!profileDropdown)}
                >
                  {!session?.user?.image ? (
                    <div className="bg-teal-500 text-white size-9 text-lg uppercase p-1">
                      {session?.user?.email.slice(0, 1)}
                    </div>
                  ) : (
                    <Image
                      src={session?.user?.image || ""}
                      alt=""
                      width={40}
                      height={40}
                      className="size-7 object-cover"
                    />
                  )}
                </button>
                {/* DROPDOWN */}
                <div
                  className={`${
                    profileDropdown ? "block" : "hidden"
                  } absolute end-0 z-10 mt-0.5 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg`}
                >
                  <div className="p-2">
                    <div
                      className="block rounded-lg px-4 py-2 text-gray-500 font-semibold text-sm hover:bg-gray-50 hover:text-gray-700"
                    >
                      {session?.user?.name ||
                        session?.user?.username ||
                        session?.user?.email.split("@")[0]}
                    </div>
                    <Link
                      href="#"
                      className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    >
                      Settings
                    </Link>
                  </div>
                  {/* DROPDOWN LOGOUT */}
                  <div className="p-2">
                    <button
                      className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      onClick={() => logout()}
                    >
                      <MdLogout />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MOBILE MENU */}
            <div className="block md:hidden">
              {/* MOBILE MENU BUTTON */}
              <button
                className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
                onClick={() => setMobileMenu(!mobileMenu)}
              >
                <MdOutlineMenu size={24} />
              </button>
              {/* MOBILE MENU DROPDOWN */}
              <div
                className={`${
                  mobileMenu ? "block" : "hidden"
                } absolute top-0 right-0 z-10 w-72 rounded-lg border border-gray-100 bg-white shadow-lg`}
              >
                <div className="flex flex-col my-2 mx-2">
                  <button
                    onClick={() => setMobileMenu(!mobileMenu)}
                    className="self-end hover:bg-gray-300/50 p-2 mr-1"
                  >
                    <FaX />
                  </button>
                  <ul className="flex flex-col items-center text-lg">
                    {sidebarMenu.map((menu) => (
                      <li
                        className={`${
                          menu.link === pathname && "font-bold"
                        } w-full mb-7 text-center hover:font-bold`}
                        key={menu.menu}
                      >
                        <Link href={menu.link} className="">
                          {menu.menu}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
