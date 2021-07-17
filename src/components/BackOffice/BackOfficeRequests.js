import classes from "./BackOfficeRequests.module.css";
import { Fragment, useEffect, useState } from "react";
import { deleteUser, listMarker } from "../../services/http";
import userIcon from "../../img/userblue.png";
import leftArrowIcon from "../../img/leftArrow.png";
import rightArrowIcon from "../../img/rightArrow.png";
import editIcon from "../../img/edit.png";
import binIcon from "../../img/bin.png";
import closeIcon from "../../img/closered.png";
import checkIcon from "../../img/check.png";
import useInput from "../hooks/use-input";
import { useSelector } from "react-redux";
import refreshIcon from "../../img/refresh.png";
import LoadingSpinner from "../UI/LoadingSpinner";
import { Link } from "react-router-dom";
import shareIcon from "../../img/share.png";

const ASC = "ASC";
const DESC = "DESC";
const DATE = "creationDate";
const PUBLIC = "PUBLIC";
const PRIVATE = "PRIVATE";
const ALL = "all";
const TITLE = "title";
const TOPICS = "topics";
const mainTitle = "Ajudas";
const firstButton = "Pedidos";
const secondButton = "Ofertas";
const pathFirstArg = "pedidos";
const pathSecondArg = "ofertas";
const location = "location";
const USER = "USER";
const MOD = "MOD";
const PARTNER = "PARTNER";
const ADMIN = "ADMIN";
const ENABLE = "ENABLE";
const DISABLE = "DISABLE";

const isNotEmpty = (value) => value.trim() !== "";

const isHelpNumber = (value) => {
  if (value >= 0) {
    return true;
  } else {
    return false;
  }
};

