const express = require("express");
const json2scv = require("json2csv").parse;
const spawn = require("child_process").spawn;
const axios = require("axios");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = 3000;

var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("hello")
});

app.post("/", urlencodedParser, async (req, res) => {
  await axios
    .get(
      `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=xMymMgPVUuEJQlvLkaJhVfr0LC9yJKAo&q=${req.body.latitude}%2C${req.body.longitude}`
    )
    .then(async (resd) => {
      //console.log(res.data.Key)
      const weatherData = await axios.get(
        `https://dataservice.accuweather.com/currentconditions/v1/${resd.data.Key}?apikey=xMymMgPVUuEJQlvLkaJhVfr0LC9yJKAo&details=true`
      );

      const obj = [
        {
          Temperature: weatherData.data[0].Temperature.Metric.Value,
          "Dew Point": weatherData.data[0].DewPoint.Metric.Value,
          "Wind Speed": weatherData.data[0].Wind.Speed.Metric.Value,
          "Relative Humidity": weatherData.data[0].RelativeHumidity,
        },
      ];

      const feilds = [
        "Temperature",
        "Dew Point",
        "Wind Speed",
        "Relative Humidity",
      ];

      const csv = json2scv(obj, feilds);

      fs.writeFile("test.csv", csv, (e) => {
        if (e) {
          throw e;
        } else {
          console.log("csv created");
        }
      });

      var process = await spawn("python", ["model.py"]);

      process.stdout.on("data", function (data) {
        console.log("Params:",obj);
        console.log("Prediction:",data.toString());
        res.write(data);
        res.end()
      });
    }).catch(e=>{
      console.log(e)
        res.send(e);
    })
    
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
