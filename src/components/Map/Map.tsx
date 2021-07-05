import React, {useEffect,useRef, useState} from 'react'
import {GoogleMap, Marker, useJsApiLoader, DirectionsRenderer, InfoWindow} from '@react-google-maps/api';
import Autocomplete from "react-google-autocomplete";

const containerStyle = {
    width: '400px',
    height: '400px'
};

export interface Center {
    lat: number,
    lng: number
};

interface infoOpen {
    index: number,
    openIn: boolean
}

export interface Point {
    lat: number;
    lon: number;
    description?: string;
    title?: string;
    difficulty?: number;
}

interface MapProps {
    unique?: boolean;
    noAdd?: boolean
    noRoute?: boolean
    callback: (points: Point[]) => void;
    callbackC?: (center: Center) => void;
    points: Point[];
}


function Map(props: MapProps) {
    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyA_e5nkxWCBpZ3xHTuUIpjGzksaqLKSGrU"
    })

    const mapRef = useRef(null);
    const [points, setPoints] = useState<Point[]>(props.points)
    const [center, setCenter] = useState<Center>({
        lat: 38.7071,
        lng: -9.13549
    })
    const [open, setOpen] = useState<infoOpen>({
        index: 0,
        openIn: false
    })
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
    const client = new google.maps.DirectionsService();


    const onClick = (ev: any) => {
        if (ev.latLng !== null && !props.noAdd)
            if (!props.unique)
                props.callback([...points, {lat: ev.latLng.lat(), lon: ev.latLng.lng()}])
            else {
                props.callback([{lat: ev.latLng.lat(), lon: ev.latLng.lng()}]);
            }
    }
    function handleCenterChanged() {
        if (mapRef.current !== null && mapRef !== null && props.callbackC)
        {
            // @ts-ignore
            if(Math.abs(mapRef.current.getCenter().toJSON().lat - center.lat) > 0.4 || Math.abs(mapRef.current.getCenter().toJSON().lng - center.lng) > 0.4)
                { // @ts-ignore
                    props.callbackC({lat: mapRef.current.getCenter().toJSON().lat, lng: mapRef.current.getCenter().toJSON().lng})

                }
        }
    }


    const onRightClick = (index: number) => {
        if (!props.unique) {
            let newVec = [...points];
            newVec.splice(index, 1)
            props.callback(newVec);
        }
    }
    useEffect(() => {
        setPoints(props.points)
    }, [props.points])

    useEffect(() => {
        if(props.callbackC)
            props.callbackC(center)
    }, [center])

    const wayPoints = () => {
        let waypoints = []
        for (let i = 1; i < points.length - 1; i++)
            waypoints.push({location: new google.maps.LatLng(points[i].lat, points[i].lon), stopover: true})
        return waypoints;
    }
    useEffect(() => {

        if (points.length > 1 && !props.noRoute)
            client.route({
                origin: new google.maps.LatLng(points[0].lat, points[0].lon),
                destination: new google.maps.LatLng(points[points.length - 1].lat, points[points.length - 1].lon),
                travelMode: google.maps.TravelMode.DRIVING,
                waypoints: wayPoints()
            }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK)
                    setDirections(result)
                else
                    console.log(status)
            })
    }, [points])

    const clickMarker = (index: number) => {
        setOpen({index: index, openIn: true})
    }
    function handleLoad(map: any) {
        mapRef.current = map;
    }

    return isLoaded ? (
        <div>
            <Autocomplete
                apiKey="AIzaSyA_e5nkxWCBpZ3xHTuUIpjGzksaqLKSGrU"
                style={{width: "50%"}}
                onPlaceSelected={(place) => {
                    if (place.geometry?.location?.lat() !== undefined && place.geometry?.location?.lng() !== undefined)
                        setCenter({lat: place.geometry?.location?.lat(), lng: place.geometry?.location?.lng()})

                }}
                defaultValue="Insira localização"
            />
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={handleLoad}
                onClick={onClick}
                onCenterChanged={handleCenterChanged}
            >   {directions !== null &&
            <DirectionsRenderer directions={directions}/>
            }
                { /* Child components, such as markers, info windows, etc. */
                    points.map((point: Point, index: number) => (
                        <Marker position={{lat: point.lat, lng: point.lon}}
                                onRightClick={() => onRightClick(index)}
                                onClick={() => clickMarker(index)}
                                key = {index}
                        >
                            {open.openIn && open.index === index ?
                                <InfoWindow onCloseClick = {()=> setOpen({index: index, openIn: false})}>
                                    <div className='info-wrapper'>
                                        <>
                                            <span className='info-title-wrapper'>{point.title}</span>
                                        </>
                                    </div>
                                </InfoWindow>
                                : <div></div>

                            }
                        </Marker>

                    ))

                }


            </GoogleMap>
        </div>

    ) : <></>
}

/*


 */

export default React.memo(Map)