const http = require('http');
const { exactInterval, preferredLanguage, preferredUnits } = require('./config.js');

const yargs = require('yargs');
const { hideBin} = require("yargs/helpers");

const argv = yargs(hideBin(process.argv)).argv;

const chosenCity = argv._[0];
const weatherApiKey = process.env.WEATHER_API_KEY;

const url = `http://api.weatherstack.com/current?access_key=${weatherApiKey}&query=${chosenCity}&units=${preferredUnits}`;

http.get(url, (res) => {
    const {statusCode} = res;
    if (statusCode !== 200) {
        console.log('Status Code:', statusCode);
        return;
    } 

    res.setEncoding('utf-8');
    let rawData = '';
    res
        .on('data', (chunk) => rawData += chunk)
        .on('end', ()=> {
            const transformedData = JSON.parse(rawData);
            const weather = transformedData.current.weather_descriptions[0];
            console.log(`Weather in ${chosenCity} is ${weather}`);
        
        })
        .on('error', (error) => console.error(error));
})


