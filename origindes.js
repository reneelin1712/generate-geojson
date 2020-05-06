const data = require("./data/20191201.json");
const fs = require("fs");

const origindes = data.map(trip => {
  return {
    des: [parseFloat(trip.des_lon), parseFloat(trip.des_lat)],
    org: [parseFloat(trip.orin_lon), parseFloat(trip.orin_lat)],
    qty: parseFloat(trip.quantity)
  };
});
const origdes = origindes.filter(trip => {
  return trip.des[0] != null;
});

const final = origdes.filter(trip => {
  return trip.org[0] != null;
});
console.log(final);
fs.writeFileSync("geojson/trips20191201.json", JSON.stringify(final));