const BackOfficeRequests = () => {
  const [responseData, setResponseData] = useState(null);
  const [byParam, setByParam] = useState(ALL);
  const [orderParam, setOrderParam] = useState(DATE); //neste momento so suporta creationDate
  const [dirParam, setDirParam] = useState(DESC);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [disableSelect, setDisableSelect] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState("");
  const [deleteImage, setDeleteImage] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [enteredType, setEnteredType] = useState("");
  const [enteredRole, setEnteredRole] = useState("");
  const [enteredState, setEnteredState] = useState("");
  const [enableAdmin, setEnableAdmin] = useState(false);
  const [enableMod, setEnableMod] = useState(false);
  const [enablePartner, setEnablePartner] = useState(false);
  const [deletedUser, setDeletedUser] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [isFirst, setIsFirst] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isAnonimous, setIsAnonimous] = useState(false);

  const authRole = useSelector((state) => state.auth.role);

  useEffect(() => {
    setDisableSelect(false);
    if (
      refresh &&
      (byParam === ALL ||
        byParam === TOPICS ||
        (byParam === TITLE && search !== "") ||
        (byParam === location && search !== ""))
    ) {
      setIsLoading(true);

      listMarker(
        `?by=${byParam}&value=${search}&order=${orderParam}&isFirst=${isFirst}&dir=${dirParam}&number=${pageNumber}&size=${pageSize}`
      ).then(
        (response) => {
          setIsLoading(false);
          setRefresh(false);
          console.log(response.data);
          setResponseData(response.data.content);
        },
        (error) => {
          setIsLoading(false);
          setRefresh(false);
          console.log(error);
        }
      );
    }
  }, [
    pageNumber,
    byParam,
    orderParam,
    dirParam,
    pageNumber,
    pageSize,
    refresh,
    isFirst,
  ]);

  useEffect(() => {
    setPageNumber(0);
  }, [isFirst]);

  useEffect(() => {
    setIsLoading(false);
  }, [responseData]);

  useEffect(() => {
    setSearch("");
  }, [byParam]);

  const changeFilterHandler = (event) => {
    setByParam(event.target.value);
    setDisableSelect(true);
    setRefresh(true);
  };

  const changeOrderHandler = (event) => {
    setDirParam(event.target.value);
    setDisableSelect(true);
    setRefresh(true);
  };

  const changePageSizeHandler = (event) => {
    setPageSize(parseInt(event.target.value));
    setDisableSelect(true);
    setRefresh(true);
  };

  const nextPageHandler = () => {
    setPageNumber((prevState) => {
      if (responseData.length === pageSize) {
        setRefresh(true);
        return prevState + 1;
      } else {
        return prevState;
      }
    });
  };

  const prevPageHandler = () => {
    setPageNumber((prevState) => {
      if (prevState > 0) {
        setRefresh(true);
        return prevState - 1;
      } else {
        return prevState;
      }
    });
  };

  const deleteImageHandler = () => {
    setDeleteImage(true);
  };

  const editUserHandler = (username) => {
    setIsEditing(username);
  };

  const formatDate = (longDate) => {
    const date = new Date(longDate);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const searchBarClass =
    byParam === TITLE ? classes.searchBar : classes.searchBarHidden;

  const autoComplete =
    byParam === location ? classes.autoComplete : classes.autoCompleteHidden;

  const {
    value: enteredFirstName,
    isValid: enteredFirstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
    setValueHandler: setFirstNameValueHandler,
  } = useInput(isNotEmpty);

  const {
    value: enteredLastName,
    isValid: enteredLastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
    setValueHandler: setLastNameValueHandler,
  } = useInput(isNotEmpty);

  const {
    value: enteredHelps,
    isValid: enteredHelpsIsValid,
    hasError: enteredHelpsHasError,
    valueChangeHandler: enteredHelpsChangeHandler,
    inputBlurHandler: enteredHelpsBlurHandler,
    setValueHandler: setHelpsValueHandler,
  } = useInput(isHelpNumber);

  const checkRoleHandler = () => {
    switch (authRole) {
      case ADMIN:
        setEnableAdmin(true);
        setEnableMod(true);
        setEnablePartner(true);
        break;
      case MOD:
        setEnablePartner(true);
        setEnableMod(true);
        break;
      default:
    }
  };

  useEffect(() => {
    if (isEditing != "") {
      for (const user of responseData) {
        if (user.username === isEditing) {
          setFirstNameValueHandler(user.firstName);
          setLastNameValueHandler(user.lastName);
          setIsCompany(user.company);
          setHelpsValueHandler(user.numHelps);
          setEnteredType(user.privacy);
          setEnteredRole(user.role);
          checkRoleHandler();
          break;
        }
      }
    }
  }, [isEditing]);

  const isCompanyHandler = (event) => {
    setIsCompany(event.target.value);
  };

  const isAnonimousHandler = (event) => {
    setIsAnonimous(event.target.value);
  };

  const typeHandler = (event) => {
    setEnteredType(event.target.value);
  };

  const isActiveHandler = (event) => {
    setIsActive(event.target.value);
  };

  const stateHandler = (event) => {
    setEnteredState(event.target.value);
  };

  const onRefreshHandler = () => {
    setRefresh(true);
  };

  let formIsValid = false;

  if (
    enteredFirstNameIsValid &&
    enteredLastNameIsValid &&
    enteredHelpsIsValid
  ) {
    formIsValid = true;
  }

  const onSubmitChangesHandler = () => {
    if (!formIsValid) {
      return;
    }

    setIsLoading(true);

    //mandar ao servidor mudanças
    setRefresh(true);
    setIsLoading(false);
    setIsEditing("");
  };

  const onDeleteRequestHandler = (requestID) => {
    if (
      window.confirm(
        "Tem a certeza que pretende apagar esta conta? Esta ação é irreversível."
      )
    ) {
      setIsLoading(true);

      deleteUser(requestID).then(
        (response) => {
          setIsLoading(false);
          setRefresh(true);
        },
        (error) => {
          setIsLoading(false);
          console.log(error);
        }
      );
    } else {
      return;
    }
  };

  const navButtonClass = isLoading ? classes.hideButton : classes.navPage;
  const sizeButtonClass = isLoading ? classes.hideButton : classes.sizeButtons;

  const filterButtons = (
    <div className={classes.filterButtons}>
      <label htmlFor="filters">Filtrar</label>
      <select
        id="filters"
        value={byParam}
        onChange={changeFilterHandler}
        className={classes.selectSub}
        disabled={disableSelect}
      >
        <option value={ALL}>Mostrar Tudo</option>
      </select>
    </div>
  );

  const orderButtons = (
    <div className={classes.orderButtons}>
      <label htmlFor="order">Ordenar</label>
      <select
        id="order"
        value={dirParam}
        onChange={changeOrderHandler}
        className={classes.selectSub}
        disabled={disableSelect}
      >
        <option value={DESC}>Mais Recentes</option>
        <option value={ASC}>Mais Antigos</option>
      </select>
    </div>
  );

  const sizeButtons = (
    <div className={sizeButtonClass}>
      <label htmlFor="size">Ver</label>
      <select
        id="size"
        value={pageSize}
        onChange={changePageSizeHandler}
        className={classes.selectSub}
        disabled={disableSelect}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={15}>15</option>
      </select>
    </div>
  );

  const navPageButtons = (
    <div className={navButtonClass}>
      <img
        src={leftArrowIcon}
        alt="página-anteriro"
        onClick={prevPageHandler}
        className={classes.navArrow}
      />
      <span className={classes.pageNumber}>{pageNumber}</span>
      <img
        src={rightArrowIcon}
        alt="página-seguinte"
        onClick={nextPageHandler}
        className={classes.navArrow}
      />
    </div>
  );

  const tableHead = (
    <thead>
      <tr className={classes.topicsContainer}>
        <th className={classes.idContainer}>ID</th>
        <th className={classes.activeContainer}>Activo</th>
        <th className={classes.orgContainer}>Organização</th>
        <th className={classes.usernameContainer}>Criador</th>
        <th className={classes.anonimousContainer}>Anónimo</th>
        <th className={classes.typeContainer}>Tipo</th>
        <th className={classes.generalContainer}>Tipo Geral</th>
        <th className={classes.titleContainer}>Título</th>
        <th className={classes.descriptionContainer}>Descrição</th>
        <th className={classes.numContainer}>Total Voluntários</th>
        <th className={classes.helpersContainer}>Total Inscritos</th>
        <th className={classes.helperUserContainer}>Inscritos</th>
        <th className={classes.localContainer}>Localização</th>
        <th className={classes.difficultyContainer}>Dificuldade</th>
        <th className={classes.dateContainer}>Data Criação</th>
        <th className={classes.imgContainer}>Imagens</th>
        <th>Ações</th>
      </tr>
    </thead>
  );

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Informação sobre Pedidos</h1>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.mainSubContainer}>
        {filterButtons}
        {orderButtons}
        <img
          src={refreshIcon}
          alt="Atualizar"
          onClick={onRefreshHandler}
          className={classes.refresh}
        />
        <table className={classes.subContainer}>
          {tableHead}
          <tbody>
            {responseData &&
              responseData.map((request) =>
                isEditing !== request.id ? (
                  <tr key={request.id} className={classes.topicsContainer}>
                    <td className={classes.idContainer}>{request.id}</td>
                    <td className={classes.activeContainer}>
                      {request.activeMarker ? "True" : "False"}
                    </td>
                    <td className={classes.orgContainer}>
                      {request.company ? "True" : "False"}
                    </td>
                    <td className={classes.usernameContainer}>
                      {request.owner}
                    </td>
                    <td className={classes.anonimousContainer}>
                      {request.anonymousOwner ? "True" : "False"}
                    </td>
                    <td className={classes.typeContainer}>{request.type}</td>
                    <td className={classes.generalContainer}>
                      {request.generalType}
                    </td>
                    <td className={classes.title}>{request.title}</td>
                    <td className={classes.descriptionContainer}>
                      {request.description}
                    </td>
                    <td className={classes.numContainer}>
                      {request.helpersCapacity}
                    </td>
                    <td className={classes.helpersContainer}>
                      {request.currentHelpers}
                    </td>
                    <td className={classes.helperUserContainer}>
                      <ul>
                        {request.helperUsernames &&
                          request.helperUsernames.map((user, idx) => (
                            <li key={idx}>
                              <Link to={`/perfil/${user}`}>{user}</Link>
                            </li>
                          ))}
                      </ul>
                    </td>
                    <td className={classes.localContainer}>
                      {request.location}
                    </td>
                    <td className={classes.difficultyContainer}>
                      {request.difficulty}
                    </td>
                    <td className={classes.dateContainer}>
                      {formatDate(request.creationDate)}
                    </td>
                    <td className={classes.imgContainer}>
                      <ul>
                        {request.photoGalery &&
                          request.photoGalery.map((img, index) => {
                            <li key={index}>
                              <img
                                src={img}
                                alt={`foto-pedido-${index}`}
                                className={classes.requestImg}
                              />
                            </li>;
                          })}
                      </ul>
                    </td>
                    <td className={classes.iconsContainer}>
                      <img
                        src={editIcon}
                        alt="editar"
                        className={classes.iconRow}
                        onClick={() => editUserHandler(request.id)}
                      />
                      <img
                        src={binIcon}
                        alt="apagar"
                        className={classes.iconRow}
                        onClick={() => onDeleteRequestHandler(request.id)}
                      />
                      <Link to={`/editar/${request.id}`}>
                        <img
                          src={shareIcon}
                          alt="link-perfil"
                          className={classes.iconRow}
                        />
                      </Link>
                    </td>
                  </tr>
                ) : (
                  <tr key={request.id} className={classes.topicsContainer}>
                    <td className={classes.idContainer}>{request.id}</td>
                    <td className={classes.activeContainer}>
                      <select
                        id="active"
                        value={isActive}
                        onChange={isActiveHandler}
                        className={classes.selectSub}
                      >
                        <option value={true}>True</option>
                        <option value={false}>False</option>
                      </select>
                    </td>
                    <td className={classes.orgContainer}>
                      <select
                        id="company"
                        value={isCompany}
                        onChange={isCompanyHandler}
                        className={classes.selectSub}
                      >
                        <option value={true}>True</option>
                        <option value={false}>False</option>
                      </select>
                    </td>
                    <td className={classes.usernameContainer}>
                      {request.owner}
                    </td>
                    <td className={classes.anonimousContainer}>
                      <select
                        id="anonimous"
                        value={isAnonimous}
                        onChange={isAnonimousHandler}
                        className={classes.selectSub}
                      >
                        <option value={true}>True</option>
                        <option value={false}>False</option>
                      </select>
                    </td>
                    <td className={classes.typeContainer}>
                      <select
                        id="type"
                        value={enteredType}
                        onChange={typeHandler}
                        className={classes.selectSub}
                      >
                        <option value={USER}>USER</option>
                        {enablePartner && (
                          <option value={PARTNER}>PARTNER</option>
                        )}
                        {enableMod && <option value={MOD}>MOD</option>}
                        {enableAdmin && <option value={ADMIN}>ADMIN</option>}
                      </select>
                    </td>

                    <td className={classes.nameContainer}>
                      <input
                        type="text"
                        id="firstName"
                        value={enteredFirstName}
                        onChange={firstNameChangeHandler}
                        onBlur={firstNameBlurHandler}
                      />
                      {firstNameHasError && <p>Por favor insira um nome.</p>}
                    </td>
                    <td className={classes.lastNameContainer}>
                      <input
                        type="text"
                        id="lastName"
                        value={enteredLastName}
                        onChange={lastNameChangeHandler}
                        onBlur={lastNameBlurHandler}
                      />
                      {lastNameHasError && <p>Por favor insira um apelido.</p>}
                    </td>
                    <td className={classes.orgContainer}>
                      <select
                        id="company"
                        value={isCompany}
                        onChange={isCompanyHandler}
                        className={classes.selectSub}
                      >
                        <option value={true}>True</option>
                        <option value={false}>False</option>
                      </select>
                    </td>
                    <td className={classes.dateContainer}>
                      {formatDate(request.creationDate)}
                    </td>
                    <td className={classes.numContainer}>
                      <input
                        type="number"
                        id="numberVolunteers"
                        value={enteredHelps}
                        onChange={enteredHelpsChangeHandler}
                        onBlur={enteredHelpsBlurHandler}
                        min="0"
                      />
                      {enteredHelpsHasError && (
                        <p className={classes.inputError}>
                          Por favor insira um número de ajudas
                        </p>
                      )}
                    </td>
                    <td className={classes.iconsContainer}>
                      <img
                        src={checkIcon}
                        alt="aceitar"
                        className={classes.iconRow}
                        onClick={onSubmitChangesHandler}
                      />
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>
      {navPageButtons}
      {sizeButtons}
    </div>
  );
};

export default BackOfficeRequests;