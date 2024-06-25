import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useStyles from './Student.style';
import NavMenu from '../menu/NavMenu';
import Logo from '../menu/Logo';
import User from '../menu/User';
import Axios from 'axios';


import userPerfil from '../../../assets/icons/UserPerfil.svg';
import qualificationIcon from '../../../assets/icons/qualificationW.svg';
import curriculumIcon from '../../../assets/icons/studentsMenu.svg';
import scheduleSubjectIcon from '../../../assets/icons/scheduleSubjectMenu.svg';
import monthlyPaymentsIcon from '../../../assets/icons/payMenu.svg';
import closeSession from '../../../assets/icons/closeSessionMenu.svg';
import notificationIcons from '../../../assets/icons/notificationStudent.svg';
import evaluationIcon from '../../../assets/icons/evaluation.svg';
import historyIcon from '../../../assets/icons/historyWhite.svg';
import cancelIcon from '../../../assets/icons/cancel.svg';



import Welcome from './wellcome/Wellcome';
import Qualifications from './qualifications/Qualifications';
import Curriculum from './curriculum/Curriculum';
import ScheduleSubject from './scheduleSubject/ScheduleSubject';
import PaymentHistory from './paymentHistory/PaymentHistory';
import perfil from '../../../assets/icons/perfilMenu.svg';
import Perfil from '../administrator/perfil/Perfil';
import Evaluation from './evaluation/evaluation';
import History from './history/history';

import modalStyles from '../Modal.style';
import ButtonSM from '../forms/ButtonSM';
import Table from '../table/Table';




const Student = () => {
    const classes = useStyles();

    const [selectedOption, setSelectedOption] = useState();
    const [openModalNotification, setOpenModalNotification] = useState(false);
    const [openModalListNotification, setOpenModalListNotification] = useState(false);
    const [data, setData] = useState([]);
    const [notification, setNotification] = useState({});

    const colums= ['N°','Fecha','Mensaje','Acción']

    const modalClasses = modalStyles();

    const loadData = () => {
        Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/notification`).then(response=>{
            setData(response.data);
        }).catch(error=>{
            console.log(error);
        }).catch(error=>{
            console.log(error);
        })
    }
    useEffect(loadData,[])


    const options = [
        {
            name: 'Perfil',
            image: perfil,
            path: 'perfil'
        },
        {
            name: 'Plan de Estudios',
            image: curriculumIcon,
            path: 'curriculum'
        },
        {
            name: 'Historial',
            image: historyIcon,
            path: 'history'
        },
        {
            name: 'Ver Notas',
            image: qualificationIcon,
            path: 'qualifications'
        },        
        {
            name: 'Programar Materia',
            image: scheduleSubjectIcon,
            path: 'scheduleSubject'
        },
        {
            name: 'Historial de pagos ',
            image: monthlyPaymentsIcon,
            path: 'paymentHistory'
        },
        {
            name:'Evaluacion docente',
            image: evaluationIcon,
            path: 'evaluation'
        }
    ];
    const options2 = [
        {
            name: 'Cerrar Sesión',
            image: closeSession,
            path: '/login'
        }
    ];

    const token = JSON.parse(localStorage.getItem('credentialSM'));

    const handleViewNotification = (id) => {
        const noti = data[id];
        setNotification(noti);
        setOpenModalNotification(true);
        setOpenModalListNotification(false);
    }

    if (openModalListNotification) {
        return (
            <div className={modalClasses.total}>
                <div className={modalClasses.under}></div>
                <div className={modalClasses.container}>
                    <div className={modalClasses.content}>
                        <p className={classes.titleNotification}>NOTIFICACIÓNES</p>
                        
                        <Table
                            columns={colums}
                            data={data.map((item, index) => [
                                index + 1,
                                item.dateNot.slice(0,10),
                                item.message.slice(0,20)+'....',
                                ' '
                            ])}
                            textLink={"Detalles"} 
                            columnAction={"Acción"} 
                            onClick={handleViewNotification}
                        />

                        <div className={classes.buttons}>
                            <ButtonSM icon={cancelIcon} text={"Cerrar"} className={classes.iconButton} className2={classes.buttonCancel} onClick={()=>{setOpenModalListNotification(false)}} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }else if (openModalNotification) {
        return (
            <div className={modalClasses.total}>
                <div className={modalClasses.under}></div>
                <div className={modalClasses.container}>
                    <div className={modalClasses.content}>
                        <p className={classes.titleNotification}>NOTIFICACIÓN</p>
                        <div className={classes.typeNotification}>
                            
                        </div>
                        <div className={classes.messageNotification}>
                            <label className={classes.labelType} htmlFor="message">Mensaje:</label>
                            <textarea className={classes.textAreaMessage} rows="7" cols="50" placeholder='Escribe aquí el mensaje'
                                id="message" name="message" defaultValue={`Fecha : ${notification.dateNot.slice(0,10)} \nMensaje: ${notification.message}`} 
                            ></textarea>
                        </div>
                        <div className={classes.buttons}>
                            <ButtonSM icon={cancelIcon} text={"Cerrar"} className={classes.iconButton} className2={classes.buttonCancel} onClick={()=>{setOpenModalNotification(false); setOpenModalListNotification(true)}} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }else{
        return (

            <div>
                <div className={classes.top}>
                    <img src={notificationIcons} alt="notifications" className={classes.notification} onClick={()=>{setOpenModalListNotification(true)}}/>
                    <Logo />
                    <User userPerfil={userPerfil} nameUser={token.fullName} rol={'Estudiante'} />
                </div>
                <div className={classes.second}>
                    <div className={classes.menu}>
                        <NavMenu options={options} selectedOption={selectedOption} setSelectedOption={setSelectedOption} className={classes.optionsTeachers} classNameIcon={classes.IconMenu} />
                        <hr className={classes.line} />
                        <NavMenu options={options2} selectedOption={selectedOption} setSelectedOption={setSelectedOption} className={classes.optionsTeachers} classNameIcon={classes.IconMenu} />
                    </div>
                    <div className={classes.content}>
                        <Routes>
                            <Route path='/' element={<Welcome />} />
                            <Route path='/perfil' element={<Perfil/>}/>
                            <Route path='/history' element={<History />} />
                            <Route path='/qualifications' element={<Qualifications />} />
                            <Route path='/curriculum' element={<Curriculum />} />
                            <Route path='/scheduleSubject' element={<ScheduleSubject />} />
                            <Route path='/paymentHistory' element={<PaymentHistory />} />
                            <Route path='/evaluation' element={<Evaluation/>} />
                        </Routes>

                    </div>
                </div>
            </div>

        );
    }

};
export default Student;