import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuid} from 'uuid';

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
        return Array.from(this.activityRegistry.values()).sort((a,b)=>(Date.parse(b.date) - Date.parse(a.date)));
    }

    //REDUCE Computed function 
    get groupedActivities(){
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) =>{
                const date = activity.date; //date for each element = Key object
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
                    //activity.date = activity.date.split('T')[0];
                    //this.activities.push(item);
                    //this.activityRegistry.set(activity.id, activity);
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
        activity.date = activity.date.split('T')[0];
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

    createActivity = async (activity: Activity)=>{
        this.loading = true;
        activity.id = uuid();
        
        try{
            await agent.Activities.create(activity);
            runInAction(()=>{
                //this.activities.push(activity);
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                //this.selectedActivity = activity
                this.editMode = false;
                this.loading = false;
            
            })

        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.loading = false;
            })
        }

    }

    updateActivity = async (activity: Activity) =>{
        this.loading = true;

        try{
            await agent.Activities.update(activity);
            runInAction(()=>{
              
                //this.activities.filter(x => x.id !== activity.id);
                //this.activities.push(activity);
                this.activityRegistry.set(activity.id, activity);

                  //Outra forma de fazer - Cria novo Array
                //this.activities = [...this.activities.filter(x => x.id !== activity.id), activity];
                //this.activities.push(activity);

                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })

        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.loading = false;
            })
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

     /*
    selectActivity = (id: string) =>{
        //var result = this.findActivity(id);
        //this.selectedActivity = result;
        //this.selectedActivity = this.activities.find(x => x.id == id);
        this.selectedActivity = this.activityRegistry.get(id);
        
    }

    cancelSelectedActivity = ()=>{
        this.selectedActivity = undefined;
    }

    openForm = (id?: string)=>{
        //console.log("Id do item:" + id);
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm = () =>{
        this.editMode = false;
    }*/
}
