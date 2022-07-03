import React, { useRef, useState, useMemo } from 'react'
import { 
    GoogleMap, 
    LoadScript, 
    useJsApiLoader,
    Marker,
    Autocomplete, 
    DirectionsRenderer
} from '@react-google-maps/api'
import busData from '../../../public/json/busData.json'


function Stations(props) {

    const [center, setCenter] = useState({lat:31.952936314023113, lng:35.911021633699036, zoom:12})
    const [markers, setMarkers] = useState([])
    const [map, setMap] = useState(/** @type google.maps.Map */ null);

    const tableHeaders = ["Station ID", "Station Name", "Crossed Routes' IDs"]
    const tableData = busData.stations

    const { isLoaded } = useJsApiLoader({googleMapsApiKey: props.API_KEY})
    if (!isLoaded) {return <div>Loading...</div>}


    function addMarker(lat, lng) {
        const newMarker = {
            lat: lat,
            lng: lng,
        }
        setMarkers([...markers, newMarker])
    }

    function clearMarkers() {setMarkers([])}

    function displayAllStations() {
        const allMarkers = tableData.map(obj => {return {lat: obj['Location'].lat, lng: obj['Location'].lng}})
        setMarkers(allMarkers)
    }

    // function mapClickHandler(latlng) {
    //     setCenter({lat:latlng.lat(), lng:latlng.lng(), zoom:15})
    //     addMarker(latlng.lat(), latlng.lng())
    // }

    function displayStation(lat, lng) {
        document.querySelector('#stationsMap').scrollIntoView({behavior: 'smooth'})
        setCenter({lat:lat, lng:lng, zoom:15})
        addMarker(lat, lng)
    }


    return (
        <div id='section2' className='bg-transparent w-full h-fit flex flex-col
        transition duration-1000 opacity-0 -translate-y-28 -z-20'>

            <div id='stationsTable' className='flex justify-center items-center w-full'>
                <table className='w-4/5 border-separate border-spacing-3 pt-5 pb-5'>

                    <thead>
                        <tr>
                            {
                                tableHeaders.map(cell => {
                                    return <th className='text-2vw p-2 bg-secondary-top text-tratiary-top rounded-lg shadow-md hover:shadow-primary-top
                                    transition duration-300'
                                    >{cell}</th>
                                })
                            }
                        </tr>
                    </thead>

                    <tbody>
                        {
                            tableData.map(obj => {
                                return <tr>
                                    {
                                        Object.keys(obj).slice(0, 3).map((key, index) => {
                                            if(key != "Routes") {
                                                return <td 
                                                onClick={() => {displayStation(obj["Location"].lat, obj["Location"].lng)}}
                                                className='text-15vw font-bold text-center text-tratiary-top bg-primary-top opacity-75 rounded-lg
                                                hover:cursor-pointer hover:bg-secondary-top hover:text-primary-top hover:scale-105 transition duration-300'
                                                >{obj[key]}</td>
                                            } else {
                                                return <td 
                                                className='text-15vw font-bold text-center text-tratiary-top opacity-75
                                                hover:cursor-pointer hover:scale-105 transition duration-300'
                                                >
                                                    <div className='w-full h-full grid grid-cols-3 gap-1'>
                                                        {
                                                            obj[key].map(subcell => {
                                                                return(<di className='p-1 bg-primary-top rounded-lg hover:text-primary-top hover:bg-secondary-top'>
                                                                    {subcell}</di>)
                                                            })
                                                        }
                                                    </div>
                                                </td>
                                            }    
                                        })
                                    }
                                </tr>
                            })
                        }
                    </tbody>

                </table>    
            </div>

            <div id='mapContainer' className='bg-transparent flex justify-center items-center w-full'>

                <div id='stationsMap' style={{height: "70vh", width: "70vh"}}
                className='border-2 border-primary-top drop-shadow bg-secondary-top rounded-3xl flex justify-center items-center overflow-hidden'>
                    <GoogleMap
                        mapContainerStyle={{width:'100%', height:'100%'}}
                        center={{lat: center.lat, lng: center.lng}}
                        zoom={center.zoom}
                        onLoad={map => setMap(map)}
                        // onClick={(e) => mapClickHandler(e.latLng)}
                        options={{
                            zoomControl: false,
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false
                        }}
                    >
                    
                        <div id='markers'>
                            {markers.map(marker => 
                                <Marker
                                    position={{lat: marker.lat, lng: marker.lng}}
                                    label={marker.label}
                                    onClick={(e) => alert(e.latLng)}
                                    icon={{
                                        url: ('./icons/busStop.ico'),
                                        scaledSize: new google.maps.Size(70,70)
                                    }}
                                />
                            )}

                        </div> 

                    </GoogleMap>
                </div>

                <div id='stationsMapControllers' style={{height: "50vh"}} 
                className='w-1/6 flex flex-col justify-evenly items-center'>
                    
                    <button style={{height: "15vh", width: "15vh"}}
                    onClick={clearMarkers}
                    className='text-15vw font-bold text-center text-tratiary-top bg-secondary-top rounded-full hover:border-secondary-top
                    border-2 border-primary-top hover:bg-primary-top hover:text-secondary-top hover:scale-125 transition duration-300'
                    >Clear<br/>All</button>
                    
                    <button style={{height: "15vh", width: "15vh"}}
                    onClick={displayAllStations}
                    className='text-15vw font-bold text-center text-tratiary-top bg-secondary-top rounded-full hover:border-secondary-top
                    border-2 border-primary-top hover:bg-primary-top hover:text-secondary-top hover:scale-125 transition duration-300'
                    >Display<br/>All</button>

                </div>

            </div>



        </div>
    )
}

export default Stations