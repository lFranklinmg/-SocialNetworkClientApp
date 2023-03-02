import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';
import { useStore } from '../stores/store';

export default function Navbar(){

    return(
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' header>
                    <img src ="/assets/logo.png" alt="logo" style={{marginRight:10}}/>
                    Nostrochef
                </Menu.Item>
                <Menu.Item as={NavLink} to='/activities/' name='Posts' />
                <Menu.Item as={NavLink} to='/errors/' name='Errors' />
                <Menu.Item>
                    <Button as={NavLink} to='/createActivity'  positive content='Create a Post'/>
                </Menu.Item>
            </Container>
        </Menu>

    )
}