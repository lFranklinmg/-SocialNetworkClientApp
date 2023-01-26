import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import Navbar from './Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';

function App() {

  const[activities, setActivities] = useState<Activity[]>([]);
  const[selectedActivity, SetSelectedActivity] = useState<Activity | undefined>(undefined);
  const[editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Activity[]>('https://localhost:7175/Activities').then(response => {
      setActivities(response.data);
    })
  },[])

  function handleSelectActivity(id: string){
    SetSelectedActivity(activities.find(x => x.id == id));
  }

  function handleCancelSelectActivity(){
    SetSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string){
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose(){
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity){
    activity.id ? setActivities([...activities.filter(x => x.id !== activity.id), activity]) : setActivities([...activities, {...activity, id: uuid()}]);
    setEditMode(false);
    SetSelectedActivity(activity);
  }

  function handleDeleteActivity(id: string){
    setActivities([...activities.filter(x => x.id !== id)]);
  }

  return (
    <>
      <Navbar openForm={handleFormOpen} />
      <Container style={{marginTop: '8em'}}>
        <ActivityDashboard activities={activities} 
        selectedActivity={selectedActivity}
        selectActivity={handleSelectActivity}
        cancelSelectActivity={handleCancelSelectActivity}
        editMode={editMode}
        openForm={handleFormOpen}
        closeForm={handleFormClose}
        createOrEdit={handleCreateOrEditActivity}
        deleteActivity={handleDeleteActivity}
        />
      </Container>
    </>
  );
}

export default App;
