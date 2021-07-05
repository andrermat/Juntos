import React, { useCallback, useState } from "react";
import Map, {Center, Point} from "../Map/Map";

function Percurso() {
  const [point, setPoint] = useState<Point[]>([]);
    const zoom: number = 10
    const center: Center ={
        lat: 38.7071,
        lng: -9.13549
    }
  const pointsCallback = useCallback(
    (points: Point[]) => {
      setPoint(points);
    },
    [point]
  );

  return (
    <div>
      <Map center = {center} zoom = {zoom} points={point} callback={pointsCallback} />
    </div>
  );
}

export default Percurso;
