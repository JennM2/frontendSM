import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import useStyles from './Teachers.style';
import NavMenu from '../menu/NavMenu';
import Logo from '../menu/Logo';
import User from '../menu/User';
import Wellcome from'./wellcome/Wellcome';
import ActiveSubjects from './activeSubjects/ActiveSubjects';
import AssignedSubjects from './assignedSubjects/AssignedSubjects';

import userPerfil from '../../../assets/icons/UserPerfil.svg';
import activeSubjects from '../../../assets/icons/subjects.svg';
import closeSession from '../../../assets/icons/closeSessionMenu.svg';
import assignedSubjects from '../../../assets/icons/subjectsMenu.svg';
import perfil from '../../../assets/icons/perfilMenu.svg';
import Perfil from '../administrator/perfil/Perfil';
import Document from '../../../assets/icons/description.svg';
import Report from './report/report';



const Teachers = () => {
    const classes = useStyles();
 
    const [selectedOption, setSelectedOption] = useState();
    
     const options = [
        {
            name: 'Perfil',
            image: perfil,
            path: 'perfil'
        },
        {
            name: 'Materias Asignadas',
            image: assignedSubjects,
            path: 'assignedSubjects'
          },
         {
           name: 'Materias Activas',
           image: activeSubjects,
           path: 'activeSubjects'
         },
         {
            name: 'Reporte Materias',
            image: Document,
            path: 'report'
          },
     ];
     const options2 =[
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
                <Logo/>
                <User userPerfil = {userPerfil} nameUser={token.fullName} rol={'Docente'}/>
            </div>
            <div className={classes.second}>
                <div className={classes.menu}>
                    <NavMenu  options={options} selectedOption={selectedOption} setSelectedOption={setSelectedOption} className={classes.optionsTeachers} classNameIcon={classes.IconMenu} />
                    <hr className={classes.line}/>
                    <NavMenu  options={options2} selectedOption={selectedOption} setSelectedOption={setSelectedOption} className={classes.optionsTeachers} classNameIcon={classes.IconMenu} />
                </div>
                <div className={classes.content}>
                    <Routes>
                        <Route path='/' element={<Wellcome />}/>
                        <Route path='/perfil' element={<Perfil/>}/>
                        <Route path='/assignedSubjects' element={<AssignedSubjects />}/>
                        <Route path='/activeSubjects' element={<ActiveSubjects />}/>
                        <Route path='/report' element={<Report />}/>
                    </Routes>
                    
                </div>
            </div>
        </div>
        
      );

};
export default Teachers;