"use client";

import { Session, User } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  Cloud,
  CreditCard,
  LifeBuoy,
  LogIn,
  LogOut,
  Router,
  Settings,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { userProfile } from "@/public/assets/page";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { splitName } from "@/utils/functions/split-name";
import UserIcon from "../icons/userDropdown/user";

interface UserDropDownProps {
  Session?: Session | null;
}

const UserDropDown = ({ Session }: UserDropDownProps) => {
  const router = useRouter();
  const currentUser = Session?.user;
  //console.log('current user',currentUser)
  const userImage = !!currentUser?.image;
  const Name = currentUser?.name;
  const firstName = splitName(Name);
  const iconClasses = "mr-2 h-4 w-4";
  return (
    <div className="mx-auto block items-center">
      <DropdownMenu>
        {/* Avatar */}
        <DropdownMenuTrigger asChild>
          {currentUser ? (
            <div>
              {userImage ? (
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser?.image ?? ""} alt="@shadcn" />
                  <AvatarFallback>
                    <Image
                      className=" text-2xl font-bold"
                      src={userProfile}
                      alt="user profile icon"
                    />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="flex items-center gap-2">
                  {firstName ? (
                    <h4 className="flex items-center gap-1 text-2xl italic text-primaryRed ">
                      <span className="text-lg font-bold text-white">Hi</span>!
                      <p className="text-xl font-bold text-white">
                        {firstName}
                      </p>
                    </h4>
                  ) : (
                    ""
                  )}

                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <Image
                        className=" text-2xl font-bold"
                        src={userProfile}
                        alt="user profile icon"
                      />
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  <Image
                    className=" text-2xl font-bold"
                    src={userProfile}
                    alt="user profile icon"
                  />
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {Session && (
              <DropdownMenuItem>
                <UserIcon className={iconClasses} />
                <Link
                  href={`/profile/${currentUser?.id}`}
                  className="items-center justify-between"
                >
                  <p>Profile</p>
                  {/* <span className="badge badge-primary">New</span> */}
                </Link>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
            )}
            {Session && (
              <DropdownMenuItem
              //onClick={() => router.push("/billing")}
              >
                <CreditCard className={iconClasses} />
                <span>Billing</span>
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Settings className={iconClasses} />
              <span>Settings</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem onClick={signInWithGoogle}> */}
          {/* <Github className="w-4 h-4 mr-2" /> */}
          {/* <FontAwesomeIcon icon={faGoogle} className="w-4 h-4 mr-2"/> */}
          {/* <span>Google</span> */}
          {/* </DropdownMenuItem> */}
          <DropdownMenuItem>
            <LifeBuoy className={iconClasses} />
            <span>Support</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Cloud className={iconClasses} />
            <span>API</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {currentUser ? (
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className={iconClasses} />
              <span>Log out</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          ) : (
            <Link href="/signIn">
              <DropdownMenuItem>
                <LogIn className={iconClasses} />
                <span>LogIn</span>
                <DropdownMenuShortcut>⇧⌘In</DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default UserDropDown;
