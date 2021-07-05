import React, { useCallback, useEffect, useState } from "react";
import Map, {Center, Point} from "../Map/Map";
import {getMarkers} from "../../services/http";

function TodasAjudas() {
    const [point, setPoint] = useState<Point[]>([]);
    const callbackC = useCallback(
        (center: Center) => {
            getMarkers(center.lat, center.lng, 15).then(
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
        }, []
    )
    const pointsCallback = useCallback(
        (points: Point[]) => {
            setPoint(points)
        },
        [point]
    );

    return (
        <Map noAdd noRoute points={point} callback={pointsCallback} callbackC={callbackC}/>
    );
}

export default TodasAjudas;
