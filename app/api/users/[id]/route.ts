import axiosInstance from "@/utils/axios";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface UpdateUserProps {
    params: { id: string };

};

type OperationsType = {
    op: string;
    path: string;
    value: any;
};

interface ScimPatch {
    schemas: string[];
    Operations: OperationsType[];
};

function validValue(value: string): string {
    if (value !== undefined && value !== null && value !== "") {
        return value
    }
    return `${value} not valid`
}

export async function PATCH(request: NextRequest, { params: { id } }: UpdateUserProps) {
    if (request.method !== "PATCH") {
        return NextResponse.json( { message: `${request.method} not supported` },{ status: 405, headers: { "Allow": "PATCH" }})
    };

    try{
        const editUserInfo = await request.json()
        console.log('Patch editUserInfo:', editUserInfo)
        const patchData: ScimPatch = {
            schemas: editUserInfo.schemas,
            Operations: []
        }

        for (const [key, value] of Object.entries(editUserInfo)) {
            if (key !== "schemas" && value !== null) {
                if (typeof value === "object" && !Array.isArray(value)) {
                    for (const [subKey, subValue] of Object.entries(value)) {
                        if (validValue(subValue)) {
                            patchData.Operations.push({
                                op: "replace",
                                path: `${key}.${subKey}`,
                                value: subValue
                            })
                        }
                    }
                } else if (Array.isArray(value)) {
                    if(key==="emails"){
                    value.forEach((email, index) => {
                        if (validValue(email.value)) {
                            patchData.Operations.push({
                                op: "replace",
                                path: `${key}`,
                                value: {"value":email.value,'primary':true}
                            })
                        }
                    })
                }
                } else {
                    patchData.Operations.push({
                        op: "replace",
                        path: `${key}`,
                        value: value
                    })
                }
            }
        }

        const response = await axiosInstance.patch(`/Users/${id}`, patchData)
        if (response.status !== 200) {
            throw new Error(`Axios error while updating user:  ${response.statusText}`)
        };
        console.log('Patch Data',patchData)
        console.log(`Axios response:, \n status: ${response.status} \n data: ${response.data} \n headers: ${response.headers}`);

        return NextResponse.json({ msg: "successfully updated user" }, { status: 200 })

    
    } catch (err) {
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
                    response: response?.data
                }
            )
        }
        return NextResponse.json({
            schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"],
            detail: "Unable to create User",
            status: 500,
        })
    };
}


export async function GET(request: NextRequest, { params: { id } }: UpdateUserProps) {
    if (request.method !== "GET") {
        return NextResponse.json({ msg: ` ${request.method} not supported` }, { status: 405 })
    }
    try {
        const response = await axiosInstance.get(`/Users/${id}`);
        if (response.status !== 200) {
            throw new Error(`Axios failed to fetch user: ${response.statusText}`);
        }
        //extract users from response
        const user = response.data.Resources
        //console.log('users',users)
        //send list of user as Api res
        return NextResponse.json(user, { status: 200 })
    } catch (error) {
        if (error instanceof axios.AxiosError) {
            const { config, response } = error
            const adapter = config?.adapter
            const headers = config?.headers
            const timeout = config?.timeout
            return NextResponse.json(
                {
                    adapter: adapter,
                    timeout: timeout,
                    headers: headers,
                    response: response?.data
                }
            )
        }
        return NextResponse.json({
            schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"],
            detail: "Unable to fetch User",
            status: 500,
        })
    }
}

export async function DELETE(request: NextRequest, { params: { id } }: UpdateUserProps) {
    if (request.method !== "DELETE") {
        return NextResponse.json(
            { message: `${request.method} not supported`, },
            {
                status: 405, headers: { "Allow": "DELETE" }
            }
        )
    };
    try {
        // Send DELETE request to the server to delete the user
        const response = await axiosInstance.delete(`/Users/${id}`);
        //console.log("response:",response)
        if (response.status !== 204) {
            throw new Error(`Failed to delete user: ${response.statusText}`);
        }

        return NextResponse.json({ msg: "successfully deleted user" }, { status: 204 })
    } catch (err) {
        //console.error('Encountered Error:', err);
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
                    response: response?.data
                }
            )
        }
        return NextResponse.json({
            schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"],
            detail: "Unable to delete User",
            status: 500,
        })
    }
}