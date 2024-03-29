import { useCallback, useEffect, useState } from "react";
import Map, { Bounds, Center, Point } from "../Map/Map";
import { getMarkers } from "../../services/http";
import SideBySideButtons from "../UI/SideBySideButtons";
import classes from "./TodasAjudas.module.css";
import LoadingSpinner from "../UI/LoadingSpinner";

const HELP_REQUEST = "REQUEST";
const HELP_OFFER = "OFFER";
const initialBounds: Bounds = {
  latLower: 38.575291199755526,
  lngLower: -9.428419410934456,
  latTop: 38.83652687020928,
  lngTop: -8.84256058906556,
};
const initialCenter: Center = {
  lat: 38.7071,
  lng: -9.13549,
};

function TodasAjudas() {
  const [point, setPoint] = useState<Point[]>([]);
  const [pedido, setPedido] = useState<string>(HELP_REQUEST);
  const [center, setCenter] = useState<Center>(initialCenter);

  const [bounds, setBounds] = useState<Bounds>(initialBounds);

  const callbackBound = useCallback(
    (bound: Bounds) => {
      setBounds(bound);
    },
    [bounds]
  );
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      function (error) {
        console.error("Error Code = " + error.code + " - " + error.message);
      }
    );
  }, []);

  const callbackC = useCallback(
    (center: Center) => {
      setCenter(center);
    },
    // eslint-disable-next-line
    [center]
  );

  const pointsCallback = useCallback(
    (points: Point[]) => {
      setPoint(points);
    },
    [point]
  );
  useEffect(() => {
    getMarkers(
      bounds.latLower,
      bounds.lngLower,
      bounds.latTop,
      bounds.lngTop
    ).then(
      (response) => {
        let newVec: Point[] = response.data;
        for (let i = 0; i < newVec.length; i++) {
          newVec[i].lat = parseFloat(response.data[i].points[0].lat);
          newVec[i].lon = parseFloat(response.data[i].points[0].lon);
          newVec[i].type = response.data[i].type;
        }
        setPoint(newVec);
      },
      (error) => {}
    );
  }, [bounds]);

  const requestHandler = () => {
    setPedido(HELP_REQUEST);
  };

  const offerHandler = () => {
    setPedido(HELP_OFFER);
  };

  return (
    <div className={classes.mainContainer}>
      <h1 className={classes.title}>Ajudas Disponíveis</h1>
      <div className={classes.subContainer}>
        <div className={classes.sideButtons}>
          <SideBySideButtons
            button1="Pedidos"
            button2="Ofertas"
            onClick1={requestHandler}
            onClick2={offerHandler}
            isButton1={pedido === HELP_REQUEST}
          />
        </div>
        <div className={classes.map}>
          <Map
            noAdd
            bounds={bounds}
            typeSelected={pedido}
            noRoute
            cluster
            points={point}
            dangerPoints={[]}
            interestPoints={[]}
            center={center}
            callback={pointsCallback}
            callbackBounds={callbackBound}
            callbackC={callbackC}
          />
        </div>
      </div>
    </div>
  );
}

export default TodasAjudas;
