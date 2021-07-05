import React, { useState } from "react";
import { useCallback } from "react";
import Map, {Center, Point} from "../Map/Map";

function Ajuda() {
  const [point, setPoint] = useState<Point>();
  const zoom: number = 10
    const center: Center ={
        lat: 38.7071,
        lng: -9.13549
    }
  const pointsCallback = useCallback(
    (points: Point[]) => {
      setPoint(points[0]);
    },
    [point]
  );

  return (
    <div>
      <Map
        unique
        center = {center}
        zoom = {zoom}
        points={point === undefined ? [] : [point]}
        callback={pointsCallback}
      />
    </div>
  );
}

export default Ajuda;
