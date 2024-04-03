import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "scim-ui",
  description: "scim-ui for user management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="">
      <body className=" bg-appBg font-bodyRoboto">
        <main className="w-full px-4">
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </main>
      </body>
    </html>
  );
}
