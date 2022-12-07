import { Comment } from '../../shared/models/comment.model';
export interface Post {
    id : number;
    userId : number;
    text : string;
    imageUrl: string | null;
    createdTime: string;
    modifiedTime:string
}

/**
 * Sert pour détenir l'ensemble des données liées aux posts. Servira de référence pour l'affichage de la liste des posts. 
 */
export interface PostExtended extends Post {
    nbLikes? : number;
    isLiked? : boolean;
    likeId? : number
    nbComments?: number;
    comments?: Comment[];
    commentsShowed? : boolean;
}

export interface PostDataRetreived {
    id: number,
    userId:number,
    text:string,
    imageUrl: string,
}

export interface PaginatedPostList {
    posts : Post[],
    currentPage: number,
    totalPages: number,
    firstPage: boolean,
    lastPage: boolean,
    totalRows: number
    }