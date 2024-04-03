"use client";
import { useEffect, useState } from "react";
import { ListUsers } from "@/types/scim-user";
import axios from "axios";
import UpdatedUserInfo from "./list/users/updatedUserInfo";
export default function Home() {
  const [users, setUsers] = useState<ListUsers[]>();
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      if (response.status !== 200) {
        throw new Error(
          `\n failed to fetch users ;\n status:${response.status},\n message: ${response.statusText}`,
        );
      }
      // Sort users based on the lastModified field in descending order
      const sortedUsers = response.data.sort((a: ListUsers, b: ListUsers) => {
        return new Date(b.meta.lastModified).getTime() - new Date(a.meta.lastModified).getTime();
        })
      setUsers(sortedUsers);
    } catch (error) {
      console.error("user listing error", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div className=" block min-h-screen mx-10 place-items-center">
      <UpdatedUserInfo users={users} fetchUsers={()=>fetchUsers()} />
    </div>
  );
}
