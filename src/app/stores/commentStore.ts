import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatComment } from "../models/comment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";

export default class CommentStore{
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor(){
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if(store.activityStore.selectedActivity){
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('https://localhost:7175/chat?activityId=' + activityId, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();
            this.hubConnection.start().catch(error => console.log('Erro ao startar o Hub: ', error));

            this.hubConnection.on('LoadComments', (comments: ChatComment[])=>{
                runInAction(() => {
                    comments.forEach(comment =>{
                        comment.createdAt = new Date(comment.createdAt + 'Z');
                    })
                    this.comments = comments
                });
            })

            this.hubConnection.on('ReceiveComment',(comment: ChatComment) =>{
                runInAction(()=> {
                    comment.createdAt = new Date(comment.createdAt);
                    //this.comments.push(comment)
                    this.comments.unshift(comment);
                });
            })
        }
    }

    stopHubConnection = () =>{
        this.hubConnection?.stop().catch(error => console.log('Erro no Stop do ChatHub', error));
    }

    clearComments = () =>{
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: any) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try{
            await this.hubConnection?.invoke('SendComment', values);
        }catch(error){
            console.log(error);
        }

    }

}