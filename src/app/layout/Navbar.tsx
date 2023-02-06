import React from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';
import { useStore } from '../stores/store';

export default function Navbar(){

    const{activityStore} = useStore();

    return(
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src ="/assets/logo.png" alt="logo" style={{marginRight:10}}/>
                    Social Network
                </Menu.Item>
                <Menu.Item name='Posts' />
                <Menu.Item>
                    <Button onClick={()=>activityStore.openForm()} positive content='Create a Post'/>
                </Menu.Item>
            </Container>
        </Menu>

    )
}