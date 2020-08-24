import PropTypes from 'prop-types';
import React from 'react';

import {
    Segment,
    Header,
    Statistic,
} from 'semantic-ui-react';

export default function StatisticSegment({ data }) {
    let footer;
    if (data.footer) {
        footer = (
            <Statistic.Label>
                {data.footer}
            </Statistic.Label>
        );
    }
    return (
        <Segment>
            <Statistic color={data.color} size={data.size}>
                <Header>
                    {data.header}
                </Header>
                <Statistic.Value>
                    {data.content}
                </Statistic.Value>
                {footer}
            </Statistic>
        </Segment>
    );
}

StatisticSegment.propTypes = {
    data: PropTypes.shape({
        header: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        footer: PropTypes.string,
        color: PropTypes.string.isRequired,
        size: PropTypes.string.isRequired,

    }).isRequired,
};
