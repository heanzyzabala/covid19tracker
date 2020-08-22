import PropTypes from 'prop-types';
import React from 'react';
import { Line } from 'react-chartjs-2';

export default function LineChart({ label, data, color }) {
    const colors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)',
    };
    const d = {
        labels: [],
        datasets: [
            {
                label,
                data,
                lineTension: 0,
                borderColor: colors[color],
                fill: false,
                pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                pointBorderColor: 'rgba(0, 0, 0, 0)',
            },
        ],
    };
    const opts = {
        scales: {
            xAxes: [
                {
                    type: 'time',
                    distribution: 'linear',
                    time: {
                        unit: 'month',
                    },
                },
            ],
        },
    };

    return <Line data={d} options={opts} />;
}

LineChart.propTypes = {
    label: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    data: PropTypes.arrayOf.isRequired,
};
