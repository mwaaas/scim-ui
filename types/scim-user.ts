interface Name {
    formatted: string,
    familyName: string,
    givenName: string
}

export interface ListUser {
    id: string;
    meta: {
        created: string;
        lastModified: string;
        location: string;
        resourceType: string;
    };
    "urn:ietf:params:scim:schemas:core:2.0:User": {
        userName: string;
        name: Name
        active: boolean;
        emails: {
            value: string;
            type: string;
            primary: boolean;
        }[];
    };
    schemas: string[];
}

// src/types/UserTypes.ts
export interface CreateUser {
    schemas: string[];
    externalId: string;
    name: {
        formatted: string;
        familyName: string;
        givenName: string;
    };
    active: boolean|undefined;
    emails: {
        value: string;
    }[];
    userName: string;
}

