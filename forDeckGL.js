const path = require("path");
const fs = require("fs");

const { Pool, Client } = require("pg");
const connectString =
  "postgressql://postgres:postgrespassword@localhost:5432/postgres";

const client = new Client({
  // connectionString: connectString
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgrespassword",
  port: 5432
});

client.connect();

client.query(
  "SELECT origin_stop,stop_lon ,stop_lat ,stop_name,sum from forgeojson WHERE issue_year='2019' AND issue_month='12'",
  (err, res) => {
    const features = res.rows.map(stop => {
      return {
        stopID: stop.origin_stop,
        stopName: stop.stop_name,
        // routeNum: stop.route,
        qty: stop.sum / 100,
        lon: stop.stop_lon,
        lat: stop.stop_lat
      };
    });

    // const geoJson2017to2019 = {
    //   type: "FeatureCollection",
    //   features: features
    // };

    console.log(features);
    fs.writeFileSync(
      "geojson/hexagonJson201912.json",
      JSON.stringify(features)
    );

    client.end();
  }
);
