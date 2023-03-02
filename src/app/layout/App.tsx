import React, { useEffect } from 'react';
import { Button, Container } from 'semantic-ui-react';
import Navbar from './Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation,  } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';

function App() {

  const {activityStore} = useStore();
  const location = useLocation();

   return (
    <>
    <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
    {location.pathname === '/' ? <HomePage/> : (
      <>
           <Navbar />
           <Container style={{marginTop: '8em'}}>
             <Outlet />
           </Container>
      </>
    )};
    </>
  );
}

export default observer(App);

  //const[activities, setActivities] = useState<Activity[]>([]);
  //const[selectedActivity, SetSelectedActivity] = useState<Activity | undefined>(undefined);
  //const[editMode, setEditMode] = useState(false);
  //const[submitting, setSubmitting] = useState(false);

   //function handleSelectActivity(id: string){
  //  SetSelectedActivity(activities.find(x => x.id == id));
  //}

  /*function handleCreateOrEditActivity(activity: Activity){
    setSubmitting(true);
    
    if(activity.id){
      agent.Activities.update(activity).then(()=>  {
        setActivities([...activities.filter(x => x.id !== activity.id), activity]);
        SetSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    } 
    else{
      activity.id = uuid();
      agent.Activities.create(activity).then(()=>{
        setActivities([...activities, activity]);
        SetSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    }
  }
  */
  /*
  function handleDeleteActivity(id: string){
    setSubmitting(true);
    agent.Activities.delete(id).then(()=>{
      setActivities([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    })
  }
  */

 
