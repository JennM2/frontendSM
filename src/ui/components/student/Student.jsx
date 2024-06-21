import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import useStyles from './Student.style';
import NavMenu from '../menu/NavMenu';
import Logo from '../menu/Logo';
import User from '../menu/User';


import userPerfil from '../../../assets/icons/UserPerfil.svg';
import qualificationIcon from '../../../assets/icons/qualificationW.svg';
import curriculumIcon from '../../../assets/icons/studentsMenu.svg';
import scheduleSubjectIcon from '../../../assets/icons/scheduleSubjectMenu.svg';
import monthlyPaymentsIcon from '../../../assets/icons/payMenu.svg';
import closeSession from '../../../assets/icons/closeSessionMenu.svg';
import notificationIcons from '../../../assets/icons/notificationStudent.svg';
import evaluationIcon from '../../../assets/icons/evaluation.svg';


import Welcome from './wellcome/Wellcome';
import Qualifications from './qualifications/Qualifications';
import Curriculum from './curriculum/Curriculum';
import ScheduleSubject from './scheduleSubject/ScheduleSubject';
import PaymentHistory from './paymentHistory/PaymentHistory';
import perfil from '../../../assets/icons/perfilMenu.svg';
import Perfil from '../administrator/perfil/Perfil';
import Evaluation from './evaluation/evaluation';



const Student = () => {
    const classes = useStyles();

    const [selectedOption, setSelectedOption] = useState();

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
        },{
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

    return (

        <div>
            <div className={classes.top}>
                <img src={notificationIcons} alt="notifications" className={classes.notification} />
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

};
export default Student;