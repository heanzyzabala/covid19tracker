import React, { useState, useEffect } from 'react';

import getHistoryByCountry from '../api';
import { LineChart } from '../components';

export default function Daily() {
    const [data, setData] = useState({
        isLoading: true,
        cases: {
            cummulative: [],
            perDay: [],
        },
        deaths: {
            cummulative: [],
            perDay: [],
        },
        recoveries: {
            cummulative: [],
            perDay: [],
        },
    });

    function map(arr) {
        return Object.entries(arr).map(([k, v]) => ({ x: k, y: v }));
    }

    function mapDifference(arr) {
        let prev = 0;
        return Object.values(arr).map(({ x, y }) => {
            const diff = Math.abs(y - prev);
            prev = y;
            return { x, y: diff };
        });
    }

    useEffect(() => {
        async function fetchData() {
            const result = await getHistoryByCountry('Philippines');
            const { cases, deaths, recovered } = result.data.timeline;
            const cummulativeCases = map(cases);
            const cummulativeDeaths = map(deaths);
            const cummulativeRecoveries = map(recovered);
            setData({
                isLoading: false,
                cases: {
                    cummulative: cummulativeCases,
                    perDay: mapDifference(cummulativeCases),
                },
                deaths: {
                    cummulative: cummulativeDeaths,
                    perDay: mapDifference(cummulativeDeaths),
                },
                recoveries: {
                    cummulative: cummulativeRecoveries,
                    perDay: mapDifference(cummulativeRecoveries),
                },
            });
        }
        fetchData();
    }, []);

    return (
        <>
            <LineChart label="Case per day" data={data.cases.perDay} color="blue" />
            <LineChart label="New deaths per day" data={data.deaths.perDay} color="red" />
            <LineChart label="Recoveries per day" data={data.recoveries.perDay} color="green" />
        </>
    );
}
