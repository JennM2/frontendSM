import { useState, useEffect } from 'react';
import Axios from 'axios';

import Table from '../../table/Table';
import useStyles from './AssignedSubjects.style';
import teacherStyles from '../Teachers.style';


const AssignedSubjects = () => {

    const token = JSON.parse(localStorage.getItem('credentialSM'));

    const classes = useStyles();
    const teacherClasses = teacherStyles();

    const columns = ['N°', 'Codigo', 'Materia', 'Carrera', 'Año' ,  'Pre-Requisito'];
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try { 
            const response = await Axios.get(
              `${process.env.REACT_APP_SERVER_HOST}/api/subjectTeacher/subjects?idTeacher=${token.idTeacher}`
            );
            const transformedData = response.data.map((subject,index) => [
              index + 1,
              subject.code,
              subject.subject,               // Suponiendo que 'id' es el número
              subject.career,
              subject.year,
              subject.preSubject,
            ]);
            setData(transformedData);
          } catch (error) {
            console.error("Error al obtener los datos:", error);
          }
        };
        fetchData();
      }, []);


    return (
        <div className={teacherClasses.content} >
            <div className={classes.title}>
                <p className={teacherClasses.text}>MATERIAS ASIGNADAS</p>
                <hr className={teacherClasses.lineTitle} />
            </div>
            <div className={classes.tableTeacher}>
                <Table columns={columns} data={data} />
            </div>
        </div>
    );
};

export default AssignedSubjects;