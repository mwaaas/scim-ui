"use client";
import { useEffect, useState } from "react";
import UserInfo from "./userInfo";
import { ListUser } from "@/types/scim-user";
import axios from "axios";

export default function UsersList() {
  const [users, setUsers] = useState<ListUser[]>();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios("/api/getUsers");
        if (response.status !== 200) {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }
        setUsers(response.data);
      } catch (error) {
        console.error("user listing error", error);
      }
    };

    fetchUsers();
  }, []);
  return (
    <div className=" mx-auto block min-h-screen max-w-contentContainer place-items-center">
      <UserInfo users={users} />
    </div>
  );
}
