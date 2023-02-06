import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useState } from 'react';
import { Button, Form, HtmlInputrops, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';

export default observer(function ActivityForm(){

    const{activityStore} = useStore();
    const{updateActivity, createActivity, selectedActivity, loading, closeForm} = activityStore;

    const inialState = selectedActivity ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    }

    //React Hook
    const [activity, setActivty] = useState(inialState);

    function handleSubmit(){
        activity.id ? updateActivity(activity) : createActivity(activity);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        const {name, value} = event.target;
        setActivty({...activity, [name]:value})

    }

    return(
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title'  value={activity.title} name='title' onChange={handleInputChange}/>
                <Form.TextArea  placeholder='Description'   value={activity.description} name='description'  onChange={handleInputChange} />
                <Form.Input placeholder='Category' value={activity.category}  name='category' onChange={handleInputChange} />
                <Form.Input type = 'date' placeholder='Date'  value={activity.date} name='date'  onChange={handleInputChange} />
                <Form.Input placeholder='City' value={activity.city}  name='city'  onChange={handleInputChange} />
                <Form.Input placeholder='Venue' value={activity.venue}  name='venue'  onChange={handleInputChange} />
                <Button loading={loading} floated='right' positive type='submit' content='submit' />
                <Button onClick={closeForm} floated='right' positive type='button' content='Cancel' />
            </Form>
        </Segment>
    )
})