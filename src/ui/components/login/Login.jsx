import useStyles from './Login.style';
import scute from '../../../assets/images/scute.svg';
import logoSM from '../../../assets/images/logoSM.svg';
import Credentials from '../forms/Credentials';
import ButtonSM from '../forms/ButtonSM';
import signIn from '../../../assets/icons/signinLog.svg';
import { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from "react-router-dom"
import { useSnackbar, enqueueSnackbar } from 'notistack';

const Login = () => {
  const classes = useStyles();
  const [user,setUser] = useState();
  const [password,setPassword] = useState();

  const navigator = useNavigate();


  const onUserChange = (value) => {
    setUser(value);
  }

  const onPasswordChange = (value) => {
    setPassword(value);
  }

  const redirect = (rol) => {
    switch (rol) {
      case 'Estudiante':
          navigator('/student');
      break;
      case 'Docente':
      navigator('/teacher');
      break;
      case 'Secretario':
      navigator('/secretary');
      break;
      case 'Administrador':
      navigator('/admin');
      break;
      case 'SuperUsuario':
      navigator('/admin');
      break;
      default:
      navigator('/login');
      break;
  }
  }

  const handleLogin = () => {
    const Credentials = {
      user,
      password
    }
    Axios.post(`${process.env.REACT_APP_SERVER_HOST}/api/login`, Credentials)
      .then((res) => {
        localStorage.setItem('credentialSM',JSON.stringify(res.data.data));
        redirect(res.data.data.rol);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.imageContainer}>
        <img className={classes.image} src={scute} alt="scute" />
      </div>

      <div className={classes.logContainer}>
        <div className={classes.log}>
          <div className={classes.subtitle}>
            <img src={logoSM} alt="logo" />
            <p className={classes.subtitle1}>INSTITUTO TÉCNICO</p>
            <p className={classes.title}>SAN MARTÍN</p>
          </div>
          <Credentials nameUser={user} passwordUser={password} onUserChange={onUserChange} onPasswordChange={onPasswordChange}/>
          <div className={classes.containerButton}>
            <ButtonSM icon={signIn} text="Iniciar Sesión" className={classes.icon} onClick={handleLogin}/>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
