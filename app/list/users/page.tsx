"use client";
import { useEffect, useState } from "react";
import { ListUsers } from "@/types/scim-user";
import axios from "axios";
import UpdatedUserInfo from "./updatedUserInfo";
export default function UsersList() {
  const [users, setUsers] = useState<ListUsers[]>();
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      if (response.status !== 200) {
        throw new Error(
          `\n failed to fetch users ;\n status:${response.status},\n message: ${response.statusText}`,
        );
      }
      setUsers(response.data);
    } catch (error) {
      console.error("user listing error", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div className=" mx-10 block min-h-screen place-items-center">
      <UpdatedUserInfo users={users} fetchUsers={()=>fetchUsers()} />
    </div>
  );
}