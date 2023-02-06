import { observer } from 'mobx-react-lite';
import React, {SyntheticEvent, useState} from 'react';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';

export default observer(function ActivityList(){

    const [target, setTarget] = useState('');

    const{activityStore} = useStore();
    const{selectActivity, deleteActivity, loading, activitiesByDate} = activityStore;

    function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement> , id:string){
        //console.log("Click" + e.currentTarget.name);
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }

    return(
        <Segment>
            <Item.Group divided>
                
                {activitiesByDate.map(xyz => (
                    
                    <Item id={xyz.id}>
                        <Item.Content>
                            <Item.Header as='a'>{xyz.title}</Item.Header>
                            <Item.Meta>{xyz.date}</Item.Meta>
                            <Item.Description>
                                <div>{xyz.description}</div>
                                <div>{xyz.city},{xyz.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button onClick={() => selectActivity(xyz.id)} floated='right' content='View' color='blue'/>
                                <Button name={xyz.id} loading={loading && target === xyz.id} onClick={(e) => handleActivityDelete(e, xyz.id)} floated='right' content='Delete' color='red'/>
                                <Label basic content={xyz.category}/>
                            </Item.Extra>
                        </Item.Content>
                    </Item>

                ))}

            </Item.Group>
        </Segment>
    )
})