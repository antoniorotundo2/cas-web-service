import React from 'react'
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';


ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);


function DeviceCard(props) {
    const { device } = props;
    const temperature = (device.lastRead && device.lastRead.length > 0) ? device.lastRead[0].temperature : 0;
    const humidity = (device.lastRead && device.lastRead.length > 0) ? device.lastRead[0].humidity : 0;
    const gas = (device.lastRead && device.lastRead.length > 0) ? device.lastRead[0].gas : 0;
    const timestamp = (device.lastRead && device.lastRead.length > 0) ? device.lastRead[0].timestamp : null;

    const navigate = useNavigate();

    const data = {
        labels: ['Temperature', 'Humidity', 'Air Quality'],
        datasets: [
            {
                data: [temperature, humidity, gas],
                backgroundColor: [
                    '#28a745b3',
                    '#5873feb3',
                    '#dc3545b3',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <>
            <div class="col-3">
                <div class="card">
                    <div class="card-title">
                        <h4>Device {device.idSensor}</h4>
                    </div>
                    <div class="card-body">
                        <PolarArea data={data} />;
                    </div>
                    <div class="card-footer">
                        <div>
                            Last Activitity: {moment(timestamp).fromNow()}
                        </div>
                        <div>
                            <button class="btn btn-dark btn-sm btn-block" onClick={()=>{
                                navigate("devices/"+device.idSensor);
                            }}>View Real-Time</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeviceCard