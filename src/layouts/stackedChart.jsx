import PropTypes from 'prop-types';
import React from 'react';

import {
    Grid,
} from 'semantic-ui-react';

import {
    BarChart,
    LineChart,
} from '../components';

export default function StackedChart({ data }) {
    return (
        <Grid>
            <Grid.Row>
                <LineChart label={data.perDay.label} data={data.perDay.data} color={data.perDay.color} />
            </Grid.Row>
            <Grid.Row>
                <BarChart label={data.cummulative.label} data={data.cummulative.data} color={data.cummulative.color} />
            </Grid.Row>
        </Grid>
    );
}

StackedChart.propTypes = {
    data: PropTypes.shape({
        perDay: PropTypes.shape({
            label: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
            data: PropTypes.arrayOf(
                PropTypes.shape({
                    x: PropTypes.string.isRequired,
                    y: PropTypes.number.isRequired,
                }).isRequired,
            ).isRequired,
        }).isRequired,
        cummulative: PropTypes.shape({
            label: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
            data: PropTypes.arrayOf(
                PropTypes.shape({
                    x: PropTypes.string.isRequired,
                    y: PropTypes.number.isRequired,
                }).isRequired,
            ).isRequired,
        }).isRequired,
    }).isRequired,
};
