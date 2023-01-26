import React from 'react';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props{
    activities: Activity[],
    selectActivity: (id: string) => void;
    deleteActivity: (id: string) => void;
    
}

export default function ActivityList(props: Props){
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
                                <Button onClick={() => props.deleteActivity(xyz.id)} floated='right' content='Delete' color='red'/>
                                <Label basic content={xyz.category}/>
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
                
            </Item.Group>
        </Segment>
    )
}