import React from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';

interface Props{
    openForm: () => void;
}

export default function Navbar(props: Props){
    return(
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src ="/assets/logo.png" alt="logo" style={{marginRight:10}}/>
                    Social Network
                </Menu.Item>
                <Menu.Item name='Posts' />
                <Menu.Item>
                    <Button onClick={props.openForm} positive content='Create a Post'/>
                </Menu.Item>
            </Container>
        </Menu>

    )
}