import { useState } from "react";
import { completeMarker } from "../../services/http";
import useInput from "../hooks/use-input";
import classes from "./InputPassword.module.css";
import LoadingSpinner from "../UI/LoadingSpinner";
import { snackActions } from "../../store/snackBar/snack";
import { useDispatch } from "react-redux";

const isMarkerPassword = (value) =>
  value.trim().length >= 3 && value.trim().length <= 128;

const InputPassword = (props) => {
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    value: enteredPass,
    isValid: enteredPassIsValid,
    hasError: passHasError,
    valueChangeHandler: passChangeHandler,
    inputBlurHandler: passBlurHandler,
  } = useInput(isMarkerPassword); //pass func to validate

  let formIsValid = false;

  if (enteredPassIsValid && rating > 0) {
    formIsValid = true;
  }

  const passwordSubmitHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    setIsLoading(true);

    completeMarker(props.markerId, enteredPass, rating).then(
      (response) => {
        setIsLoading(false);
        props.refreshHandler(true);
        dispatch(
          snackActions.setSnackbar({
            snackBarOpen: true,
            snackBarType: "success",
            snackBarMessage: "Evento completado com sucesso!",
          })
        );
      },
      (error) => {
        setIsLoading(false);
        if (error && error.status === 400) {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "warning",
              snackBarMessage: "Password Errada.",
            })
          );
        } else if (error && error.status === 403) {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "warning",
              snackBarMessage:
                "Não podes completar um evento do qual não fizeste parte.",
            })
          );
        } else if (error && error.status !== 401) {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "error",
              snackBarMessage:
                "Algo inesperado aconteceu, por favor tenta novamente. Se o error persistir contacta-nos",
            })
          );
        }
      }
    );
  };

  return (
    <div className={classes.container}>
      <h6 className={classes.title}>
        Concluiste esta ajuda e tens uma password?
      </h6>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <form onSubmit={passwordSubmitHandler} className={classes.passContainer}>
        <label htmlFor="pass" className={classes.labelPass}>
          Insere-a aqui para que conte:
        </label>
        <input
          type="text"
          id="pass"
          value={enteredPass}
          onChange={passChangeHandler}
          onBlur={passBlurHandler}
          className={classes.inputPass}
          disabled={props.isOwner}
          minLength={3}
          maxLength={128}
        />
        {passHasError && (
          <p className={classes.errorPass}>
            Por favor insere uma password válida
          </p>
        )}
        <span className={classes.rating}>O que achaste da ação?</span>
        <div className={classes.starRating}>
          {[...Array(3)].map((star, index) => {
            index += 1;
            return (
              <button
                type="button"
                key={index}
                className={index <= rating ? `${classes.on}` : `${classes.off}`}
                onClick={() => setRating(index)}
              >
                <span className="star">&#9733;</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={passwordSubmitHandler}
          className={classes.buttonPass}
          disabled={props.isOwner || !formIsValid}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default InputPassword;
