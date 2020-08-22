import axios from 'axios';

export default async function getHistoralByCountry(country) {
    return axios.get(`https://corona.lmao.ninja/v3/covid-19/historical/${country}?lastdays=9999`);
}
