import { makeAutoObservable, reaction, runInAction } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore{
    error: ServerError | null = null;
    token: string | null = localStorage.getItem('jwt');
    appLoaded: boolean = false;

    constructor(){
        makeAutoObservable(this);

        //Monitora o Token e reage as mudanças nele quando Observable changes nao qnd setamos o token!
        reaction(
            () => this.token,
            token => {
                if (token){
                    localStorage.setItem('jwt', token);
                }else{
                    localStorage.removeItem('jwt');
                }
            }
        )
    }

    setServerError(error: ServerError){
        this.error = error;
    }

    setToken = (token: string | null) =>{
        //if (token) localStorage.setItem('jwt', token);
        this.token = token
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }


}