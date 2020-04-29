const path = require("path");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");

const { Pool, Client } = require("pg");
const connectString =
  "postgressql://postgres:postgrespassword@localhost:5432/postgres";

const client = new Client({
  connectionString: connectString
});

client.connect();

const stop_by_route = "SELECT origin_stop,sum(quantity ),stop_lon,stop_lat FROM translink2019 t,stop_mapping sm WHERE route = '66' and t.origin_stop =sm.stop_id group by origin_stop ,sm.stop_lat ,sm.stop_lon "

client.query(stop_by_route, (err, res) => {
    const coordinates= res.rows.map(stop=>{
        return(
             [stop.stop_lon, stop.stop_lat]
        )
        
    })

      const line_route66 = {
        'type': 'Feature',
        'properties': {},
        'geometry': {
        'type': 'LineString',
        'coordinates': coordinates
        }
    };
  
     //console.log(line_route66);
    fs.writeFileSync("geojson/temp_route_line.json", JSON.stringify(line_route66));
  client.end();
});
