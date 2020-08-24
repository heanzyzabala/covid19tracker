import React from 'react';

import {
    Container,
    Grid,
    Header,
    Segment,
    List,
    Button,
} from 'semantic-ui-react';

export default function Footer() {
    function handleOnClick(event) {
        window.location.href = 'mailto:heanzy.zabala@gmail.com';
        event.preventDefault();
    }
    return (
        <Segment inverted vertical style={{ padding: '8em 0em' }}>
            <Container>
                <Grid divided inverted stackable columns={2}>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Header inverted as="h4" content="Links" />
                            <List link inverted>
                                <List.Item as="a" href="https://heanzyzabala.com"> Personal Site</List.Item>
                                <List.Item as="a" href="https://github.com/heanzyzabala"> Github </List.Item>
                                <List.Item as="a" href="https://www.linkedin.com/in/heanzyzabala">Linkedin</List.Item>
                            </List>
                            <List.Item> © 2020 Heanzy Zabala </List.Item>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Header inverted as="h4" content="Contact Me" />
                            <List link inverted>
                                <Button as="a" size="tiny" content="Mail" icon="mail" onClick={handleOnClick} />
                            </List>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </Segment>
    );
}
