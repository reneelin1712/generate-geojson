const AWS = require("aws-sdk");

const ID = "AKIAJLJR6XL36VHGZMCQ";
const SECRET = "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";
const BUCKET_NAME = "geojson-translink";

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
  Bucket: BUCKET_NAME
});

const { Pool, Client } = require("pg");
const connectString =
  "postgressql://postgres:postgrespassword@localhost:5432/postgres";

const client = new Client({
  connectionString: connectString
});

client.connect();

client.query("SELECT * from stops_inbound_qty", (err, res) => {
  const features = res.rows.map(stop => {
    return {
      type: "Feature",
      properties: { qty: stop.sum, name: stop.stop_name },
      geometry: {
        type: "Point",
        coordinates: [stop.stop_lon, stop.stop_lat]
      }
    };
  });

  const geoJson201912 = {
    type: "FeatureCollection",
    features: features
  };

  console.log(geoJson201912);

  const params = {
    Bucket: BUCKET_NAME,
    Key: "geojson201912.json", // File name you want to save as in S3
    Body: JSON.stringify(geoJson201912)
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });

  client.end();
});
