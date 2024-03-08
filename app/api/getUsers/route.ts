import axiosInstance from "@/utils/axios";
import { NextRequest, NextResponse } from "next/server";
//import { NextApiRequest, NextApiResponse } from "next/types";

export async function GET(req: NextRequest, res: NextResponse) {
    if (req.method !== "GET") {
        // If the request method is not GET, return a 405 Method Not Allowed response
        res.headers.set("Allow", "GET");
        return NextResponse.json({ msg: `Method ${req.method} Not Allowed` }, { status: 405 })
    }
    try {
        const response = await axiosInstance.get('/Users');

        if (response.status !== 200) {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
        }
        //extract users from response
        const users = response.data.Resources
        //console.log('users',users)
        //send list of user as Api res
        return NextResponse.json(users, { status: 200 })

    } catch (error) {
        console.error("api getUsers error", error)
        return NextResponse.json({ msg: "Unable to fetch user" }, { status: 500 })
    }
}