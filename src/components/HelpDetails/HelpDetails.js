import { useCallback, useEffect, useState } from "react";
import Button from "../UI/Button";
import CommentList from "./CommentList";
import HelpTitle from "./HelpTitle";
import ImageDisplay from "./ImageDisplay";
//import ShareHelp from "./ShareHelp";
import UserDisplay from "./UserDisplay";
import { Route, Link, useRouteMatch } from "react-router-dom";
import classes from "./HelpDetails.module.css";
import { joinMarker, leaveMarker, markerDetails } from "../../services/http";
import offerHelpIcon from "../../img/helpIcon.png";
import requestHelpIcon from "../../img/hand.png";
import donateIcon from "../../img/box.png";
import actionIcon from "../../img/walk.png";
import LoadingSpinner from "../UI/LoadingSpinner";
import InputPassword from "./InputPassword";
import gS from "../../services/generalServices.json";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/session/auth";
import Map from "../Map/Map";

let text = "";

const HelpDetails = (props) => {
  const dispatch = useDispatch();

  const [responseData, setResponseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [point, setPoint] = useState([]);
  const [isHelper, setIsHelper] = useState(false);

  const center =
    point.length > 0
      ? { lat: point[0].lat, lng: point[0].lon }
      : {
          lat: 38.7071,
          lng: -9.13549,
        };
  const zoom = 10;

  const pointsCallback = useCallback(
    (points) => {
      setPoint(points);
    },
    [point]
  );

  const match = useRouteMatch();
  const helpId = match.params.requestId;

  const loggedUsername = useSelector((state) => state.auth.username);

  useEffect(() => {
    setIsLoading(true);
    markerDetails(helpId).then(
      (response) => {
        console.log(response.data);
        setResponseData(response.data);
        let responsePoints = response.data.points;
        responsePoints.map((point) => {
          point.lat = parseFloat(point.lat);
          point.lon = parseFloat(point.lon);
        });
        setPoint(responsePoints);
        if (response.data.helperUsernames.includes(loggedUsername)) {
          setIsHelper(true);
        }
        typeHandler(response.data.type);
      },
      (error) => {
        console.log(error);
        setIsLoading(false);
        if (error.status === 401) {
          alert("Sessão expirou");
          dispatch(authActions.logout());
          localStorage.removeItem(gS.storage.token);
        }
      }
    );
  }, [helpId]);

  useEffect(() => {
    setIsLoading(false);
  }, [responseData]);

  const typeHandler = (type) => {
    switch (type) {
      case "HELP_OFFER":
        text = "Aceitar Ajuda";
        return offerHelpIcon;
      case "HELP_REQUEST":
        text = "Oferecer Ajuda";
        return requestHelpIcon;
      case "DONATE":
        text = "Aceitar Doação";
        return donateIcon;
      case "ACTION":
        text = "Participar";
        return actionIcon;
    }
  };

  let isOwner = false;

  if (responseData.owner === loggedUsername) {
    isOwner = true;
  }

  const joinHelpHandler = () => {
    setIsLoading(true);
    joinMarker(helpId).then(
      (response) => {
        setIsLoading(false);
        setIsHelper(true);
        console.log(response);
      },
      (error) => {
        setIsLoading(false);
        console.log(error);
      }
    );
  };

  const onLeaveHandler = () => {
    setIsLoading(true);
    leaveMarker(helpId).then(
      (response) => {
        setIsLoading(false);
        setIsHelper(false);
        console.log(response);
      },
      (error) => {
        setIsLoading(false);
        console.log(error);
      }
    );
  };

  return (
    <div className={classes.mainContainer}>
      <h1 className={classes.title}>
        <img src={typeHandler(responseData.type)} alt={responseData.type} />
        {responseData.title}
      </h1>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.subContainer}>
        <div className={classes.mapContent}>
          <Map
            noAdd
            noPlaces
            points={point}
            center={center}
            zoom={zoom}
            callback={pointsCallback}
          />
        </div>
        <div className={classes.infoContent}>
          <div className={classes.helpTitle}>
            <HelpTitle
              title={responseData.title}
              helpType={responseData.type}
              creationDate={responseData.creationDate}
              volunteers={responseData.helpersCapacity}
              difficulty={responseData.difficulty}
            />
          </div>
          <div className={classes.userDisplay}>
            <UserDisplay
              username={responseData.owner}
              profileImg={
                responseData.anonymousOwner ? "" : responseData.profileImg
              }
              firstName={responseData.firstName}
              lastName={
                responseData.anonymousOwner ? "" : responseData.lastName
              }
              numHelps={responseData.numHelps}
              isAnonimous={responseData.anonymousOwner}
              company={responseData.company}
            />
          </div>
          <div className={classes.imageDisplay}>
            <ImageDisplay images={responseData.photoGalery} />
          </div>
          <div className={classes.description}>
            <h6 className={classes.subTitle}>Descrição</h6>
            <p>{responseData.description}</p>
          </div>
          <div className={classes.inputPass}>
            <InputPassword isOwner={isOwner} markerId={helpId} />
          </div>
          {!isOwner && (
            <div className={classes.buttonDisplay}>
              <Button
                text={text}
                onClick={joinHelpHandler}
                disabled={isHelper}
              />
              {isHelper && (
                <span
                  className={classes.participating}
                  onClick={onLeaveHandler}
                >
                  Estás a participar! Clica aqui para desistir.
                </span>
              )}
            </div>
          )}
        </div>
        <div className={classes.commentContent}>
          <Route path={match.path} exact>
            <div>
              <Link to={`${match.url}/comentarios`}>Carregar Comentários</Link>
            </div>
          </Route>
          <Route path={`${match.path}/comentarios`}>
            <CommentList isOwner={isOwner} />
          </Route>
        </div>
      </div>
    </div>
  );
};

export default HelpDetails;
//estamos a carregar comments dentro de uma route para nao termos que os ter la diretamente
//assim so carregamos se user quiser ver os comments, salva-nos um pedido ao server que ate
//podera ser enorme.
//ter link dentro de route faz com que o react router faça desaparecer o link

/*          <ShareHelp />
 */
