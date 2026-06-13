export interface IUser{
    id:string;
    email:string;
    username: string;
}

export interface IAuthState{
    user: IUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string, username: string) => Promise<boolean>;
    logout: () => Promise<void>;
    setUser:  (user: IUser | null) => void;
    hydrate: () => void;
    isHydrating: boolean;
}