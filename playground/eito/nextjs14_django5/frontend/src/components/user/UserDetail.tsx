"use client";

import { UserDetailType } from "@/actions/user";
import Image from "next/image";

interface UserDetailProps {
  user: UserDetailType;
}

const UserDetail = ({ user }: UserDetailProps) => {
  return (
    <div>
      <div className="flex justify-center mb-5">
        <div className="relative w-28 h-28 flex-shrink-0">
          <Image
            src={user.avatar || "/default.png"}
            className="rounded-full object-cover"
            alt={user.name || "avatar"}
            fill
          />
        </div>
      </div>
      <div className="space-y-5 break-words whitespace-pre-wrap mb-5">
        <div className="font-bold text-xl text-center">{user.name}</div>
        <div className="leading-relaxed">{user.introduction}</div>
      </div>
    </div>
  );
};

export default UserDetail;
