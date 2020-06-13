import React from 'react'
import {
    Segment,
    Header,
    Icon,
    Container,
    Grid,
    Divider,
    Dimmer,
    Loader,
    Button,
    Form,
  } from "semantic-ui-react";

export const Configuraciones = () => {
    return (
        <Container style={{ marginTop: "7em" }} textAlign="center">
        <Header as="h1" inverted textAlign="center">
          Buscar Facturas
        </Header>
        <Grid columns='equal'>
            <Grid.Column>

            </Grid.Column>
            <Grid.Column width={12}>
            <Segment>
            <Form>
                <Form.Group widths='equal'>
                    <Form.Input fluid label='First name' placeholder='First name' />
                    <Form.Input fluid label='Last name' placeholder='Last name' />
                </Form.Group>
            </Form>
            </Segment>
            </Grid.Column>
            <Grid.Column>

            </Grid.Column>
        </Grid>

        </Container>
    )
}
