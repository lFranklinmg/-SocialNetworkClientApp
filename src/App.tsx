import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Header } from 'semantic-ui-react';
import List from 'semantic-ui-react/dist/commonjs/elements/List';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';

function App() {

  const[activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get('https://localhost:7175/Activities').then(response => {
      setActivities(response.data);
    })
  },[])

  return (
    <div className="App">
      <Header as='h2' icon='users' content='Social Network'/>
      
       <List>
        {activities.map((act: any) => (
          <li key={act.id}>
            {act.title}
          </li>
        ))}
       </List>
       <Button content='test' />

    </div>
  );
}

export default App;
