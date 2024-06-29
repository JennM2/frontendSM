import { useEffect, useState } from "react";
import Axios from "axios";

import useStyles from "./Perfile.style";
import adminStyles from "../Admin.style";
import perfilPicture from "../../../../assets/icons/UserPerfil.svg";
import { ReactComponent as EditIcon } from "../../../../assets/icons/edit.svg";
import CredentialsDisabled from "../../forms/CredentialsDisabled";
import DynamicInputsDisabled from "../../forms/DynamicInputsDisabled";

const Perfil = ({ nameUser }) => {
  const classes = useStyles();
  const adminClasses = adminStyles();
  const [hover] = useState(false);
  const [image] = useState(perfilPicture);
  const [data, setData] = useState({});

const token = JSON.parse(localStorage.getItem('credentialSM'));


  const loadData = () => {
    Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/users/profile/${token.idUser}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(loadData,[token.idUser]);

  const fieldsf = [
    {
      label: "Apellido Paterno",
      placeholder: "",
      type: "text",
      id: "paterno",
    },
    {
      label: "Apellido Materno",
      placeholder: "",
      type: "text",
      id: "materno",
    },
    {
      label: "Nombre",
      placeholder: "",
      type: "",
      id: "names",
    },
    {
      label: "CI",
      placeholder: "",
      type: "text",
      id: "ci",
    },
    {
      label: "Correo electrónico",
      placeholder: "correo@gmail.com",
      type: "email",
      id: "email",
    },
  ];

  return (
    <div className={adminClasses.content}>
      <div className={classes.title}>
        <p className={adminClasses.text}>PERFIL</p>
        <hr className={adminClasses.lineTitle} />
      </div>
      <div className={classes.contentPerfil}>
        <div className={classes.userPerfil}>
          <div className={`${classes.perfilPicture} ${hover}`}>
            {hover && (
              <div className={classes.editOverlay}>
                <EditIcon className={classes.iconEditOverlay} />
                <p>Editar perfil</p>
              </div>
            )}
            <img className={classes.picture} src={image} alt="perfil" />
          </div>
          <CredentialsDisabled
            nameUser={data.user}
            passwordUser={data.password}
            password={false}
          />
        </div>
        <div className={classes.containerInputs}>
          <DynamicInputsDisabled fieldsf={fieldsf} values={data}/>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
