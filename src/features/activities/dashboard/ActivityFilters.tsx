import React from 'react'
import { Calendar } from 'react-calendar'
import { Header, Menu } from 'semantic-ui-react'

export default function ActivityFilters(){

    return(
        <>
            <Menu vertical size='large' style={{width: '100%', marginTop: 25}}>
                <Header icon='filter' attached color='teal' content='Filters'/>
                <Menu.Item content='All Posts'/>
                <Menu.Item content="I´m going"/>
                <Menu.Item content='Hosting'/>
            </Menu>

            <Header />

            <Calendar />

        </>
    )

}