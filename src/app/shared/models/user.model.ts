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

/**
 * Sert pour détenir l'ensemble des données liées aus users. Servira de référence pour l'affichage de la liste des users 
 */
export interface UserExtended extends User {
    fullName: string;
}