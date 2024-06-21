import Axios from "axios";
import useStyle from "./ScheduleSubject.style";
import studentStyle from "../Student.style";
import Table from "../../table/Table";
import { useEffect } from "react";
import { useState } from "react";
import scheduleIcon from "../../../../assets/icons/schedule.svg";
import modalStyles from "../../Modal.style";
import DynamicInputsDisabled from "../../forms/DynamicInputsDisabled";
import DynamicInputs from "../../forms/DynamicInputs";

import ButtonSM from "../../forms/ButtonSM";
import cancelIcon from "../../../../assets/icons/cancel.svg";
import editIconW from "../../../../assets/icons/editLight.svg";
import { enqueueSnackbar } from "notistack";




const ScheduleSubject = () => {

  const token = JSON.parse(localStorage.getItem('credentialSM'));


  const modalClasses = modalStyles();
  const classes = useStyle();
  const studentClasses = studentStyle();

  const columns = ["N°", "Materia", "Horario", "Grupo", "Docente", "Desde", "Hasta", "Acción"];
  const [data, setData] = useState([]);
  const [dataPayment, setDataPayment] = useState([]);
  const [dataCard, setDataCard] = useState({
    amount:250
  });
  
  const [modalSchedule, setModalSchedule] = useState(false);
  const [idSchedule, setIdSchedule] = useState(0);
  const [payProcess, setPayProcess] = useState(false);
  const [evaluationPending, setEvaluationPending] = useState(false);

  const loadData = () => {
    Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/enable/toProgram/${token.idStudent}`).then(response=>{
      setData(response.data.data);

      if(response.data.results.length > 0){
        setEvaluationPending(true);
        enqueueSnackbar('Debe finalizar sus evaluaciones docente antes de programar',{variant:'warning'});
      }else{
        setEvaluationPending(false);
      }
    }).catch(error=>{
      console.log(error);
    })
  }

  const handleClickSchedule = (id,idSpecific) => {
    if(evaluationPending){
      enqueueSnackbar('Debe finalizar sus evaluaciones docente antes de programar',{variant:'warning'});
    }else{
    setModalSchedule(prev => !prev);
    setIdSchedule(idSpecific);
    setDataPayment(data.find(item=>item.idEnable===idSpecific));
    }
  }

  const handleInputCardChange = (id, value) => {
    if(id!=='amount')
    setDataCard({...dataCard, [id]:value})
  }

  const handlePayment = () => {
    const dataPayProgramming = {
      idStudent: token.idStudent,
      idEnable : idSchedule,
      payment : {
        amount: 250,
        card: dataCard
      }
    }
    setPayProcess(true);
    Axios.post(`${process.env.REACT_APP_SERVER_HOST}/api/programming`,dataPayProgramming).then(()=>{
      setPayProcess(false);
      enqueueSnackbar('Programacion realizada',{variant:'success'});
      setModalSchedule(false);
      loadData();
    }).catch((error)=>{
      setPayProcess(false);
      enqueueSnackbar(error.response.data.message,{variant:'warning'});
    })
  }

  const fieldsC1 = [
    {
      label: "Estudiante",
      type: "text",
      id: "fullName",
    },
    { label: "Horario", type: "text", id: "schedule" },
    { label: "Docente", type: "text", id: "nameTeacher" },
  ];
  const fieldsC2 = [
    {
      label: "Materia",
      type: "text",
      id: "subject",
    },
    { label: "Grupo", type: "text", id: "group" },
    
  ];
  const fieldsC11 = [
    { label: "Monto por cancelar", type: "text", id: "amount", value:'200' },
    {label: "Numero de tarjeta", type: "text", id: "numberCard"},
    { label: "Fecha de vencimiento", type: "month", id: "dateCard" },
    { label: "Codigo CVC", type: "text", id: "cvcCard" },
  ];


  useEffect(loadData,[token.idStudent])

  if(modalSchedule){
    return (
      <div className={modalClasses.total}>
        <div className={modalClasses.under}></div>        <div className={modalClasses.container}>
          <div className={modalClasses.content}>
            <div className={classes.modalTop}>
              <p className={classes.titlemodalList}>
                PAGO POR PROGRAMACION
              </p>
            </div>
            <div className={classes.inputsModal}>
              <DynamicInputsDisabled
                fieldsf={fieldsC1}
                className={modalClasses.inputs}
                onChange={()=>{}}
                values={{...dataPayment, fullName:token.fullName}}
              />
              <DynamicInputsDisabled
                fieldsf={fieldsC2}
                className={modalClasses.inputs}
                onChange={()=>{}}
                values={dataPayment}
              />
            </div>
            <p className={classes.subtitle}>
              DATOS DE PAGO
              <br/>
              <i>El monto total por materia tiene un costo de 250 Bs.</i>
            </p>
            <div className={modalClasses.containerInputs}>

              <DynamicInputs
                enable={payProcess}
                fields={fieldsC11}
                className={modalClasses.inputs}
                onChange={handleInputCardChange}
                values={dataCard}
              />
            </div>
            {
            payProcess&&
              <p className={classes.subtitle}>
                .......Procesando Pago.......
              </p>
            }
            <div className={classes.modalBottom}>
              <div className={classes.container}>
                <div className={classes.buttonsModal}>
                  <div className={classes.buttonStudents}>
                    <ButtonSM
                      enable={payProcess}
                      icon={editIconW}
                      text="Pagar"
                      className={modalClasses.icons}
                      onClick={handlePayment}
                    />
                  </div>
                  <div className={classes.buttonStudents}>
                    <ButtonSM
                      enable={payProcess}
                      icon={cancelIcon}
                      text="Cancelar"
                      className={modalClasses.icons}
                      onClick={()=>{setModalSchedule(false);}}
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
            <p className={studentClasses.text}>PROGRAMAR MATERIAS</p>
            <hr className={studentClasses.lineTitle} />
          </div>
          <div>
            <p className={classes.subtitle}>
              Fecha de programación hasta el 19 de marzo
            </p>
            <div className={classes.tableSchedule}>
              <Table
                icon2={scheduleIcon}
                columns={columns}
                data={data.map((item ,index)=>[
                  index + 1,
                  item.subject,
                  item.schedule,
                  item.group,
                  item.nameTeacher,
                  item.dateStart,
                  item.dateEnd,
                  item.idEnable])}
                columnAction={"Accin"}
                columnIcon={"Acción"}
                textLink={"Programar"}
                onDelete={handleClickSchedule}
                start={1}
                end={5}
              />
            </div>
          </div>
        </div>
    )
  }
};

export default ScheduleSubject;
