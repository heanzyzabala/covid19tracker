import axios from 'axios';

export async function getHistoryByCountry(country) {
    return axios.get(`https://corona.lmao.ninja/v3/covid-19/historical/${country}?lastdays=9999`);
}

export async function getAllHistory() {
    return axios.get('https://corona.lmao.ninja/v3/covid-19/historical?lastdays=9999');
}

export default { getHistoryByCountry, getAllHistory };
