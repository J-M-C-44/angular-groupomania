import { Comment } from '../../shared/models/comment.model';
export interface Post {
    id : number;
    userId : number;
    text : string;
    imageUrl: string;
    createdTime: string;
    modifiedTime:string
}

export interface PostExtended extends Post {
    nbLikes? : number;
    isLiked? : boolean;
    likeId? : number
    nbComments?: number;
    comments?: Comment[];
    commentsShowed? : boolean;
}
