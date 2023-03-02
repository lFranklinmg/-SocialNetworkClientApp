import React from "react";
import { Link } from "react-router-dom";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

export default function NotFound(){
    return(
        <Segment placeholder>
            <Header icon>
                <Icon name='search' />
                Não encontrado!
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/activities'>
                    Voltar
                </Button>
            </Segment.Inline>
        </Segment>
    )
}