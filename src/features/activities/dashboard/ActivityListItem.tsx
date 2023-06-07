import { format } from "date-fns";
import React, { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import ActivityListItemAttendee from "./ActivityListItemAttendee";

interface Props{
    activity: Activity
}

export default function ActivityListItem({activity}: Props){
    
    const [target, setTarget] = useState('');

    const{activityStore} = useStore();
    const{deleteActivity, loading} = activityStore;

    function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement> , id:string){
        //console.log("Click" + e.currentTarget.name);
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }

    return(
        <Segment.Group>
            <Segment>
                {activity.isCancelled && 
                    <Label attached="top" color="red" content='Cancelled' style={{textAlign: 'center'}} />
                }
                <Item.Group>
                    <Item>
                        <Item.Image style={{marginBotton: 3}}  size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                 {activity.title}
                            </Item.Header>
                            <Item.Description>Hosted by {activity.host?.displayName}</Item.Description>
                            
                            {activity.isHost &&(
                                <Item.Description>
                                    <Label basic color="orange">
                                        You are hosting this activity
                                    </Label>
                                </Item.Description>
                            )}

                            {activity.isGoing && !activity.isHost && (
                                <Item.Description>
                                    <Label basic color="orange">
                                        You are going to this activity
                                    </Label>
                                </Item.Description>
                            )}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            
            <Segment>
                <span>
                    <Icon name='clock'/> { format(activity.date!, 'dd MMM yyyy h:mm aa')} &nbsp;
                    <Icon name='marker'/>{activity.venue}
                </span>
            </Segment>

            <Segment secondary>
                <ActivityListItemAttendee attendees={activity.attendees!} />
            </Segment>

            <Segment clearing>
                <span>{activity.description}</span>
                <Button as={Link} to={`/activities/${activity.id}`} color='teal' floated="right" content='View'/>
            </Segment>

        </Segment.Group>

    )
}