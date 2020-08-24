import 'semantic-ui-css/semantic.min.css';

import React from 'react';

import {
    Segment,
} from 'semantic-ui-react';

import { Home } from './pages';

function App() {
    return (
        <>
            <Segment padded basic style={{ backgroundColor: '#f6f6f6' }}>
                <Home />
            </Segment>
        </>
    );
}

export default App;
