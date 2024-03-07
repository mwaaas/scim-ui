import {string,object} from "zod";

const envSchema=object({
    SCIM_TOKEN:string().min(1),
    BASE_URL:string().min(1)
});
export const env = envSchema.parse(process.env)