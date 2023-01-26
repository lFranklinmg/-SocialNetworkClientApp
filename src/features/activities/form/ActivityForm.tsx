import React, { ChangeEvent, useState } from 'react';
import { Button, Form, HtmlInputrops, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props {
    activity: Activity | undefined;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
}

export default function ActivityForm(props: Props){

    const inialState = props.activity ?? {
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
        props.createOrEdit(activity);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        const {name, value} = event.target;
        setActivty({...activity, [name]:value})

    }

    return(
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input     placeholder='Title'         value={activity.title}          name='title'        onChange={handleInputChange}/>
                <Form.TextArea  placeholder='Description'   value={activity.description}    name='description'  onChange={handleInputChange} />
                <Form.Input     placeholder='Category'      value={activity.category}       name='category'     onChange={handleInputChange} />
                <Form.Input     placeholder='Date'          value={activity.date}           name='date'         onChange={handleInputChange} />
                <Form.Input     placeholder='City'          value={activity.city}           name='city'         onChange={handleInputChange} />
                <Form.Input     placeholder='Venue'         value={activity.venue}          name='venue'        onChange={handleInputChange} />
                <Button floated='right' positive type='submit' content='submit' />
                <Button onClick={props.closeForm} floated='right' positive type='button' content='Cancel' />
            </Form>
        </Segment>
    )
}