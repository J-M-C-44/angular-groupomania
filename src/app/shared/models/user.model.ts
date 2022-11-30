export interface User {
    id : number;
    email : string;
    lastname : string;
    firstname : string;
    fonction : string;
    role?: number;
    avatarUrl: string;
    createdTime: string;
    modifiedTime:string
}
export interface UserExtended extends User {
    fullName: string;
}