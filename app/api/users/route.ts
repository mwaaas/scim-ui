import axiosInstance from "@/utils/axios";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
    if (request.method !== "POST") {
        return NextResponse.json(
            { message: "Request not supported", },
            {
                status: 405, headers: { "Allow": "POST" }
            }
        )
    };
    try {
        const userData = await request.json()
        //console.log("creating user, userData:", userData)
        const response = await axiosInstance.post("/Users", userData);
        if (response.status !== 201) {
            throw new Error(`Axios error while creating user  ${response.statusText}`);
        }
        return NextResponse.json({ msg: "successfully created user" }, { status: 201 })
    } catch (err) {
        //console.log('Encountered Error:', err)
        // If the error is an instance of AxiosError, return only the headers and response objects
        if (err instanceof axios.AxiosError) {
            const { config, response } = err
            const adapter = config?.adapter
            const headers = config?.headers
            const timeout = config?.timeout
            return NextResponse.json(
                {
                    adapter: adapter,
                    timeout: timeout,
                    headers: headers,
                    response: response
                }
            )
        }
        return NextResponse.json({
            schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"],
            detail: "Unable to create User",
            status: 500,

        })
    }
}
