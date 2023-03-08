import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import {v4 as uuid} from 'uuid';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';

export default observer(function ActivityForm(){

    const{activityStore} = useStore();
    const{updateActivity, createActivity, selectedActivity, loading, loadActivity, loadingInitial} = activityStore;

    const{id} = useParams();
    const navegate = useNavigate();

    const[activity,setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: null,
        city: '',
        venue: ''
    });

    const validationSchema = Yup.object({
        title:          Yup.string().required('The Post title is required!'),
        description:    Yup.string().required('The description is required'),
        category:       Yup.string().required('The category is required'),
        date:           Yup.string().required('The date is required'),
        venue:          Yup.string().required('The venue is required'),
        city:           Yup.string().required('The City is required'),
    })

    useEffect(()=>{
        if (id) loadActivity(id).then(activity => setActivity(activity!))
    },[id, loadActivity])

    //React Hook
    //const [activity, setActivty] = useState(inialState);

    function handleFormSubmit(activity: Activity){
        if(!activity.id){
            activity.id = uuid();
            createActivity(activity).then(()=> navegate(`/activities/${activity.id}`))
        }else{
            updateActivity(activity).then(()=> navegate(`/activities/${activity.id}`))
        }
    }

    /* functio={handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        const {name, value} = event.target;
        setActivity({...activity, [name]:value})
    } */

    if (loadingInitial) return <LoadingComponent content='Loading Post...'/>

    return(
        <Segment clearing>
            <Header content='Details' sub color='teal' />
            <Formik validationSchema={validationSchema} enableReinitialize initialValues={activity} onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty })=>(
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput    placeholder='Title'        name='title' />
                        <MyTextArea     placeholder='Description'  name='description' rows={3}/>
                        <MySelectInput  placeholder='Category'     name='category' options={categoryOptions}  />
                        <MyDateInput    placeholderText='Date'     name='date' showTimeSelect timeCaption='time' dateFormat={'MMMM d, yyyy h:mm aa'}/>
                        
                        <Header content='Location' sub color='teal'/>
                        <MyTextInput    placeholder='City'         name='city'/>
                        <MyTextInput    placeholder='Venue'        name='venue'/>
                        <Button disabled={isSubmitting || !dirty || !isValid} loading={loading} floated='right' positive type='submit' content='submit' />
                        <Button as={Link} to='/activities' floated='right' positive type='button' content='Cancel' />
                    </Form>
                )}
            </Formik> 
        </Segment>
    )
})