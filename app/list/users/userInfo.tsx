import { ListUser } from "@/types/scim-user";
import { AlertCircle, CheckCheck } from "lucide-react";

interface UserInfoProps {
  users: Array<ListUser> | undefined;
}
const UserInfo = ({ users }: UserInfoProps) => {
  const schema = "urn:ietf:params:scim:schemas:core:2.0:User";
  const statusClasses = "font-bold italic text-2xl";
  return (
    <div className="flex max-w-containerSmall flex-col items-center gap-3">
      <h1 className="font-titleFont text-2xl font-bold text-neutral-900">
        List of Users
      </h1>
      <div className="w-full overflow-x-auto bg-accent/80 ">
        <table className="xll:table-lg table table-pin-rows table-pin-cols table-md">
          <thead className="rounded-lg text-xl font-bold text-slate-500 dark:text-white">
            <tr className="">
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody className="text-neutral-800">
            {users &&
              users.map((user) => (
                <tr key={user.id} className="font-bold">
                  <td>{user[schema].userName}</td>
                  <td>{user[schema].name.formatted}</td>

                  <td>
                    {user[schema].emails.map((email) => (
                      <div key={email.value}>
                        {email.value} ({email.type})
                      </div>
                    ))}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      {user[schema].active ? (
                        <CheckCheck className="h-6 w-12 text-blue-700" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-neutral-700" />
                      )}
                      <span
                        className={`text-xl font-bold italic ${user[schema].active ? "text-secondary " : "text-primaryRed"}`}
                      >
                        {user[schema].active ? "active" : "inactive"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserInfo;
