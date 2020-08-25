import 'semantic-ui-css/semantic.min.css';

import React from 'react';

import {
    Segment,
} from 'semantic-ui-react';

import { Home } from './pages';
import { Footer } from './components';

function App() {
    return (
        <>
            <Segment basic style={{ backgroundColor: '#f6f6f6', marginBottom: '0em' }}>
                <Home />
            </Segment>
            <Footer />
        </>
    );
}

export default App;
