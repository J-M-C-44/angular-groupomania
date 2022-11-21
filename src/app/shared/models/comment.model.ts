export interface Comment {
    id : number;
    userId : number;
    postId : number;
    text : string;
    imageUrl: string | null;
    createdTime: string;
    modifiedTime:string
}