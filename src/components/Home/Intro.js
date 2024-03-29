import { Link } from "react-router-dom";
import classes from "./Intro.module.css";

const Intro = () => {
  return (
    <div className={classes.containerDiv}>
      <Link className={classes.navLinkHidden} to="/home#app">
        Olá, estás num telemóvel? Faz aqui download da nossa App!
      </Link>
      <div className={classes.mainImageDiv}>
        <div className={classes.hDiv}>
          <h1 className={classes.hFirst}>Temos um longo caminho pela frente</h1>
          <h1 className={classes.hSecond}>
            ... e finalmente podemos caminhar{" "}
            <span className={classes.juntosTitle}>juntos</span>
          </h1>
        </div>
      </div>

      <div className={classes.mainContent}>
        <p>
          <span className={classes.juntos}>juntos</span> é um projeto que
          procura ajudar após a pandemia SARS-CoV-2.
        </p>
        <p>
          <span className={classes.juntos}>juntos</span> procura incentivar a
          cooperação e entreajuda de todos para todos.
        </p>
        <p>
          Finalmente podemos caminhar{" "}
          <span className={classes.juntos}>juntos</span> para um futuro melhor.
        </p>
      </div>
      <div className={classes.mainVideo}>
      </div>
    </div>
  );
};

export default Intro;
