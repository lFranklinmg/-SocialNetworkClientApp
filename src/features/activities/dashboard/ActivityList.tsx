import React, {SyntheticEvent, useState} from 'react';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props{
    activities: Activity[],
    selectActivity: (id: string) => void;
    deleteActivity: (id: string) => void;
    submitting: boolean;
    
}

export default function ActivityList(props: Props){

    const [target, setTarget] = useState('');

    function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement> , id:string){
        setTarget(e.currentTarget.name);
        props.deleteActivity(id);

    }

    return(
        <Segment>
            <Item.Group divided>
                
                {props.activities.map(xyz => (
                    <Item id={xyz.id}>
                        <Item.Content>
                            <Item.Header as='a'>{xyz.title}</Item.Header>
                            <Item.Meta>{xyz.description}</Item.Meta>
                            <Item.Description>
                                <div>{xyz.description}</div>
                                <div>{xyz.city},{xyz.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button onClick={() => props.selectActivity(xyz.id)} floated='right' content='View' color='blue'/>
                                <Button name={xyz.id} loading={props.submitting && target === xyz.id} onClick={(e) => handleActivityDelete(e, xyz.id)} floated='right' content='Delete' color='red'/>
                                <Label basic content={xyz.category}/>
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}

            </Item.Group>
        </Segment>
    )
}