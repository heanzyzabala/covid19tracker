import React, { useState, useEffect } from 'react';

import {
    Container,
    Segment,
    Header,
    Divider,
    Statistic,
    Grid,
    Loader,
} from 'semantic-ui-react';

import getHistoryByCountry from '../api';
import StackedChart from './stackedChart';

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

    function findHighest(arr) {
        return Object.values(arr).reduce(({ x, y }, cur) => {
            if (cur.y > y) {
                return cur;
            }
            return { x, y };
        });
    }

    function toWhole(i) {
        return Math.floor(i);
    }

    useEffect(() => {
        async function fetchData() {
            const result = await getHistoryByCountry('Philippines');
            const { cases, deaths, recovered } = result.data.timeline;
            const cummulativeCases = map(cases);
            const casesPerDay = mapDifference(cummulativeCases);
            const highestCasesInAday = findHighest(casesPerDay);
            const overallCases = cummulativeCases[cummulativeCases.length - 1];

            const cummulativeDeaths = map(deaths);
            const deathsPerDay = mapDifference(cummulativeDeaths);
            const highestDeathsInAday = findHighest(deathsPerDay);
            const overallDeaths = cummulativeDeaths[cummulativeDeaths.length - 1];

            const cummulativeRecoveries = map(recovered);
            const recoveriesPerDay = mapDifference(cummulativeRecoveries);
            const highestRecoveriesInAday = findHighest(recoveriesPerDay);
            const overallRecoveries = cummulativeRecoveries[cummulativeRecoveries.length - 1];

            setData({
                isLoading: false,
                cases: {
                    perDay: casesPerDay,
                    cummulative: cummulativeCases,
                    highestInAday: highestCasesInAday,
                    overall: overallCases,
                    averagePerDay: toWhole(overallCases.y / cummulativeCases.length),
                    latest: casesPerDay[casesPerDay.length - 1],
                },
                deaths: {
                    perDay: deathsPerDay,
                    cummulative: cummulativeDeaths,
                    highestInAday: highestDeathsInAday,
                    overall: overallDeaths,
                    averagePerDay: toWhole(overallDeaths.y / cummulativeDeaths.length),
                    latest: deathsPerDay[deathsPerDay.length - 1],
                },
                recoveries: {
                    perDay: mapDifference(cummulativeRecoveries),
                    cummulative: cummulativeRecoveries,
                    highestInAday: highestRecoveriesInAday,
                    overall: overallRecoveries,
                    averagePerDay: toWhole(overallRecoveries.y / cummulativeRecoveries.length),
                    latest: recoveriesPerDay[recoveriesPerDay.length - 1],
                },
            });
        }
        fetchData();
    }, []);

    if (data.isLoading) {
        return (
            <Container style={{ padding: '10rem' }}>
                <Loader active inline="centered">
                    <Header as="h2"> Loading... </Header>
                </Loader>
            </Container>
        );
    }

    return (
        <>
            <Container style={{ padding: '4rem 6rem' }}>
                <Header as="h1">
                    Daily Changes
                    <Header.Subheader>
                        as of August 22, 2020
                    </Header.Subheader>
                </Header>
                <Divider section />
                <Header as="h1">
                    Historical
                    <Header.Subheader>
                        from January 01, 2020 to August 22, 2020
                    </Header.Subheader>
                </Header>
                <Header as="h1" textAlign="center">
                    Cases
                </Header>
                <Segment basic>
                    <Grid divided padded stackable columns={4}>
                        <Grid.Column>
                            <Statistic size="small">
                                <Statistic.Value>
                                    {`+ ${data.cases.latest.y.toLocaleString()}`}
                                </Statistic.Value>
                                <Statistic.Label> Cases </Statistic.Label>
                                <Statistic.Label>
                                    {'as of '}
                                    {data.cases.latest.x}
                                </Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                        <Grid.Column>
                            <Statistic size="small">
                                <Statistic.Value>
                                    {data.cases.averagePerDay.toLocaleString()}
                                </Statistic.Value>
                                <Statistic.Label> Average Per Day </Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                        <Grid.Column>
                            <Statistic size="small">
                                <Statistic.Value>
                                    {data.cases.overall.y.toLocaleString()}
                                </Statistic.Value>
                                <Statistic.Label> Overall </Statistic.Label>
                                <Statistic.Label>
                                    {'as of '}
                                    {data.cases.overall.x}
                                </Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                        <Grid.Column>
                            <Statistic size="small">
                                <Statistic.Value>
                                    {data.cases.highestInAday.y.toLocaleString()}
                                </Statistic.Value>
                                <Statistic.Label> Highest Recorded </Statistic.Label>
                                <Statistic.Label>
                                    {'on '}
                                    {data.cases.highestInAday.x}
                                </Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                    </Grid>
                    <StackedChart data={
                        {
                            perDay: {
                                label: 'Cases Per Day',
                                color: 'blue',
                                data: data.cases.perDay,
                            },
                            cummulative: {
                                label: 'Cummulative Cases',
                                color: 'blue',
                                data: data.cases.cummulative,
                            },
                        }
                    }
                    />
                </Segment>
                <Divider section />
                <Header as="h1" textAlign="center">
                    Deaths
                </Header>
                <Segment basic>
                    <Grid divided padded stackable columns={4}>
                        <Grid.Column>
                            <Statistic size="small">
                                <Statistic.Value>
                                    {`+ ${data.deaths.latest.y.toLocaleString()}`}
                                </Statistic.Value>
                                <Statistic.Label> Deaths </Statistic.Label>
                                <Statistic.Label>
                                    {'as of '}
                                    {data.deaths.latest.x}
                                </Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                        <Grid.Column>
                            <Statistic size="small">
                                <Statistic.Value>
                                    {data.deaths.averagePerDay.toLocaleString()}
                                </Statistic.Value>
                                <Statistic.Label> Average Per Day </Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                        <Grid.Column>
                            <Statistic size="small">
                                <Statistic.Value>
                                    {data.deaths.overall.y.toLocaleString()}
                                </Statistic.Value>
                                <Statistic.Label> Overall </Statistic.Label>
                                <Statistic.Label>
                                    {'as of '}
                                    {data.deaths.overall.x}
                                </Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                        <Grid.Column>
                            <Statistic size="small">
                                <Statistic.Value>
                                    {data.deaths.highestInAday.y.toLocaleString()}
                                </Statistic.Value>
                                <Statistic.Label> Highest Recorded </Statistic.Label>
                                <Statistic.Label>
                                    {'on '}
                                    {data.deaths.highestInAday.x}
                                </Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                    </Grid>
                    <StackedChart data={
                        {
                            perDay: {
                                label: 'New Deaths Per Day',
                                color: 'red',
                                data: data.deaths.perDay,
                            },
                            cummulative: {
                                label: 'Cummulative Deaths',
                                color: 'red',
                                data: data.deaths.cummulative,
                            },
                        }
                    }
                    />
                </Segment>
                <Divider section />
                <Header as="h1" textAlign="center">
                    Recoveries
                </Header>
                <Segment basic>
                    <Grid divided padded stackable columns={4}>
                        <Grid.Column>
                            <Statistic size="small">
                                <Statistic.Value>
                                    {`+ ${data.recoveries.latest.y.toLocaleString()}`}
                                </Statistic.Value>
                                <Statistic.Label> Recoveries </Statistic.Label>
                                <Statistic.Label>
                                    {'as of '}
                                    {data.recoveries.latest.x}
                                </Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                        <Grid.Column>
                            <Statistic size="small">
                                <Statistic.Value>
                                    {data.recoveries.averagePerDay.toLocaleString()}
                                </Statistic.Value>
                                <Statistic.Label> Average Per Day </Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                        <Grid.Column>
                            <Statistic size="small">
                                <Statistic.Value>
                                    {data.recoveries.overall.y.toLocaleString()}
                                </Statistic.Value>
                                <Statistic.Label> Overall </Statistic.Label>
                                <Statistic.Label>
                                    {'as of '}
                                    {data.recoveries.overall.x}
                                </Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                        <Grid.Column>
                            <Statistic size="small">
                                <Statistic.Value>
                                    {data.recoveries.highestInAday.y.toLocaleString()}
                                </Statistic.Value>
                                <Statistic.Label> Highest Recorded </Statistic.Label>
                                <Statistic.Label>
                                    {'on '}
                                    {data.recoveries.highestInAday.x}
                                </Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                    </Grid>
                    <StackedChart data={
                        {
                            perDay: {
                                label: 'Recoveries Per Day',
                                color: 'green',
                                data: data.recoveries.perDay,
                            },
                            cummulative: {
                                label: 'Cummulative Recoveries',
                                color: 'green',
                                data: data.recoveries.cummulative,
                            },
                        }
                    }
                    />
                </Segment>
            </Container>
        </>
    );
}
