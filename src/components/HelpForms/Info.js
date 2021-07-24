import MultipleUpload from "./MultipleUpload";
import classes from "./Info.module.css";
import backIcon from "../../img/back.png";
import donateIcon from "../../img/volunteersdonate.jpg";

const Info = (props) => {
  return (
    <div className={classes.container}>
      {props.editing ? (
        <h1 className={classes.title}>
          <span className={classes.numberEdit}>1</span>
          <span className={classes.selectedTitle}>{props.selected}</span>
        </h1>
      ) : (
        <h1 className={classes.title}>
          <img
            src={backIcon}
            alt="página-anterior"
            className={classes.back}
            onClick={props.back}
          />
          <span className={classes.number}>2</span>
          <span className={classes.selectedTitle}>{props.selected}</span>
        </h1>
      )}
      <div className={classes.inputTitle}>
        <label htmlFor="title">Título</label>
        <input
          type="text"
          id="title"
          minLength="4"
          maxLength="40"
          value={props.enteredTitle}
          onChange={props.titleChangeHandler}
          onBlur={props.titleBlurHandler}
        />
        {props.titleHasError && (
          <p className={classes.infoError}>Por favor insira um título.</p>
        )}
      </div>
      <div className={classes.inputPass}>
        <label htmlFor="pass">Define uma Password</label>
        <input
          type="text"
          id="pass"
          value={props.enteredPass}
          onChange={props.passChangeHandler}
          onBlur={props.passBlurHandler}
          disabled={props.editing}
        />
        <span>
          Dá esta password às pessoas que te ajudarem para que a ajuda conte.
          Não a partilhes antes do final do evento.
        </span>
        {props.passHasError && (
          <p className={classes.infoError}>Por favor defina uma password</p>
        )}
      </div>
      <div className={classes.description}>
        <label htmlFor="help">Descrição</label>
        <textarea
          id="help"
          rows="4"
          minLength="10"
          maxLength="5000"
          value={props.enteredDescription}
          onChange={props.descriptionChangeHandler}
          onBlur={props.descriptionBlurHandler}
        >
          Descrição...
        </textarea>
        {props.descriptionHasError && (
          <p className={classes.infoError}>Por favor insira uma descrição.</p>
        )}
      </div>
      <div className={classes.imageUpload}>
        <div className={classes.multiUpload}>
          <MultipleUpload
            fileChangeHandler={props.fileChangeHandler}
            images={props.images}
          />
        </div>
        {props.hasImage && (
          <img
            src={donateIcon}
            alt="Adicionar-Imagens"
            className={classes.donateImage}
          />
        )}
      </div>
    </div>
  );
};

export default Info;
