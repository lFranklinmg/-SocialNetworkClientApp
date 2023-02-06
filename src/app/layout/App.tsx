import React, { useEffect } from 'react';
import { Button, Container } from 'semantic-ui-react';
import Navbar from './Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {

  const {activityStore} = useStore();

  //const[activities, setActivities] = useState<Activity[]>([]);
  //const[selectedActivity, SetSelectedActivity] = useState<Activity | undefined>(undefined);
  //const[editMode, setEditMode] = useState(false);
  //const[submitting, setSubmitting] = useState(false);

  useEffect(() => {
    activityStore.loadActivities();
  },[activityStore])

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

  if (activityStore.loadingInitial) return <LoadingComponent content='Loading App' inverted={false} />

  return (
    <>
      <Navbar />
      <Container style={{marginTop: '8em'}}>
        <ActivityDashboard 
        />
      </Container>
    </>
  );
}

export default observer(App);
