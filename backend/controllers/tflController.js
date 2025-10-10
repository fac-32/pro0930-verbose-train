
import * as tflService from '../services/tflService.js';

const date = 20251007
const from = 1000129
const to = 1000013
const time = '1700'
const type = 'stationSelect';

const stationInfoBundler = (commonName, naptanId, lat, lon) => {
  return {
    commonName: commonName,
    lat: lat,
    lon: lon,
    naptanId: naptanId,
  }
}

const getJourney = async (req, res) => {
  try {
    let data = await tflService.TFLAPICall(from, to, time, date, type);
    data = data.data

    const allStops = [];

    const leg = data.journeys[0].legs[0];
    const departurePoint = leg.departurePoint;
    allStops.push(departurePoint)

    const intermediateStops = leg.path.stopPoints;
    intermediateStops.pop()
    intermediateStops.forEach((stops) => allStops.push(stops)
    )
    const arrivalPoint = leg.arrivalPoint;
    allStops.push(arrivalPoint);

    const assembledJourney = [];

    allStops.forEach((station) => {
      let commonName;
      let naptanId;
      let lat;
      let lon;

      if (station.commonName && station.id || station.commonName && station.naptanId || station.name && station.id) {
       commonName = station.commonName || station.name
       naptanId = station.id || station.naptanId
        if (station.lat && station.lon) {
          lat = station.lat
        lon = station.lon
        } else {
          const fetchedStationLocation = getStationLocation(naptanId);
          lat = fetchedStationLocation.lat;
          lon = fetchedStationLocation.lon;
        }
       assembledJourney.push(stationInfoBundler(commonName, naptanId, lat, lon));
    })

    res.json(assembledJourney);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching journey', error: error.message });
  }

};

const getStations = async (req, res) => {
  try {
    const data = await tflService.TFLAPICall(from, to, time, date, type);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching journey', error: error.message });
  }
}

export {
  getStations,
  getJourney,
};

