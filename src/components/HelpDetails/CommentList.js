import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "../UI/Button";
import Comment from "./Comment";
import NewComment from "./NewComment";
import useInput from "../hooks/use-input";
import classes from "./CommentList.module.css";
import refreshIcon from "../../img/refresh.png";
import { listComments } from "../../services/http";
import { useRouteMatch } from "react-router";

const dummy_data = [
  {
    ownerPicture: "",
    ownerFirstName: "Daniel",
    ownerLastName: "Silva",
    text: "Adoraria Poder Ajudar..",
    date: "15-05-2020",
  },
  {
    ownerPicture: "",
    ownerFirstName: "Maria",
    ownerLastName: "Gaspar",
    text: "Boa ação..",
    date: "15-04-2020",
  },
];

const ASC = "ASC";
const DESC = "DESC";
const DATE = "creationDate";
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_MINUTE = 1000 * 60;
const ALL = "markerId";

const isNotEmpty = (value) => value.trim() !== "";

//get List of comments
const CommentsList = (props) => {
  const match = useRouteMatch();
  const requestId = match.params.requestId;

  const authUsername = useSelector((state) => state.auth.username);
  const authRole = useSelector((state) => state.auth.role);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [byParam, setByParam] = useState(ALL);
  const [orderParam, setOrderParam] = useState(DATE); //neste momento so suporta creationDate
  const [dirParam, setDirParam] = useState(DESC);
  const [pageNumber, setPageNumber] = useState(0);
  const [value, setValue] = useState(requestId);
  const [isLoading, setIsLoading] = useState(false);
  const [disableSelect, setDisableSelect] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [refresh, setRefresh] = useState(true);
  const [responseData, setResponseData] = useState("");

  useEffect(() => {
    listComments(
      `?by=${byParam}&order=${orderParam}&dir=${dirParam}&number=${pageNumber}&size=${pageSize}&value=${value}`
    ).then(
      (response) => {
        console.log(response.data);
        setResponseData(response.data);
      },
      (error) => {
        console.log(error);
      }
    );
  }, [byParam, orderParam, dirParam, pageNumber, pageSize, value, refresh]);

  const {
    value: enteredNewComment,
    isValid: enteredNewCommentIsValid,
    hasError: NewCommentHasError,
    valueChangeHandler: newCommentChangeHandler,
    reset: resetNewCommentInput,
  } = useInput(isNotEmpty);

  const newCommentHandler = (event) => {
    event.preventDefault();

    let today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; //January is 0!
    const yyyy = today.getFullYear();

    today = dd + "-" + mm + "-" + yyyy;

    dummy_data.unshift({
      ownerPicture: "",
      ownerFirstName: authUsername,
      ownerLastName: "SSS",
      text: commentText,
      date: today,
    });

    setCommentText("");
  };

  const formatDate = (longDate) => {
    const now = new Date(Date.now());
    const date = new Date(longDate);

    const nowDate = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const serverDate = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const formatDateDDMMYY = (longDate) => {
      const date = new Date(longDate);
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    };

    const diffInDays = Math.floor((nowDate - serverDate) / MS_PER_DAY);
    if (diffInDays < 1) {
      const hours = Math.abs(now - date) / MS_PER_HOUR;
      const minutes = Math.abs(now - date) / MS_PER_MINUTE;
      const roundedHours = Math.round(hours);
      const roundedMinutes = Math.round(minutes);

      if (roundedHours === 24) {
        return `${diffInDays} dia atrás`;
      } else if (hours < 1) {
        return `${minutes < 1 ? 1 : roundedMinutes} ${
          roundedMinutes <= 1 ? "minuto" : "minutos"
        } atrás`;
      } else if (roundedHours > hours) {
        return `< ${roundedHours} ${
          roundedHours === 1 ? "hora" : "horas"
        } atrás`;
      } else if (roundedHours < hours) {
        return `> ${roundedHours} ${
          roundedHours === 1 ? "hora" : "horas"
        } atrás`;
      } else {
        return `${roundedHours} ${roundedHours === 1 ? "hora" : "horas"} atrás`;
      }
    } else {
      return `${diffInDays} dias atrás`;
    }
  };

  return (
    <div className={classes.mainContainer}>
      {props.isOwner && (
        <div className={classes.newComment}>
          <NewComment
            newCommentHandler={newCommentHandler}
            enteredDescription={enteredNewComment}
            onChange={newCommentChangeHandler}
            isValid={enteredNewCommentIsValid}
            images={selectedFiles}
            fileChangeHandler={setSelectedFiles}
          />
        </div>
      )}
      <img
        src={refreshIcon}
        alt="atualizar-comentarios"
        className={classes.refresh}
      />
      <ol className={classes.commentList}>
        {dummy_data.map((comment, index) => (
          <li key={index} className={classes.comment}>
            <Comment
              ownerEmail={comment.ownerEmail}
              ownerPicture={comment.ownerPicture}
              ownerFirstName={comment.ownerFirstName}
              ownerLastName={comment.ownerLastName}
              text={comment.text}
              date={comment.date}
            />
          </li>
        ))}
      </ol>
      <div className={classes.buttonContainer}>
        <Button text="Carregar Mais" />
      </div>
    </div>
  );
};

export default CommentsList;
