import React, { useState, useEffect, useRef, useMemo } from 'react'
import { ZoomableGroup, Marker, ComposableMap, Geographies, Geography } from "react-simple-maps";
import DeviceCard from '../../components/device-card/device-card';
import DeviceService from '../../services/device-service';
import Gradient from "javascript-color-gradient";

const geoUrl =
  "https://raw.githubusercontent.com/xoolive/topojson/master/world-countries.json"

function Dashboard() {

  const [scaleFactor, setScaleFactor] = useState(2);

  const colorGradient = new Gradient().setColorGradient("#0b2407", "#319620", "#56ff38");

  const [devicesList, setDevicesList] = useState([]);

  const [loadingState, setLoadingState] = useState(true);

  const [centerMap, setCenterMap] = useState({
    latitude: 0,
    longitude: 0
  });

  let idSensor = 0;

  const loadDevices = async () => {
    const resp = await DeviceService.getDevicesDashboard();
    if(resp.data.sensors.length > 0){
      setCenterMap({
        latitude:resp.data.sensors[0].Latitude,
        longitude:resp.data.sensors[0].Longitude
      });
    }
    setDevicesList(resp.data.sensors);
    setLoadingState(false);
  }

  const generateCards = () => {
    const elements = [];
    if (!devicesList) { return elements; }
    for (let i = 0; i < devicesList.length; i++) {
      elements.push(<DeviceCard device={devicesList[i]} />);
    }
    return elements;
  }

  const createMarkers = () => {
    const elements = [];
    for (const device of devicesList) {
      const quality = (device.lastRead && device.lastRead.length > 0) ? device.lastRead[0].gas : 0;
      elements.push(
        <Marker coordinates={[device.Longitude, device.Latitude]}>
          <circle r={8/scaleFactor} fill={colorFromValue(quality)} stroke="#fff" strokeWidth={2/scaleFactor} />
          <text
            textAnchor="middle"
            y={-8/scaleFactor}
            style={{ fontFamily: "system-ui", fill: "#5D5A6D", fontSize: "0.14em" }}
          >
            {device.idSensor}
          </text>
        </Marker>
      );
    }
    return elements;
  }

  const colorFromValue = (value, midpoint = 30) => {
    const getColorIndex = Math.round(midpoint * (value/100));
    colorGradient.setMidpoint(midpoint);
    return colorGradient.getColor(getColorIndex === 0 ? 0.01 : getColorIndex);
  };

  useEffect(() => {
    loadDevices();
  }, [])

  return (
    <>
      <div class="row">
        <div class="col p-r-0 title-margin-right">
          <div class="page-header">
            <div class="page-title">
              <h1>Dashboard</h1>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-title">
              <h4>Devices' Location</h4>

            </div>
            <div class="card-body" style={{ maxHeight: "300px", overflow: "hidden" }}>
              <ComposableMap projection="geoMercator" height={300}>
                <ZoomableGroup center={[centerMap.longitude,centerMap.latitude]} zoom={2} onMove={({ x,y,zoom,dragging }) => {
                  setScaleFactor(zoom)}}>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography key={geo.rsmKey} geography={geo} fill="#EAEAEC"
                          stroke="#D6D6DA" />
                      ))
                    }
                  </Geographies>
                  {createMarkers()}
                </ZoomableGroup>
              </ComposableMap>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        {
          generateCards()
        }
      </div>
    </>
  )
}
export default Dashboard