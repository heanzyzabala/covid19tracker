import React, { useState, useEffect } from 'react';

import {
    Container,
    Segment,
    Header,
    Divider,
    Statistic,
    Grid,
    Loader,
    Flag,
} from 'semantic-ui-react';

import { getHistoryByCountry } from '../api';
import { StatisticSegment, StackedChart } from '../components';

export default function Home() {
    const [data, setData] = useState({
        isLoading: true,
        cases: {
            perDay: [],
            cumulative: [],
            highestInAday: {},
            overall: {},
            averagePerDay: 0,
            latest: {},
        },
        deaths: {
            perDay: [],
            cumulative: [],
            highestInAday: {},
            overall: {},
            averagePerDay: 0,
            latest: {},
        },
        recoveries: {
            perDay: [],
            cumulative: [],
            highestInAday: {},
            overall: {},
            averagePerDay: 0,
            latest: {},
        },
    });

    function formatDate(d) {
        const opts = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(d).toLocaleDateString('en-US', opts);
    }

    function formatDates(arr) {
        return Object.entries(arr).map(([k, v]) => ({ x: formatDate(k), y: v }));
    }

    function mapDifference(arr) {
        let prev = 0;
        return Object.values(arr).map(({ x, y }) => {
            const diff = Math.abs(y - prev);
            prev = y;
            return { x: formatDate(x), y: diff };
        });
    }

    function findHighest(arr) {
        return Object.values(arr).reduce(({ x, y }, cur) => {
            if (cur.y > y) {
                return cur;
            }
            return { x: formatDate(x), y };
        });
    }

    function toWhole(i) {
        return Math.floor(i);
    }

    function calculateGrowthRate(arr, d) {
        const i = arr.length - 1;
        const present = arr[i].y;
        const past = arr[i - d].y;
        return ((present - past) / past) * 100;
    }

    useEffect(() => {
        async function fetchData() {
            const result = await getHistoryByCountry('Philippines');
            const { cases, deaths, recovered } = result.data.timeline;

            const cumulativeCases = formatDates(cases);
            const casesPerDay = mapDifference(cumulativeCases);
            const highestCasesInAday = findHighest(casesPerDay);
            const overallCases = cumulativeCases[cumulativeCases.length - 1];

            const cumulativeDeaths = formatDates(deaths);
            const deathsPerDay = mapDifference(cumulativeDeaths);
            const highestDeathsInAday = findHighest(deathsPerDay);
            const overallDeaths = cumulativeDeaths[cumulativeDeaths.length - 1];

            const cumulativeRecoveries = formatDates(recovered);
            const recoveriesPerDay = mapDifference(cumulativeRecoveries);
            const highestRecoveriesInAday = findHighest(recoveriesPerDay);
            const overallRecoveries = cumulativeRecoveries[cumulativeRecoveries.length - 1];

            setData({
                isLoading: false,
                historicalRange: {
                    from: formatDate(cumulativeCases[0].x),
                    to: formatDate(cumulativeCases[cumulativeCases.length - 1].x),
                },
                cases: {
                    perDay: casesPerDay,
                    cumulative: cumulativeCases,
                    highestInAday: highestCasesInAday,
                    overall: overallCases,
                    averagePerDay: toWhole(overallCases.y / cumulativeCases.length),
                    latest: casesPerDay[casesPerDay.length - 1],
                },
                deaths: {
                    perDay: deathsPerDay,
                    cumulative: cumulativeDeaths,
                    highestInAday: highestDeathsInAday,
                    overall: overallDeaths,
                    averagePerDay: toWhole(overallDeaths.y / cumulativeDeaths.length),
                    latest: deathsPerDay[deathsPerDay.length - 1],
                },
                recoveries: {
                    perDay: mapDifference(cumulativeRecoveries),
                    cumulative: cumulativeRecoveries,
                    highestInAday: highestRecoveriesInAday,
                    overall: overallRecoveries,
                    averagePerDay: toWhole(overallRecoveries.y / cumulativeRecoveries.length),
                    latest: recoveriesPerDay[recoveriesPerDay.length - 1],
                },
            });
        }
        fetchData();
    });

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
            <Container style={{
                paddingTop: '4em',
                paddingBottom: '4em',
            }}
            >
                <Segment style={{ padding: '4em 2em 2em' }}>
                    <Header as="h1">
                        COVID-19 Tracker
                        <Header.Subheader>
                            <Flag name="ph" />
                            Philippines
                        </Header.Subheader>
                    </Header>
                    <Divider section hidden />
                    <Header as="h2">
                        <Header.Content>
                            General Stats
                            <Header.Subheader>
                                as of
                                {' '}
                                {data.historicalRange.to}
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                    <Divider section />
                    <Segment basic>
                        <Grid padded stretched stackable columns={4} textAlign="center">
                            <Grid.Row>
                                <Grid.Column>
                                    <StatisticSegment data={{
                                        header: 'Total Cases',
                                        content: data.cases.overall.y.toLocaleString(),
                                        footer: `+${data.cases.latest.y} cases`,
                                        color: 'blue',
                                        size: 'small',
                                    }}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <StatisticSegment data={{
                                        header: 'Active Cases',
                                        content: (data.cases.overall.y - data.deaths.overall.y - data.recoveries.overall.y).toLocaleString(),
                                        color: 'purple',
                                        size: 'small',
                                    }}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <StatisticSegment data={{
                                        header: 'Died',
                                        content: data.deaths.overall.y.toLocaleString(),
                                        footer: `+${data.deaths.latest.y} deaths`,
                                        color: 'red',
                                        size: 'small',
                                    }}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <StatisticSegment data={{
                                        header: 'Recovered',
                                        content: data.recoveries.overall.y.toLocaleString(),
                                        footer: `+${data.recoveries.latest.y} recoveries`,
                                        color: 'green',
                                        size: 'small',
                                    }}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    <StatisticSegment data={{
                                        header: 'Case Growth Rate',
                                        content: `${calculateGrowthRate(data.cases.cumulative, 7).toFixed(2)}%`,
                                        footer: 'in the last 7 days',
                                        color: 'pink',
                                        size: 'small',
                                    }}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <StatisticSegment data={{
                                        header: 'Cases',
                                        content: ((data.cases.overall.y / 106700000) * 1000000).toLocaleString(undefined, { maximumFractionDigits: 2 }),
                                        footer: 'Per Million Population',
                                        color: 'brown',
                                        size: 'small',
                                    }}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <StatisticSegment data={{
                                        header: 'Case Recovery Rate',
                                        content: `${((data.recoveries.overall.y / data.cases.overall.y) * 100).toFixed(2)}%`,
                                        color: 'olive',
                                        size: 'small',
                                    }}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <StatisticSegment data={{
                                        header: 'Fatality Rate',
                                        content: `${((data.deaths.overall.y / data.cases.overall.y) * 100).toFixed(2)}%`,
                                        color: 'orange',
                                        size: 'small',
                                    }}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                    <Header as="h2">
                        <Header.Content>
                            Historal
                            <Header.Subheader>
                                {`from ${data.historicalRange.from} to ${data.historicalRange.to}`}
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                    <Divider horizontal>
                        <Header as="h2" textAlign="center">
                            Cases
                        </Header>
                    </Divider>
                    <Segment basic>
                        <Grid divided padded stackable columns={4} textAlign="center">
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
                                cumulative: {
                                    label: 'Cumulative Cases',
                                    color: 'blue',
                                    data: data.cases.cumulative,
                                },
                            }
                        }
                        />
                    </Segment>
                    <Divider horizontal>
                        <Header as="h2" textAlign="center">
                            Deaths
                        </Header>
                    </Divider>
                    <Segment basic>
                        <Grid divided padded stackable columns={4} textAlign="center">
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
                                cumulative: {
                                    label: 'Cumulative Deaths',
                                    color: 'red',
                                    data: data.deaths.cumulative,
                                },
                            }
                        }
                        />
                    </Segment>
                    <Divider horizontal>
                        <Header as="h2" textAlign="center">
                            Recoveries
                        </Header>
                    </Divider>
                    <Segment basic>
                        <Grid divided padded stackable columns={4} textAlign="center">
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
                                cumulative: {
                                    label: 'Cumulative Recoveries',
                                    color: 'green',
                                    data: data.recoveries.cumulative,
                                },
                            }
                        }
                        />
                    </Segment>
                </Segment>
            </Container>
        </>
    );
}
