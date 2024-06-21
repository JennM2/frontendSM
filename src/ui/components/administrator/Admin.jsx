import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';

import useStyles from './Admin.style';
import NavMenu from '../menu/NavMenu';
import Logo from '../menu/Logo';
import User from '../menu/User';
import Perfil from './perfil/Perfil';
import Users from './users/Users';
import Backups from './backups/Backups';
import Secretaries from './secretaries/Secretaries';
import TeachersList from './teacher/TeacherList'
import TeacherEvaluation from './teacher/TeacherEvaluation';
import Students from './students/Students';
import Wellcome from './wellcome/Wellcome';
import perfil from '../../../assets/icons/perfilMenu.svg';
import users from '../../../assets/icons/usersMenu.svg';
import secretaries from '../../../assets/icons/secretaryMenu.svg';
import teachers from '../../../assets/icons/teacherMenu.svg';
import list from '../../../assets/icons/listSubMenu.svg';
import evaluation from '../../../assets/icons/evaluationMenu.svg';
import students from '../../../assets/icons/studentsMenu.svg';
import backups from '../../../assets/icons/backupMenu.svg';
import closeSession from '../../../assets/icons/closeSessionMenu.svg';
import user from '../../../assets/icons/userLog.svg';
import Careers from './careers/Careers';
import SubjectsCareers from './subjects/SubjectsCareers'
import addSubject from '../../../assets/icons/subjectsMenu.svg'
import reports from '../../../assets/icons/reports.svg'

const Admin = () => {
    const classes = useStyles();

    const [selectedOption, setSelectedOption] = useState();

    const [selectedImage, setSelectedImage] = useState(user);
    const [nameUser] = useState("Administrador");


    const options = [
        {
            name: 'Perfil',
            image: perfil,
            path: 'perfil'
        },
        {
            name: 'Usuarios',
            image: users,
            path: 'users'
        },
        {
            name: 'Carreras',
            image: list,
            path: 'careers',
            suboptions: [
                {
                    name: 'Carreras',
                    nameLabel: 'Carreras',
                    image: reports,
                    path: 'careers'
                },
                {
                    name: 'Materias',
                    nameLabel: 'Materias',
                    image: addSubject,
                    path: 'subjectsCareers'
                },
            ]
        },
        {
            name: 'Secretarios',
            image: secretaries,
            path: 'secretaries'
        },
        {
            name: 'Docentes',
            image: teachers,
            path: 'list',
            suboptions: [
                {
                    name: 'Lista',
                    nameLabel: 'Docentes',
                    image: list,
                    path: 'list'
                },
                {
                    name: 'Evaluación',
                    nameLabel: 'Evaluación',
                    image: evaluation,
                    path: 'evaluation'
                },
            ]
        },
    ];

    const token = JSON.parse(localStorage.getItem('credentialSM'));


    const options2 = [
        {
            name: 'Estudiantes',
            image: students,
            path: 'students'
        }
    ];

    const options3 = [
        {
            name: 'Backups',
            image: backups,
            path: 'backups'
        },
        {
            name: 'Cerrar Sesión',
            image: closeSession,
            path: '/login'
        }
    ];



    return (

        <div>
            <div className={classes.top}>
                <Logo />
                <User userPerfil={selectedImage} nameUser={token.fullName} rol={'Administrador'}/>
            </div>
            <div className={classes.second}>
                <div className={classes.menu}>
                    <NavMenu options={options} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
                    <hr className={classes.line} />
                    <NavMenu options={options2} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
                    <hr className={classes.line} />
                    <NavMenu options={options3} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
                </div>
                <div className={classes.content}>
                    <Routes>
                        <Route path='/' element={<Wellcome />} />
                        <Route path='/perfil' element={<Perfil nameUser={nameUser} />} />
                        <Route path='/users' element={<Users />} />
                        <Route path='/secretaries' element={<Secretaries />} />
                        <Route path='/careers' element={<Careers />} />
                        <Route path='/subjectsCareers' element={<SubjectsCareers />} />
                        <Route path='/list' element={<TeachersList />} />
                        <Route path='/evaluation' element={<TeacherEvaluation />} />
                        <Route path='/students' element={<Students />} />
                        <Route path='/backups' element={<Backups />} />
                    </Routes>
                </div>
            </div>
            
        </div>

    );

};
export default Admin;