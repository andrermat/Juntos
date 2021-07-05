import React, { useCallback, useState } from "react";
import Map, {Center, Point} from "../Map/Map";

function Percurso() {
<<<<<<< Updated upstream
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
=======
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
            setPoint(points);
        },
        [point]
    );

    return (
        <div>
            <Map center = {center} zoom = {zoom} points={point} callback={pointsCallback} />
        </div>
    );
>>>>>>> Stashed changes
}

export default Percurso;
