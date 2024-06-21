import Axios from "axios";
import useStyle from "./evaluation.style";
import studentStyle from "../Student.style";
import Table from "../../table/Table";
import { useEffect } from "react";
import { useState } from "react";
import scheduleIcon from "../../../../assets/icons/schedule.svg";
import modalStyles from "../../Modal.style";
import DynamicInputsDisabled from "../../forms/DynamicInputsDisabled";
import DynamicInputs from "../../forms/DynamicInputs";

import CredentialsDisabledUser from "../../forms/CredentialsDisabledUser";
import ButtonSM from "../../forms/ButtonSM";
import cancelIcon from "../../../../assets/icons/cancel.svg";
import editIconW from "../../../../assets/icons/editLight.svg";
import { enqueueSnackbar } from "notistack";




const Evaluation = () => {

  const token = JSON.parse(localStorage.getItem('credentialSM'));


  const modalClasses = modalStyles();
  const classes = useStyle();
  const studentClasses = studentStyle();

  const columns = ["N°", "Materia", "Gestion", "Horario", "Grupo", "Docente", "Acción"];
  const [data, setData] = useState([]);
  const [modalEvaluation, setModalEvaluation] = useState(false);
  const [nameEvaluation, setNameEvaluation] = useState('');
  const [idEvaluation, setIdEvaluation] = useState('');
  const [questionValues, setQuestionValues ] = useState({});


  const loadData = () => {
    Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/programming/evaluation/${token.idStudent}`).then(response=>{

      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const questions = [
    
    { label: "1. Dominio de los temas (1 - 10)", type: "number", id: "question1", min:1, max:10 },
    { label: "2. Calidad de enseñanza (1 - 10)", type: "number", id: "question2", min:1, max:10 },
    { label: "3. Apoyo en la materia (1 - 10)", type: "number", id: "question3", min:1, max:10 },
    { label: "4. Evaluación justa (1 - 10)", type: "number", id: "question4", min:1, max:10 },

  ];

  const handleClickEvaluation = (name, idSpecific) => {
    setNameEvaluation(name);
    setIdEvaluation(idSpecific)
    setModalEvaluation(true);
  }
  const handleSaveEvaluation = () => {
    const data = {
      q1:questionValues.question1,
      q2:questionValues.question2,
      q3:questionValues.question3,
      q4:questionValues.question4,
    }
    Axios.put(`${process.env.REACT_APP_SERVER_HOST}/api/enable/evaluation/${idEvaluation}`, data).then(response=>{
      enqueueSnackbar('Evaluado',{variant:'success'});
      loadData();
      setModalEvaluation(false);
    }).catch(error=>{
      enqueueSnackbar(error.response.data.message,{variant:'warning'});
    })
  }
  const handleChangeValues = (id, value) => {
    if(value === '' || (value>0 && value <11))
    setQuestionValues({...questionValues, [id]:value});
  }

  useEffect(loadData,[])

  if(modalEvaluation){
    return (
      <div className={modalClasses.total}>
        <div className={modalClasses.under}></div>
        <div className={modalClasses.container}>
          <div className={modalClasses.content}>
            <div className={classes.modalTop}>
              <p className={classes.titlemodalList}>
                {`Evaluacion: ${nameEvaluation}`}
              </p>
            </div>
            
            <p className={classes.subtitle}>
              Criterios de evaluacion
            </p>
            <div className={modalClasses.containerInputs}>

              <DynamicInputs
                fields={questions}
                className={modalClasses.inputs}
                onChange={handleChangeValues}
                values={questionValues}
              />
            </div>
            
            <div className={classes.modalBottom}>
              
              <div className={classes.container}>
                <div className={classes.buttonsModal}>
                  <div className={classes.buttonStudents}>
                    <ButtonSM
                      icon={editIconW}
                      text="Evaluar"
                      className={modalClasses.icons}
                      onClick={handleSaveEvaluation}
                    />
                  </div>
                  <div className={classes.buttonStudents}>
                    <ButtonSM
                      icon={cancelIcon}
                      text="Cancelar"
                      className={modalClasses.icons}
                      onClick={()=>{setModalEvaluation(false)}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className={studentClasses.content}>
          <div className={classes.title}>
            <p className={studentClasses.text}>EVALUACION DOCENTE</p>
            <hr className={studentClasses.lineTitle} />
          </div>
          <div>
            <p className={classes.subtitle}>
              
              Materias pendientes de evaluacion
            </p>
            <div className={classes.tableSchedule}>
              <Table
                icon2={scheduleIcon}
                columns={columns}
                data={data.map((item ,index)=>[
                    index + 1,
                    item.subject,
                    item.month,
                    item.schedule,
                    item.groupe,
                    item.fullName,
                    item.idProgramming])}
                columnAction={"Accin"}
                columnIcon={"Acción"}
                textLink={"Programar"}
                onDelete={handleClickEvaluation}
                start={5}
                end={6}
              />
            </div>
          </div>
        </div>
    )
  }
};

export default Evaluation;
