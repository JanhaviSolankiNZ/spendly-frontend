export interface IUser{
    id:string;
    email:string;
    username: string;
    plan:     "free" | "pro";
    isPro:    boolean;
}

export interface IAuthState{
    user: IUser | null;
    isAuthLoading: boolean;
    authStatus: "loading" | "authenticated" | "unauthenticated";
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string, username: string) => Promise<boolean>;
    logout: () => Promise<void>;
    setUser:  (user: IUser | null) => void;
    hydrate: () => void;
    isHydrating: boolean;
}