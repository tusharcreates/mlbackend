const express = require('express')
const json2scv = require('json2csv').parse
const spawn = require('child_process').spawn
const fs = require('fs')
const app = express()
const port = 3000

app.get('/', async(req, res) => {
    temp=34.6,
    dewpoint=11.3,
    windspeed=0.9,
    relhumid=24.41

    const obj = [
        {
            "Temperature":temp,
            "Dew Point":dewpoint,
            "Wind Speed":windspeed,
            "Relative Humidity":relhumid
        }
    ]

    const feilds = ["Temperature","Dew Point","Wind Speed","Relative Humidity"];

    const csv = json2scv(obj,feilds);
    
    fs.writeFile('test.csv',csv,(e)=>{
        if(e){
            throw e
        }
        else{
            console.log("csv created")
        }
    })

    var process = await spawn('python',["model.py"])

    process.stdout.on('data', function(data) {

        console.log(data.toString());
        res.write(data);
        res.end();
    });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})