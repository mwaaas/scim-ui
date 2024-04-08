import { User } from "lucide-react";

interface UserIconProps{
  className?: string;
}

export default function UserIcon(props:UserIconProps) {
  return <User className={props.className} />;
}
