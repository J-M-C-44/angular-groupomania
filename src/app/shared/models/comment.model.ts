export interface Comment {
    id : number;
    userId : number;
    postId : number;
    text : string;
    imageUrl: string;
    createdTime: string;
    modifiedTime:string
}