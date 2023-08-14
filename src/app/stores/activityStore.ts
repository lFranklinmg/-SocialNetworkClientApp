import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import {v4 as uuid} from 'uuid';
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";

export default class ActivityStore{
    //activities: Activity[] = [];
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    //Computed Property
    get activitiesByDate(){
        return Array.from(this.activityRegistry.values()).sort((a,b)=>(a.date!.getTime() - b.date!.getTime()));
    }

    //REDUCE Computed function 
    get groupedActivities(){
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) =>{
                //const date = activity.date; //date for each element = Key object
                //const date = activity.date!.toISOString().split('T')[0];
                const date = format(activity.date!, 'dd MMM yyyy').split('T')[0];
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key: string]: Activity[]})
        )
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);

        try{
            const activities = await agent.Activities.list();
                activities.forEach(activity =>{
                    this.setActivity(activity);
                
                })
                this.setLoadingInitial(false);

        } catch(error){
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id: string)=>{
        this.setLoadingInitial(true);
        let activity = this.getActivity(id);

        if (activity){
            this.selectedActivity = activity;
            this.setLoadingInitial(false);
            return activity;
        } 
        else{
            this.setLoadingInitial(true);
            try{
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(()=> this.selectedActivity = activity);
                this.setLoadingInitial(false);
                return activity;
            }catch(error){
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setActivity = (activity: Activity)=>{
       
        const user = store.userStore.user;
        //console.log(user?.userName);
        //Check if is authenticated
        if (user) {
            activity.isGoing = activity.attendees!.some(
                a => a.userName === user.userName
            )
            //console.log(activity.hostUsername);
            activity.isHost = activity.hostUserName === user.userName;
            activity.host = activity.attendees?.find(x => x.userName === activity.hostUserName);
        }
        //activity.date = activity.date.split('T')[0];
        //this.activities.push(item);
        //this.activityRegistry.set(activity.id, activity);
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string)=>{
        return this.activityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean)=>{
        this.loadingInitial = state;
    }

    findActivity = (id: string)=>{
        //let activity = this.activities.find(x => x.id === id);
        let activityByDate = this.activitiesByDate.find(x => x.id === id);
        console.log("Find ID " + this.selectedActivity?.id);
        return activityByDate

    }

    createActivity = async (activity: ActivityFormValues)=>{
        //this.loading = true;
        //activity.id = uuid();
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        
        try{
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUserName = user!.userName;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(()=>{
                //this.activities.push(activity);
                //this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = newActivity;
                //this.selectedActivity = activity
                //this.editMode = false;
                //this.loading = false;
            
            })

        }catch(error){
            console.log(error);
      
        }

    }

    updateActivity = async (activity: ActivityFormValues) =>{
        //this.loading = true;

        try{
            await agent.Activities.update(activity);
            runInAction(()=>{
                if (activity.id){
                    let updateActivity = {...this.getActivity(activity.id),...activity}
                    this.activityRegistry.set(activity.id, updateActivity as Activity);
                    this.selectedActivity = updateActivity as Activity;
                }
              
                //this.activities.filter(x => x.id !== activity.id);
                //this.activities.push(activity);
                //this.activityRegistry.set(activity.id, activity);

                  //Outra forma de fazer - Cria novo Array
                //this.activities = [...this.activities.filter(x => x.id !== activity.id), activity];
                //this.activities.push(activity);

                //this.selectedActivity = activity;
                //this.editMode = false;
                //this.loading = false;
            })

        }catch(error){
            console.log(error);
        }
    }

    deleteActivity = async (id: string) =>{
        this.loading = true;
        
        try{
            await agent.Activities.delete(id);
            runInAction(()=>{
                //this.activities.filter(x => x.id === id);
                //this.activities.push();
                //this.activities = [...this.activities.filter(x => x.id !== id)];
                this.activityRegistry.delete(id);
                this.loading = false;
                //if(this.selectedActivity?.id === id) this.cancelSelectedActivity();
                //this.cancelSelectedActivity();
            })
            
        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.loading = false;
            })
        }

    }

    updateAttendance = async () =>{
        const user = store.userStore.user;
        this.loading = true;
        try{
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(()=>{
                if(this.selectedActivity?.isGoing){
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(a => a.userName !== user?.userName);
                    this.selectedActivity.isGoing = false;
                }
                else{
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
            })
        }catch(error){
            console.log(error);
        }finally{
            runInAction(() => this.loading = false);
        }
    }

    cancelActivityToggle = async () => {
        this.loading = true;
        console.log(`cancelar activity!`);
        try{
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(()=>{
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })

        }catch(error){
            console.log(error);
        }finally{
            runInAction(()=> this.loading = false);
        }
         
    }

    updateAttendeeFollowing = (username: string) => {
        this.activityRegistry.forEach(activity => {
            activity.attendees.forEach(attendee => {
                if(attendee.userName == username){
                    attendee.following ? attendee.followingCount -- : attendee.followersCount ++;
                    attendee.following = !attendee.following;
                }
            })
        })

    }

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

}
