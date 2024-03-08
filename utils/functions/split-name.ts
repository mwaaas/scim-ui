export function splitName(name:string | null | undefined):string|null|undefined{
    const spaceIndex = name?.indexOf(" ");
    const firstName = spaceIndex !== -1 ? name?.substring(0, spaceIndex) : name;
    return firstName;
}