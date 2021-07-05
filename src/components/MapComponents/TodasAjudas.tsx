import React, { useCallback, useEffect, useState } from "react";
import Map, {Center, Point} from "../Map/Map";
import {getMarkers} from "../../services/http";

function TodasAjudas() {
    const [point, setPoint] = useState<Point[]>([]);
    const [center, setCenter] = useState<Center>({
        lat: 38.7071,
        lng: -9.13549
    });
    const [zoom, setZoom] = useState<number>(10);
    const callbackC = useCallback(
        (center: Center) => {
            setCenter(center)
        }, [center]
    )
    const callbackZ = useCallback(
        (zoom: number) => {
            setZoom(zoom)
        }, [zoom]
    )
    const pointsCallback = useCallback(
        (points: Point[]) => {
            setPoint(points)
        },
        [point]
    );
    useEffect(()=>{
        let radius:number = zoom;
        if(radius - 10 < 0)
            radius = Math.abs(radius - 10) + 10
        else if(radius-10 > 0)
            radius = -(radius-10) + 10
        getMarkers(center.lat, center.lng, Math.round(radius*1.5)).then(
            (response) => {
                let newVec = response.data
                for (let i = 0; i < newVec.length; i++) {
                    newVec[i].lat = parseFloat(newVec[i].lat)
                    newVec[i].lon = parseFloat(newVec[i].lon)
                }
                console.log(newVec)
                setPoint(newVec)

            },
            (error) => {
                console.log(error)
            }
        )
    }, [center, zoom])

    return (
        <Map noAdd noRoute points={point} center={center} zoom={zoom} callback={pointsCallback} callbackC={callbackC}
             callbackZ={callbackZ}/>
    );
}

export default TodasAjudas;
