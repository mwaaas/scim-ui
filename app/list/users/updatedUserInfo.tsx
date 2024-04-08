"use client";
import { Button } from "@/components/ui/buttons/button";
import DeleteButton from "@/components/ui/buttons/deleteButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateUser, ListUsers, Name } from "@/types/scim-user";
import axios from "axios";
import { AlertCircle, CheckCheck, ListTodo } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { set, z } from "zod";
interface UserInfoProps {
  users: Array<ListUsers> | undefined;
  fetchUsers: () => Promise<void>;
}
// Define the type for your error object
type ErrorRecord = Record<string, string>;
type PartialCreateUser = Partial<CreateUser>;

const UpdatedUserInfo = (props: UserInfoProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const schema = "urn:ietf:params:scim:schemas:core:2.0:User";
  const [isPending, startTransition] = useTransition();
  const [errorAlert, setErrorAlert] = useState(false);
  const [yesChecked, setYesChecked] = useState(false);
  const [noChecked, setNoChecked] = useState(false);
  const [edit, setEdit] = useState(false);
  const [emptyError, setEmptyError] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [salutation, setSalutation] = useState("");
  const inputClasses = "input-info bg-white h-8 w-full";
  const divClasses = "max-w-Xs flex flex-col gap-2 items-start";
  const innerDivClasses = "flex items-center gap-1";
  const labelClasses = "text-white dark:text-white text-sm font-bold";
  const headerClasses = "font-titleFont text-2xl font-bold ";
  const errorClasses = "h-6 px-2 py-1 border-black";
  const checkboxClasses =
    "checkbox checkbox-xs border-black checked:border-indigo-800 [--chkbg:theme(colors.indigo.600)] [--chkfg:orange]";

  const handleEdit = (userId: string) => {
    setEditingUserId(userId);
    setEdit(true);
  };

  const salutations = [
    { label: "mr", value: "Mr." },
    { label: "ms", value: "Ms." },
    { label: "mrs", value: "Mrs." },
    { label: "dr", value: "Dr." },
    { label: "prof", value: "Prof." },
    { label: "eng", value: "Eng." },
  ];

  const displayErrors =
    salutation === "" ||
    emptyError ||
    errors[
      "userName" ||
        "name.formatted" ||
        "emails[0].value" ||
        "name.givenName" ||
        "name.familyName"
    ];

  useEffect(() => {
    if (editingUserId) {
      // Scroll to the form element
      const formElement = document.getElementById("form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [editingUserId]);

  const [names, setName] = useState<Name>({
    familyName: "",
    givenName: "",
    formatted: "",
  });

  const [editUserInfo, setEditUserInfo] = useState<CreateUser>({
    schemas: [],
    externalId: "",
    name: {
      formatted: "",
      familyName: "",
      givenName: "",
    },
    active: undefined,
    emails: [{ value: "" }],
    userName: "",
  });

  // Function to handle the "Active" checkbox change
  const userActiveStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === "active") {
      setYesChecked(true);
      setNoChecked(false);
      setEditUserInfo((prevEditUserInfo) => ({
        ...prevEditUserInfo,
        active: true,
      }));
    } else if (value === "inactive") {
      setNoChecked(true);
      setYesChecked(false);
      setEditUserInfo((prevEditUserInfo) => ({
        ...prevEditUserInfo,
        active: false,
      }));
    } else {
      setYesChecked(false);
      setNoChecked(false);
      setEditUserInfo((prevEditUserInfo) => ({
        ...prevEditUserInfo,
        active: false,
      }));
    }
  };

  async function deleteUser(id: string) {
    const delUser = new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          const response = await axios.delete(`/api/users/${id}`);
          if (response.status !== 204) {
            throw new Error(
              `\n failed to delete user ;\n status:${response.status},\n message: ${response.statusText}`,
            );
          }
          console.log(`User with ID ${id} deleted successfully`);
        } catch (err: any) {
          console.error("Error deleting user:", err.message);
        }
      });
      if (!isPending) {
        setTimeout(() => {
          startTransition(async () => {
            await props.fetchUsers();
          });
          resolve();
        }, 2000);
      } else {
        setTimeout(() => {
          setErrorAlert(true);
          reject();
          setTimeout(() => {
            setErrorAlert(false);
          }, 3000);
        }, 8000);
      }
    });

    await toast.promise(delUser, {
      loading: "deleting ...",
      success: "deleted!",
      error: errorAlert ? "Error occurred during deletion" : "",
    });
  }

  function resetFields() {
    setEditUserInfo({
      schemas: [""],
      externalId: "",
      name: {
        formatted: "",
        familyName: "",
        givenName: "",
      },
      active: undefined,
      emails: [{ value: "" }],
      userName: "",
    });
    setName({
      familyName: "",
      givenName: "",
      formatted: "",
    });
    setSalutation("");
    setYesChecked(false);
    setNoChecked(false);
  }

  async function handleFormSubmit(
    id: string,
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();
    const formSubmit = new Promise<void>(async (resolve, reject) => {
      try {
        const updatedFields: PartialCreateUser = {};
        const title = salutation ? salutation : names.formatted?.split(" ")[0];
        const givenName = editUserInfo.name.givenName
          ? editUserInfo.name.givenName
          : names.givenName;
        const familyName = editUserInfo.name.familyName
          ? editUserInfo.name.familyName
          : names.familyName;
        const emptyName =
          editUserInfo.name.familyName === "" &&
          editUserInfo.name.givenName === "";
        // Iterate through editUserInfo and copy non-empty values to updatedFields
        for (const [key, value] of Object.entries(editUserInfo)) {
          if (key === "name" && typeof value === "object") {
            // Handle nested object
            if (editUserInfo.name.givenName !== "") {
              updatedFields.name = {
                ...updatedFields.name,
                givenName: editUserInfo.name.givenName,
              };
            }
            if (editUserInfo.name.familyName !== "") {
              updatedFields.name = {
                ...updatedFields.name,
                familyName: editUserInfo.name.familyName,
              };
            }
            if (
              editUserInfo.name.familyName !== "" ||
              editUserInfo.name.givenName != ""
            ) {
              updatedFields.name = {
                ...updatedFields.name,
                formatted: `${title} ${givenName} ${familyName}`,
              };
            }
          } else if (key === "emails" && Array.isArray(value)) {
            // Handle emails array
            const nonEmptyEmails = value.filter((email) => email.value !== "");
            if (nonEmptyEmails.length > 0) {
              updatedFields.emails = nonEmptyEmails;
            }
          }
        }
        // Include non-empty userName
        if (editUserInfo.userName !== "") {
          updatedFields.userName = editUserInfo.userName;
          //updatedFields.externalId = editUserInfo.userName;
        }

        // Include non-empty active
        if (editUserInfo.active !== undefined) {
          updatedFields.active = editUserInfo.active;
        }

        if (salutation !== "" && emptyName) {
          updatedFields.name = {
            formatted: `${salutation} ${givenName} ${familyName}`,
            givenName: givenName,
            familyName: familyName,
          };
        }

        // Add schemas and externalId
        updatedFields.schemas = [
          "urn:ietf:params:scim:api:messages:2.0:PatchOp",
        ];
        console.log("updated fields", updatedFields);

        if (
          Object.keys(updatedFields).length === 1 &&
          "schemas" in updatedFields
        ) {
          reject();
          setEmptyError(true);
          setTimeout(() => {
            setEmptyError(false);
            cancelEdit();
          }, 5000);
        } else {
          const validUpdates = userUpdateSchema(
            editingUserId,
            updatedFields,
          ).parse(updatedFields);
          const response = await axios.patch(`/api/users/${id}`, validUpdates);
          if (response.status === 200) {
            resetFields();
            setTimeout(() => {
              startTransition(async () => {
                setEdit(false);
                setEditingUserId(null);
                await props.fetchUsers();
              });
              resolve();
            }, 2000);
          } else if (response.status === 400) {
            setTimeout(() => {
              setErrorAlert(true);
              reject();
              setTimeout(() => {
                setErrorAlert(false);
              }, 3000);
            }, 3000);
          }
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          setTimeout(() => {
            setErrorAlert(true);
            setTimeout(() => {
              setErrorAlert(false);
            }, 3000);
          }, 3000);
          // Explicitly define the accumulator's type in the reduce function
          const errorObj: ErrorRecord = error.errors.reduce<ErrorRecord>(
            (acc, curr) => {
              const path = curr.path.join(".");
              acc[path] = curr.message;
              return acc;
            },
            {},
          );
          // If validation fails, set errors state with the typed object
          setErrors(errorObj);
          // Clear errors after 5 seconds
          setTimeout(() => {
            setErrors({});
          }, 5000);
          reject();
        } else if (axios.isAxiosError(error)) {
          setTimeout(() => {
            setErrorAlert(true);
            setTimeout(() => {
              setErrorAlert(false);
            }, 3000);
          }, 3000);
          // Handle errors returned from the server
          console.error("Server responded with an error:", error.response);
          // Check if the error response has a status code and message
          if (error.response && error.response.status !== 200) {
            // Here you can handle specific status codes as needed
            console.error("Error status code:", error.response.status);
            // Setting error state based on the server response
            setErrors({
              general: `A server error occurred: ${error.response.data.message || "Please try again later"}`,
            });
          }

          reject();
        } else {
          // Handle other error
          console.error("Unexpected error during user update", error);
          setTimeout(() => {
            setErrorAlert(true);
            setTimeout(() => {
              setErrorAlert(false);
            }, 2000);
          }, 3000);
          reject();
        }
      }
    });
    await toast.promise(formSubmit, {
      loading: "updating user ...",
      success: "updated!",
      error: "error occurred while updating user",
    });
  }

  const cancelEdit = () => {
    setEditingUserId(null);
    setEdit(false);
    resetFields();
  };

  // Define the userUpdateSchema with conditional validation
  const userUpdateSchema = (
    editingUserId: string | null,
    updatedFields: PartialCreateUser,
  ) => {
    // Initialize an empty object for conditional validation
    const fieldValidation: Record<string, z.ZodType<any>> = {};
    if (editingUserId) {
      // Add specific validation for each field being edited
      if ("name" in updatedFields) {
        fieldValidation.name = z.object({
          formatted: z.string(),
          givenName: z.string().optional(),
          familyName: z.string().optional(),
        });
      }
      if ("active" in updatedFields) {
        fieldValidation.active = z.boolean();
      }
      if ("emails" in updatedFields) {
        fieldValidation.emails = z.array(z.object({ value: z.string() }));
      }
      if ("userName" in updatedFields) {
        fieldValidation.userName = z
          .string()
          .min(5, { message: "UserName must have at least 5 characters" })
          .refine(
            (value): boolean => {
              const { familyName, givenName } = names;
              return (
                value.toLowerCase() !== familyName?.toLowerCase() &&
                value !== givenName?.toLowerCase()
              );
            },
            {
              message: `Username cannot be equal to ${names.familyName} or ${names.givenName}`,
            },
          );
      }
    }

    // Return a schema with conditional validation
    return z.object({
      schemas: z.array(z.string().min(1)),
      ...fieldValidation, // Include field-specific validations
    });
  };

  function selectSalutation(salutation: string) {
    setSalutation(salutation);
  }
  return (
    <div className="my-2 flex h-full w-full flex-col items-center gap-3 overflow-x-hidden px-4 scrollbar scrollbar-track-textDark/20 scrollbar-thumb-textDark/60  scrollbar-corner-neutral-100 ">
      <section id="header">
        <h1
          className={
            edit
              ? `${headerClasses} text-green-600 dark:text-green-600`
              : `${headerClasses} text-neutral-800 dark:text-neutral-800`
          }
        >
          {edit ? "Update User" : "List of Users"}
        </h1>
      </section>
      <div className="flex w-full flex-col overflow-x-auto bg-accent/80 ">
        <section id="form">
          {props.users &&
            props.users.map((user) => (
              <>
                {editingUserId === user.id && (
                  <form
                    key={user.id}
                    id={`editForm_${user.id}`}
                    onSubmit={(e) => handleFormSubmit(user.id, e)}
                    className="form-control"
                  >
                    {displayErrors && (
                      <div className="mx-1 mt-1 flex rounded-xl border bg-white text-sm font-bold text-primaryRed dark:bg-white">
                        {errors["userName"] && (
                          <span className={errorClasses}>
                            {errors["userName"]}
                          </span>
                        )}

                        {errors["name.formatted"] && (
                          <span className={errorClasses}>
                            {errors["name.formatted"]}
                          </span>
                        )}

                        {errors["name.givenName"] && (
                          <span className={errorClasses}>
                            {errors["name.givenName"]}
                          </span>
                        )}

                        {errors["name.familyName"] && (
                          <span className={errorClasses}>
                            {errors["name.familyName"]}
                          </span>
                        )}
                        {errors["emails[0].value"] && (
                          <span className={errorClasses}>
                            {errors["emails[0].value"]}
                          </span>
                        )}

                        {emptyError && (
                          <span className={errorClasses}>
                            No changes to update!
                          </span>
                        )}
                      </div>
                    )}
                    <div className="mx-4 mt-2 grid grid-cols-7 gap-2 rounded-xl bg-pink-500 px-3 py-1 dark:bg-pink-500">
                      <div className={divClasses}>
                        <Label htmlFor="username" className={labelClasses}>
                          Username
                        </Label>
                        <Input
                          type="text"
                          placeholder={user[schema].userName}
                          value={editUserInfo.userName}
                          onChange={(e) => {
                            setEditUserInfo({
                              ...editUserInfo,
                              userName: e.target.value,
                            });
                            setName({
                              familyName: user[schema].name.familyName,
                              givenName: user[schema].name.givenName,
                              formatted: user[schema].name.formatted,
                            });
                          }}
                          className={inputClasses}
                        />
                      </div>

                      <div className={divClasses}>
                        <Label htmlFor="title" className={labelClasses}>
                          Title
                        </Label>
                        <Select
                          onValueChange={(salutation) => {
                            selectSalutation(salutation);
                            setName({
                              familyName: user[schema].name.familyName,
                              givenName: user[schema].name.givenName,
                              formatted: user[schema].name.formatted,
                            });
                          }}
                          value={salutation}
                        >
                          <SelectTrigger
                            name="salutation"
                            type="button"
                            className="h-9 bg-base-100 dark:bg-white"
                          >
                            <SelectValue placeholder="Title" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel className="place-items-center text-pink-700">
                                <h3 className="text-center text-sm font-bold uppercase">
                                  salutations
                                </h3>
                                <SelectSeparator className="w-full" />
                              </SelectLabel>

                              {salutations.map((salutation) => (
                                <SelectItem
                                  key={salutation.label}
                                  value={salutation.value}
                                >
                                  {salutation.value}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className={divClasses}>
                        <Label htmlFor="firstname" className={labelClasses}>
                          First Name
                        </Label>
                        <Input
                          type="text"
                          value={editUserInfo.name.givenName}
                          placeholder={user[schema].name.givenName}
                          onChange={(e) => {
                            setEditUserInfo({
                              ...editUserInfo,
                              name: {
                                ...editUserInfo.name,
                                givenName: e.target.value,
                              },
                            });

                            setName({
                              familyName: user[schema].name.familyName,
                              givenName: user[schema].name.givenName,
                              formatted: user[schema].name.formatted,
                            });
                          }}
                          className={inputClasses}
                        />
                      </div>

                      <div className={divClasses}>
                        <Label htmlFor="sirname" className={labelClasses}>
                          sir Name
                        </Label>
                        <Input
                          type="text"
                          value={editUserInfo.name.familyName}
                          placeholder={user[schema].name.familyName}
                          onChange={(e) => {
                            setEditUserInfo({
                              ...editUserInfo,
                              name: {
                                ...editUserInfo.name,
                                familyName: e.target.value,
                              },
                            });
                            setName({
                              familyName: user[schema].name.familyName,
                              givenName: user[schema].name.givenName,
                              formatted: user[schema].name.formatted,
                            });
                          }}
                          className={inputClasses}
                        />
                      </div>

                      <div className={divClasses}>
                        <Label htmlFor="email" className={labelClasses}>
                          Email
                        </Label>
                        <Input
                          type="text"
                          value={editUserInfo.emails[0].value}
                          placeholder={user[schema].emails
                            .map((email) => `${email.value}`)
                            .join(",")} // Convert array to a strin
                          onChange={(e) =>
                            setEditUserInfo({
                              ...editUserInfo,
                              emails: [{ value: e.target.value }],
                            })
                          }
                          className={inputClasses}
                        />
                      </div>

                      <div className={divClasses}>
                        <Label
                          htmlFor="status"
                          className={`${labelClasses} gap-2`}
                        >
                          <span className="">Status</span>
                          {""}(
                          <span className=" text-base normal-case italic text-neutral-900 underline underline-offset-2 dark:text-neutral-700">
                            {user[schema].active ? "active" : "inactive"}
                          </span>
                          )
                        </Label>
                        <div className={divClasses}>
                          <div className="flex flex-col items-center gap-1">
                            <div className={innerDivClasses}>
                              <ListTodo className="h-7 w-14 text-neutral-600 dark:text-neutral-600" />
                              <Label
                                htmlFor="active"
                                className="text-sm font-bold text-neutral-800 dark:text-neutral-800"
                              >
                                Active?
                              </Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center ">
                                <Input
                                  type="checkbox"
                                  id="active"
                                  name="active"
                                  value="active"
                                  checked={yesChecked}
                                  className={checkboxClasses}
                                  onChange={userActiveStatus}
                                />
                                <Label
                                  htmlFor="active"
                                  className="ml-2 text-sm text-white dark:text-white"
                                >
                                  Yes
                                </Label>
                              </div>
                              <div className="flex items-center">
                                <Input
                                  type="checkbox"
                                  id="inactive"
                                  name="inactive"
                                  value="inactive"
                                  checked={noChecked}
                                  className={checkboxClasses}
                                  onChange={userActiveStatus}
                                />
                                <Label
                                  htmlFor="inactive"
                                  className="ml-2 text-sm text-white dark:text-white"
                                >
                                  No
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={divClasses}>
                        <Label htmlFor="action" className={labelClasses}>
                          Action
                        </Label>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            type="submit"
                            className="h-7 bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:text-white"
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            onClick={cancelEdit}
                            className="h-7 bg-red-600 text-white hover:bg-red-600 dark:bg-red-600 dark:text-white"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </>
            ))}
        </section>

        <section id="table">
          <table className="table table-pin-rows table-pin-cols table-md Xll:table-lg">
            <thead className="rounded-lg text-xl font-bold text-slate-500 dark:text-white">
              {!edit && (
                <tr className="">
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              )}
            </thead>

            <tbody className="text-neutral-800 ">
              {props.users &&
                props.users.map((user) => (
                  <>
                    {editingUserId !== user.id && (
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
                        <td>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              className="h-7 bg-pink-500 text-white hover:border-gray-300 hover:bg-pink-700 hover:text-white dark:bg-pink-500"
                              onClick={() => handleEdit(user.id)}
                            >
                              Edit
                            </Button>
                            <DeleteButton
                              label="Delete"
                              isPending={false}
                              itemName={`${user[schema].userName}`}
                              onDelete={() => deleteUser(user.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default UpdatedUserInfo;
