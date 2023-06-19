import React, { useState, useEffect, useRef, useMemo } from 'react'
// importo la useNavigate per ritornare alla pagine dei dispositivi dopo aver eliminato quello corrente
import { useParams, useNavigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal';
import { toast, ToastContainer } from 'react-toastify';
import "boxicons"
import DataTable from 'react-data-table-component';
import ReadService from '../../services/read-service';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ZoomableGroup, Marker, ComposableMap, Geographies, Geography } from "react-simple-maps";
import DeviceService from '../../services/device-service';
import { io } from 'socket.io-client';
import { getHost } from '../../services/endpoints';
import moment from 'moment';
import TableLoader from '../../components/table-loader/table-loader';

const geoUrl =
    "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function Device() {
    let count = 0;

    // variabile dove salvare useNavigate di deleteDevice
    const deviceList = useNavigate();
    const openCoordinatesModal = () => {
        setShowCoordinatesModal(true);
    }
    const closeCoordinatesModal = () => {
        setShowCoordinatesModal(false);
    }
    const openDeleteModal = () => {
        setShowDeleteModal(true);
    }
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    }
    const latitudeDevice = useRef();
    const longitudeDevice = useRef();
    const [showCoordinatesModal, setShowCoordinatesModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    const [columns, setColumns] = useState([]);
    const [data, setData] = useState(() => []);
    const [pending, setPending] = useState(true);
    const { idSensor } = useParams();
    const [lastRead, setLastRead] = useState({
        temperature: 0,
        pressure: 0,
        humidity: 0,
        gas: 0
    });
    const webSocket = io(getHost(), {
        autoConnect: false
    });
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        let label = context.dataset.label;
                        let value = context.parsed.y;
                        switch (label) {
                            case "Temperature":
                                label = value + "°C";
                                break;
                            case "Humidity":
                                label = value + "%";
                                break;
                            case "Pressure":
                                label = value + "hPa";
                                break;
                            case "Air Quality":
                                label = value + "%";
                                break;
                        }
                        return label;
                    }
                }
            }
        },
    };
    // mi salvo le informazioni del payload in setDeviceInfo e le richiamo in deviceInfo e dichiaro dei valori predefiniti
    const [deviceInfo, setDeviceInfo] = useState({
        latitude: 0,
        longitude: 0
    });

    const reqSensorData = async () => {
        // salvo nella variabile l'oggetto ottenuto dall'API del server per individuare il dispositivo su MongoDB
        const resp = await DeviceService.getDevice(idSensor);
        // passo alla useState i valori da memorizzare, cioè il payload dell'oggetto
        setDeviceInfo(resp.data.sensor);
    }
    const [chartState, setChartState] = useState({
        labels: [],
        datasets: [{
            label: 'Temperature',
            data: []
        }]
    });
    const dataTemperature = [];
    const dataHumidity = [];
    const dataPressure = [];
    const dataGas = [];
    const dataLabel = [];

    // carico le letture dei sensori (latitudine, longitudine, temperatura, pressione, umidità e gas) da visualizzare in tabella
    const loadReads = () => {
        setPending(true);
        ReadService.getAllRead(idSensor).then((response) => {
            // salvo nella variabile il contenuto delle letture dall'oggetto
            const reads = response.data.reads;
            const auxcolumns = [];
            // per ciascun lettura escludo le colonne __v , _id , idUser e idSensor
            for (let key in reads[0]) {
                if (key == "__v" || key == "_id" || key == "idUser" || key == "idSensor") {
                    continue;
                }
                let formatter = null;
                switch (key) {
                    case "Timestamp":
                        formatter = (row, index) => {
                            return moment(row[key]).format("DD/MM/YYYY, HH:mm:ss");
                        }
                        break;
                    case "Temperature":
                        formatter = (row, index) => {
                            return row[key] + "°C";
                        }
                        break;
                    case "Humidity":
                        formatter = (row, index) => {
                            return row[key] + "%";
                        }
                        break;
                    case "Pressure":
                        formatter = (row, index) => {
                            return row[key] + "hPa";
                        }
                        break;
                    case "Air Quality":
                        formatter = (row, index) => {
                            return row[key] + "%";
                        }
                        break;
                }
                auxcolumns.push({
                    name: key,
                    selector: row => row[key],
                    sortable: true,
                    reorder: true,
                    format: formatter,
                });

            }
            setColumns(auxcolumns);
            setData(reads);
            setPending(false);
        });
    }
    // aggiorna gli elementi del DOM mediante la useEffect
    useEffect(() => {
        loadReads();
        reqSensorData();

        function onConnect() {
            webSocket.emit('join', idSensor);
        }

        function onDisconnect() {
        }

        function onNewReadEvent(value) {
            setLastRead(value);
            // salvo le
            dataTemperature.push(value.temperature);
            dataHumidity.push(value.humidity);
            dataPressure.push(value.pressure);
            dataGas.push(value.gas);
            dataLabel.push((new Date().toLocaleString('it-IT')));
            if (dataTemperature.length > 10) {
                dataTemperature.shift();
                dataPressure.shift();
                dataHumidity.shift();
                dataGas.shift();
                dataLabel.shift();
            }
            setChartState({
                labels: dataLabel,
                datasets: [{
                    label: 'Temperature',
                    data: dataTemperature,
                    borderColor: '#269b41',
                    backgroundColor: '#28a745'
                },
                {
                    label: 'Humidity',
                    data: dataHumidity,
                    borderColor: '#4c64df',
                    backgroundColor: '#5873fe'
                },
                // {
                //     label: 'Pressure',
                //     data: dataPressure,
                //     borderColor: '#e9b903',
                //     backgroundColor: '#ffca00'
                // },
                {
                    label: 'Air Quality',
                    data: dataGas,
                    borderColor: '#c82e3d',
                    backgroundColor: '#dc3545'
                }
                ]
            })
        }

        webSocket.on('connect', onConnect);
        webSocket.on('disconnect', onDisconnect);
        webSocket.on('new-read', onNewReadEvent);
        webSocket.connect();
        return () => {
            webSocket.off('connect', onConnect);
            webSocket.off('disconnect', onDisconnect);
            webSocket.off('new-read', onNewReadEvent);
            webSocket.close();
        };
    }, []);

    const editDevice = async () => {
        closeCoordinatesModal();
        const resp = await DeviceService.editDevice(idSensor, latitudeDevice.current.value, longitudeDevice.current.value);
        if (resp.data.error) {
            toast.error(resp.data.msg, {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                progress: undefined,
                theme: 'dark'
            });
        } else {
            toast.success(resp.data.msg, {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                progress: undefined,
                theme: 'dark'
            });
            reqSensorData();
        }
    }

    const deleteDevice = async () => {
        closeDeleteModal();
        const resp = await DeviceService.deleteDevice(idSensor);
        if (resp.data.error) {
            toast.error(resp.data.msg, {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                progress: undefined,
                theme: 'dark'
            });
        } else {
            toast.success(resp.data.msg, {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                progress: undefined,
                theme: 'dark'
            });
            navigate('../devices');
        }
    }

    return (
        <>
            <div class="row">
                <div class="col-lg-8 p-r-0 title-margin-right">
                    <div class="page-header">
                        <div class="page-title">
                            <h1>Device <span>{idSensor}</span></h1>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 p-l-0 title-margin-left">
                    <div class="page-header">
                        <div class="page-title float-right">
                            <div class="btn-group" role="group" aria-label="Basic example">

                                <button type="button" class="btn btn-warning btn-addon" onClick={() => {
                                    openCoordinatesModal();
                                }}><i class="ti-pencil-alt"></i>Edit</button>
                                <button type="button" class="btn btn-danger btn-addon" onClick={() => {
                                    openDeleteModal();
                                }}><i class="ti-trash"></i>Delete</button>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-3">
                    <div class="card">
                        <div class="stat-widget-one">
                            <div class="stat-icon dib"><i class="bx bxs-thermometer color-success border-success" style={{ fontWeight: "normal" }}></i>
                            </div>
                            <div class="stat-content dib">
                                <div class="stat-text">Last Temperature</div>
                                <div class="stat-digit">{lastRead.temperature}°C</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="card">
                        <div class="stat-widget-one">
                            <div class="stat-icon dib"><i class="bx bx-droplet color-primary border-primary"></i>
                            </div>
                            <div class="stat-content dib">
                                <div class="stat-text">Last Humidity</div>
                                <div class="stat-digit">{lastRead.humidity}%</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="card">
                        <div class="stat-widget-one">
                            <div class="stat-icon dib"><i class="bx bx-vertical-bottom" style={{ color: "#ffca00", borderColor: "#ffca00" }} ></i>
                            </div>
                            <div class="stat-content dib">
                                <div class="stat-text">Last Pressure</div>
                                <div class="stat-digit">{lastRead.pressure}hPa</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="card">
                        <div class="stat-widget-one">
                            <div class="stat-icon dib"><i class="bx bx-wind color-danger border-danger" style={{ fontWeight: "normal" }}></i></div>
                            <div class="stat-content dib">
                                <div class="stat-text">Last Air Quality</div>
                                <div class="stat-digit">{lastRead.gas}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-title">
                            <h4>Realtime Measurements</h4>

                        </div>
                        <div class="card-body">
                            <div class="ct-bar-chart" style={{ position: 'relative' }}>
                                <Line options={options} data={chartState} />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card">
                        <div class="card-title">
                            <h4>Location</h4>

                        </div>
                        <div class="card-body">
                            <ComposableMap projection="geoMercator">
                                <ZoomableGroup center={[deviceInfo.longitude, deviceInfo.latitude]} zoom={9}>
                                    <Geographies geography={geoUrl}>
                                        {({ geographies }) =>
                                            geographies.map((geo) => (
                                                <Geography key={geo.rsmKey} geography={geo} fill="#EAEAEC"
                                                    stroke="#D6D6DA" />
                                            ))
                                        }
                                    </Geographies>
                                    <Marker coordinates={[deviceInfo.longitude, deviceInfo.latitude]}>
                                        <circle r={3} fill="#F00" stroke="#fff" strokeWidth={1} />
                                        <text
                                            textAnchor="middle"
                                            y={-5}
                                            style={{ fontFamily: "system-ui", fill: "#5D5A6D", fontSize: "0.2em" }}
                                        >
                                            {idSensor}
                                        </text>
                                    </Marker>
                                </ZoomableGroup>
                            </ComposableMap>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <div class="card">
                        <div class="card-title">
                            <h4>History</h4><button class="btn btn-primary btn-sm float-right btn-addon" onClick={loadReads}><i class="ti-reload"></i>Refresh</button>
                        </div>
                        <div class="card-body">
                            <div class="bootstrap-data-table-panel">
                                <div class="table-responsive">
                                    <DataTable columns={columns} data={data} pagination progressPending={pending} progressComponent={<TableLoader />} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
            <Modal show={showCoordinatesModal} onHide={closeCoordinatesModal}>
                <Modal.Header>
                    <Modal.Title>Coordinate Dispositivo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Latitudine: <input type='number' ref={latitudeDevice} defaultValue={deviceInfo.latitude} />
                    Longitudine: <input type='number' ref={longitudeDevice} defaultValue={deviceInfo.longitude} />
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" class="btn btn-secondary" onClick={closeCoordinatesModal}>Chiudi</button>
                    <button type="button" class="btn btn-primary" onClick={editDevice}>Salva</button>
                </Modal.Footer>
            </Modal>
            <Modal show={showDeleteModal} onHide={closeDeleteModal}>
                <Modal.Header>
                    <Modal.Title>Elimina Dispositivo</Modal.Title>
                </Modal.Header>
                <Modal.Body>Sicuro di voler eliminare il dispositivo?</Modal.Body>
                <Modal.Footer>
                    <button type="button" class="btn btn-secondary" onClick={closeDeleteModal}>Chiudi</button>
                    <button type="button" class="btn btn-primary" onClick={deleteDevice}>Elimina</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Device