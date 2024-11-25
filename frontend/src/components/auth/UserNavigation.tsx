"use client";

import { signOut } from "next-auth/react";
import { UserType } from "@/lib/nextauth";
import Image from "react-bootstrap/Image";
import NavDropdown from "react-bootstrap/NavDropdown";

interface UserNavigationProps {
  user: UserType;
}

const UserNavigation = ({ user }: UserNavigationProps) => {
  return (
    <NavDropdown
      title={
        <Image
          src={user.avatar || "/default.png"}
          className="rounded-full object-cover"
          alt={user.name || "avatar"}
          width={60}
          height={60}
        />
      }
      id="basic-nav-dropdown"
    >
      <NavDropdown.Item href={`/user/${user.uid}`}>
        {user.name || ""}
      </NavDropdown.Item>
      <NavDropdown.Item href="/settings/profile">
        Account Settings
      </NavDropdown.Item>
      <NavDropdown.Item
        onClick={async () => {
          await signOut({ callbackUrl: "/" });
        }}
      >
        Log Out
      </NavDropdown.Item>
    </NavDropdown>
  );
};

export default UserNavigation;
