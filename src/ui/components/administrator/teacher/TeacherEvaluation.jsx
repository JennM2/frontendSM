import { useEffect, useState } from 'react';
import adminStyles from '../Admin.style';
import useStyles from './Teachers.style';
import modalStyles from '../../Modal.style';
import Table from '../../table/Table';
import ButtonSM from '../../forms/ButtonSM';
import closeIcon from '../../../../assets/icons/cancel.svg';
import Axios from "axios";



const TeacherEvaluation = () => {
    const classes = useStyles();
    const adminClasses = adminStyles();
    const modalClasses = modalStyles();
    const [isOpenDetail, setIsOpenDetail] = useState();
    const columns = ['N°', 'Paterno', 'Materno', 'Nombre', 'Correo', 'Teléfono', 'Acción'];
    const [data,setData] = useState([]);
    const [fullName, setFullName] = useState('');
    const [dataEvaluation,setDataEvaluation] = useState([]);


    const handleModalDetails = (rowIndex) => {
        setIsOpenDetail(true);
        const idTeacher = data[rowIndex].idTeacher;
        setFullName(`${data[rowIndex].paterno} ${data[rowIndex].materno} ${data[rowIndex].names}`);
        loadDataEvaluation(idTeacher);
    };

    const loadDataEvaluation = (idTeacher) => {
        Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/teachers/evaluation/${idTeacher}`).then(response=>{
            console.log(response);
            const dataReady = response.data.map((item, index)=>{
                const q1 = item.numEvaluations && (item.scoreQ1 / item.numEvaluations);
                const q2 = item.numEvaluations && (item.scoreQ2 / item.numEvaluations);
                const q3 = item.numEvaluations && (item.scoreQ3 / item.numEvaluations);
                const q4 = item.numEvaluations && (item.scoreQ4 / item.numEvaluations);

                return [
                index + 1,
                item.subject,
                item.month,
                q1,
                q2,
                q3,
                q4,
                item.numEvaluations,
                (q1 + q2 + q3 + q4) / 4
                ]
            })
            setDataEvaluation(dataReady);
        })
    }

    const loadData = () => {
        Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/teachers`).then(response=>{
            console.log(response);

            setData(response.data);
        })
    }

    useEffect(loadData,[]);

    const columnsModal = ['N°','Materia','Gestion', 'Aspecto 1', 'Aspecto 2', 'Aspecto 3', 'Aspecto 4', 'Num.Evaluaciones', 'Puntaje'];

    if (isOpenDetail) {
        return (
            <div className={modalClasses.total}>

                <div className={modalClasses.under}></div>
                <div className={modalClasses.container}>
                    <div className={modalClasses.content}>
                        <p className={classes.titleEnable}>EVALUACIONES</p>
                        <div className={classes.containerName}>
                            <div className={classes.nameteacher}>
                                <p>{fullName}</p>
                            </div>
                        </div>
                        <hr className={classes.lineDetail} />
                        <div className={classes.aspects}>
                            <p  >
                                {'1: Dominio de los temas (1 - 10)'}
                                <br/>
                                
                                {'2: Calidad de enseñanza (1 - 10)'}
                                <br/>
                                {'3: Apoyo en la materia (1 - 10)'}
                                <br/>
                                {'4: Evaluación justa (1 - 10)'}
                                
                            </p>
                        </div>
                        <div className={classes.containerTableDetail}>
                            <Table 
                                columns={columnsModal} 
                                data={dataEvaluation} 
                                className={classes.tableDetail} 
                                className2={classes.bodyTableDetail}
                            />
                        </div>
                        <div className={classes.buttonClose}>
                            <ButtonSM icon={closeIcon} text="Cerrar" className={classes.iconTeacher} onClick={()=>{setIsOpenDetail(false)}} />
                        </div>


                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={adminClasses.content} >
                <div className={classes.tittleTeacher}>
                    <p className={adminClasses.text}>EVALUACIÓN DE DOCENTES</p>
                    <hr className={adminClasses.lineTitle} />
                </div>
                <div className={classes.subtitle}>
                    <p>Materias programadas - Julio</p>
                </div>
                <div className={classes.tableEvaluation}>

                    <Table 
                        columns={columns} 
                        data={data.map((item,index)=>[
                            item.idTeacher,
                            item.paterno,
                            item.materno,
                            item.names,
                            item.email,
                            item.phone,
                            ''
                        ])} 
                        textLink={"Detalles"} 
                        columnAction={"Acción"} 
                        onClick={handleModalDetails}
                     />
                </div>
            </div>
        );
    };
};

export default TeacherEvaluation;