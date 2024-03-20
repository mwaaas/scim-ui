"use client";
import { Button } from "@/components/ui/buttons/button";
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
import { CreateUser } from "@/types/scim-user";
import axios from "axios";
import { Asterisk, List, ListTodo, SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

// Define the type for your error object
type ErrorRecord = Record<string, string>;

const CreateUserForm = () => {
  // State to hold validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [salutation, setSalutation] = useState("");
  // track submission
  const [pending, setPending] = useState(false);
  const [back, setBack] = useState<boolean>(true);
  const [yesChecked, setYesChecked] = useState(false);
  const [noChecked, setNoChecked] = useState(false);
  const router = useRouter();
  const labelClasses = "text-neutral-800";
  const inputClasses = "input-info bg-white h-8 w-full";
  const divClasses = "max-w-Xs flex flex-col gap-2 items-start";
  const innerDivClasses = "flex items-center gap-1";
  const iconClasses = "text-red-400 h-4 w-4";
  const saveButtonClasses =
    "gap-4 sm:min-w-[200px] dark:bg-pink-600 dark:text-white font-bold bg-pink-600 hover:bg-pink-600 ";
  const checkboxClasses =
    "checkbox checkbox-xs border-emerald-700 checked:border-indigo-800 [--chkbg:theme(colors.indigo.600)] [--chkfg:orange]";
  const [userData, setUserData] = useState<CreateUser>({
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

  const userSchema = z.object({
    schemas: z.array(z.string().min(1)),
    externalId: z.string().min(1),
    name: z.object({
      formatted: z.string().min(1),
      familyName: z.string().min(1),
      givenName: z.string().min(1),
    }),
    active: z.boolean(),
    emails: z.array(z.object({ value: z.string() })),
    userName: z
      .string()
      .min(5, { message: "Must have at least 5 characters" })
      .refine(
        (value): boolean => {
          const { familyName, givenName } = userData.name;
          return value !== familyName && value !== givenName; // Return boolean value
        },
        { message: "Username cannot be equal to familyName or givenName" },
      ),
  });

  const salutations = [
    { label: "mr", value: "Mr." },
    { label: "ms", value: "Ms." },
    { label: "mrs", value: "Mrs." },
    { label: "dr", value: "Dr." },
    { label: "prof", value: "Prof." },
    { label: "eng", value: "Eng." },
  ];

  const trackPending = (): string => {
    if (pending) {
      return "Saving...";
    }
    return "Save";
  };
  function clearFields() {
    setUserData({
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
    setYesChecked(false);
    setNoChecked(false);
    setSalutation("");
  }

  // go back after submission
  const goBack = () => {
    router.push("/list/users");
  };

  function selectSalutation(salutation: string) {
    setSalutation(salutation);
  }

  // Function to handle the "Active" checkbox change
  const userActiveStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === "active") {
      setYesChecked(true);
      setNoChecked(false);
      setUserData((prevUserData) => ({
        ...prevUserData,
        active: true,
      }));
    } else if (value === "inactive") {
      setNoChecked(true);
      setYesChecked(false);
      setUserData((prevUserData) => ({
        ...prevUserData,
        active: false,
      }));
    } else {
      setYesChecked(false);
      setNoChecked(false);
      setUserData((prevUserData) => ({
        ...prevUserData,
        active: false,
      }));
    }
  };

  // Function to handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setPending(true);
      // Set the externalId field in userData before validation and submission
      setUserData((prevUserData) => ({
        ...prevUserData,
        externalId: prevUserData.userName,
        schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
        name: {
          ...prevUserData.name,
          formatted: `${salutation} ${prevUserData.name.givenName} ${prevUserData.name.familyName}`,
        },
      }));
      // Validate the user data
      const validatedUser = userSchema.parse(userData);
      //console.log("Valid Data",validatedUser);
      // Send the validated user data to the server using Axios
      const response = await axios.post("/api/users", validatedUser);

      // Check if the response status is not 200
      if (response.status !== 200) {
        // Handle the case where the response status is not 200
        // For example, setting an error state or showing a message
        console.error(
          "An unexpected status code was returned:",
          response.status,
        );
        setErrors({ general: "An error occurred. Please try again." });
      }

      // Handle a successful response here, e.g., show a success message, redirect, etc.
      console.log("User created successfully:", response.data);
      clearFields();
      setPending(false);
      setBack(true);
    } catch (error) {
      setBack(false);
      setPending(false);
      if (error instanceof z.ZodError) {
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
      } else if (axios.isAxiosError(error)) {
        // Handle errors returned from the server
        console.error("Server responded with an error:", error.response);

        // Check if the error response has a status code and message
        if (error.response && error.response.status !== 200) {
          // Here you can handle specific status codes as needed
          console.error("Error status code:", error.response.status);
          // Setting error state based on the server response
          setErrors({
            general: `A server error occurred: ${error.response.data.message || "Please try again later."}`,
          });
        }
      } else {
        // Handle other errors
        console.error("An unexpected error occurred:", error);
        setErrors({
          general: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };
  return (
    <div className="flex min-h-screen flex-col items-center bg-cyan-300 px-3 md:px-8">
      <h1 className="text-2xl font-bold text-neutral-800">Create User</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="my-4 flex flex-col items-center gap-3 mdLl:my-8 mdLl:gap-7">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:gap-8">
            <div className={divClasses}>
              <div className={innerDivClasses}>
                <Asterisk className={iconClasses} />
                <Label htmlFor="first-name" className={labelClasses}>
                  First Name
                </Label>
              </div>
              <Input
                required
                type="text"
                placeholder="eg. john"
                className={inputClasses}
                value={userData.name.givenName}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    name: { ...userData.name, givenName: e.target.value },
                  })
                }
              />
              {errors["name.givenName"] && (
                <span className="text-sm font-bold text-primaryRed">
                  {errors["name.givenName"]}
                </span>
              )}
            </div>

            <div className={divClasses}>
              <div className={innerDivClasses}>
                <Asterisk className={iconClasses} />
                <Label htmlFor="sir-name" className={labelClasses}>
                  Sir Name
                </Label>
              </div>
              <Input
                required
                type="text"
                className={inputClasses}
                placeholder="sirname"
                value={userData.name.familyName}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    name: { ...userData.name, familyName: e.target.value },
                  })
                }
              />
              {errors["name.familyName"] && (
                <span className="text-sm font-bold text-primaryRed">
                  {errors["name.familyName"]}
                </span>
              )}
            </div>

            <div className={divClasses}>
              <div className={innerDivClasses}>
                <Asterisk className={iconClasses} />
                <Label htmlFor="user-name" className={labelClasses}>
                  User Name
                </Label>
              </div>
              <Input
                required
                type="text"
                className={inputClasses}
                placeholder="username"
                value={userData.userName}
                onChange={(e) =>
                  setUserData({ ...userData, userName: e.target.value })
                }
              />
              {errors["userName"] && (
                <span className="text-sm font-bold text-primaryRed">
                  {errors["userName"]}
                </span>
              )}
            </div>

            <div className={divClasses}>
              <div className={innerDivClasses}>
                <Asterisk className={iconClasses} />
                <Label htmlFor="email" className={labelClasses}>
                  Email
                </Label>
              </div>
              <Input
                required
                type="text"
                className={inputClasses}
                placeholder="eg. john@gmail.com"
                value={userData.emails[0].value}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    emails: [{ value: e.target.value }],
                  })
                }
              />
              {errors["mails[0].value"] && (
                <span className="text-sm font-bold text-primaryRed">
                  {errors["emails[0].value"]}
                </span>
              )}
            </div>

            <div>
              <Select onValueChange={selectSalutation} value={salutation}>
                <SelectTrigger
                  name="salutation"
                  type="button"
                  className="h-9 bg-base-100 dark:bg-white"
                >
                  <SelectValue placeholder="select a title" />
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
              <div className="flex flex-col items-center gap-1">
                <div className={innerDivClasses}>
                  <ListTodo className="h-7 w-14 text-base-100 dark:text-white" />
                  <Label
                    htmlFor="active"
                    className="text-md font-bold text-neutral-700"
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
                      className="ml-2 text-sm text-neutral-800"
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
                      className="ml-2 text-sm text-neutral-800"
                    >
                      No
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={back ? "flex items-center gap-2 md:gap-4 lg:gap-8" : ""}
          >
            <Button
              type="submit"
              disabled={pending}
              className={
                pending
                  ? `ml-0 h-10 min-w-[120px] ${saveButtonClasses}`
                  : `ml-0 h-8 min-w-[100px] ${saveButtonClasses}`
              }
            >
              {pending && (
                <span className="loading loading-bars loading-lg text-neutral-800" />
              )}
              <SendHorizontal className="h-6 w-6 fill-white text-black" />
              <span className="text-white">{trackPending()}</span>
            </Button>

            {back && (
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                className="max-w-Xs sm:min-w-[200px] h-8 gap-2 bg-yellow-400 font-bold hover:bg-primary mdl:min-w-[200px] dark:bg-yellow-400"
              >
                <List className="text-700 h-7 w-12 fill-white" />
                <span className="text-sm normal-case text-white">Back</span>
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
