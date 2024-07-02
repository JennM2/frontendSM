import { useEffect, useState } from "react";
import Axios from "axios";

import { useRef } from "react";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import "jspdf-autotable";
import useStyles from "./ActiveSubjects.style";
import subjectsStyles from "../Teachers.style";
import modalStyles from "../../Modal.style";
import TableEdit from "../../table/TableEdit";
import Table from "../../table/Table";
import Button from "../../forms/ButtonSM";
import logo from "../../../../assets/images/logoSMpdf.png";
import poppins from "../../../../assets/fonts/Poppins-Regular.ttf";
import list from "../../../../assets/icons/generatelist.svg";
import qualification from "../../../../assets/icons/qualification.svg";
import updateIcon from "../../../../assets/icons/editLight.svg";
import upload from "../../../../assets/icons/top.svg";
import report from "../../../../assets/icons/reports.svg";
import save from "../../../../assets/icons/save.svg";
import cancel from "../../../../assets/icons/cancel.svg";
import reportList from '../../../../assets/icons/reports.svg';

import { enqueueSnackbar } from "notistack";

const ActiveSubjects = () => {

  const token = JSON.parse(localStorage.getItem('credentialSM'));

  const classes = useStyles();
  const subjectsClasses = subjectsStyles();
  const modalClasses = modalStyles();

  const columns = ["N°", "Code", "Materia","Gestion", "Carrera", "Año", "Acción"];
  const columnStudentList = ['N°', 'Matrícula', 'Nombre Completo'];

  const [data, setData] = useState([]);
  const [dataStudents, setDataStudents] = useState([]);
  const [dataListStudents, setDataListStudents] = useState([]);
  const [subject, setSubject] = useState("");
  const [openModalStudentList, setOpenModalStudentList] = useState(false);



  const loadData = () => {
    Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/enable/teacher?teacherId=${token.idTeacher}`).then(response => {
      setData(response.data);
    }).catch (error=> {
      console.error("Error al obtener los datos:", error);
    })
  }

  const loadDataStudents = async(id) => {
    const response = await Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/programming/allStudents/${id}`);
    return response.data
  } 
        

  useEffect(loadData, [token.idTeacher]);

  const [openModalQualifications, setOpenModalQualifications] = useState(false);

  const columnsQualifiedStudent = [
    "N°",
    "Estudiante",
    "P1",
    "P2",
    "P3",
    "Prom. P.",
    "Practicas",
    "Ex. Final",
    "Final"
  ];

  const [editMode, setEditMode] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleOpenModalQualifications = async (rowID) => {
    const response = await loadDataStudents(data[rowID].idEnable);
    if(response.length){
      setDataStudents(response);
      setOpenModalQualifications(!openModalQualifications);
      setSubject({idEnable: data[rowID].idEnable, subject: data[rowID].subject})
    }else{
      enqueueSnackbar('No existen alumnos programados', {variant:'warning'});
    }
  };

  const tableRef = useRef(null); //referenciar  la tabla de estudiantes para generar las listas
  const tableQualificationRef = useRef(null);
  const currentDate = new Date();
  const formattedDate = format(currentDate, "MMMM dd, yyyy", { locale: es });

  const handleGenerateList = (rowId) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.addFont(poppins, "Poppins", "normal");
    doc.setFont("Poppins");
    doc.addImage(logo, "SVG", 10, 9, 20, 20);
    doc.setFontSize(10);
    doc.setTextColor(39, 103, 158);
    doc.text("Instituto Técnico", 33, 18);
    doc.setFontSize(14);
    doc.text("SAN MARTIN", 33, 23);
    doc.setFontSize(10);
    doc.text("Fecha", 180, 20);
    doc.text(formattedDate, 166, 25);
    doc.setFontSize(20);
    doc.setTextColor(17, 45, 94);
    doc.setFont("Helvetica");
    doc.text("Lista de estudiantes", 78, 45);

    if (tableRef.current) {
      doc.autoTable({
        html: tableRef.current,
        startY: 60,
        theme: "plain",
        headStyles: {
          textColor: [39, 103, 158],
          fontSize: 12,
        },
        styles: {
          fontSize: 10,
          cellPadding: 2,
          rowHeight: 10,
          textColor: [126, 138, 149],
          valign: "middle",
          vjustificate: "center",
        },
        columnStyles: { 0: { fontStyle: "bold" } },
        didDrawPage: function () {
          doc.setLineWidth(0.5);
          doc.setDrawColor(39, 103, 158);
          const startY = 70;
          const endY = 70;
          const tableWidth = doc.internal.pageSize.width - 25;
          doc.line(12, startY, tableWidth, endY);
        },
      });
    }

    doc.save("reporte.pdf");
  };

  const handleGenerateReportQualification = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.addFont(poppins, "Poppins", "normal");
    doc.setFont("Poppins");
    doc.addImage(logo, "SVG", 10, 9, 20, 20);
    doc.setFontSize(10);
    doc.setTextColor(39, 103, 158);
    doc.text("Instituto Técnico", 33, 18);
    doc.setFontSize(14);
    doc.text("SAN MARTIN", 33, 23);
    doc.setFontSize(10);
    doc.text("Fecha", 180, 20);
    doc.text(formattedDate, 166, 25);
    doc.setFontSize(20);
    doc.setTextColor(17, 45, 94);
    doc.setFont("Helvetica");
    doc.text("Calificaciones", 78, 45);

    if (tableQualificationRef.current) {
      doc.autoTable({
        html: tableQualificationRef.current,
        startY: 60,
        theme: "plain",
        headStyles: {
          textColor: [39, 103, 158],
          fontSize: 12,
        },
        styles: {
          fontSize: 10,
          cellPadding: 2,
          rowHeight: 10,
          textColor: [126, 138, 149],
          valign: "middle",
          vjustificate: "center",
        },
        columnStyles: { 0: { fontStyle: "bold" } },
        didDrawPage: function () {
          doc.setLineWidth(0.5);
          doc.setDrawColor(39, 103, 158);
          const startY = 70;
          const endY = 70;
          const tableWidth = doc.internal.pageSize.width - 15;
          doc.line(12, startY, tableWidth, endY);
        },
      });
    }

    doc.save("reporte.pdf");
  };

  useEffect(()=>{
    console.log(dataStudents);
  },[dataStudents])

  const handleEdit = (e, row, cell) => {
    const indexNames = {
      2:'parcialOne',
      3:'parcialTwo',
      4:'parcialThree',
      5:'avgParcial',
      6:'practices',
      7:'exam',
      8:'final'
    }
    let copyArray = [...dataStudents];
    let copyObject = {...copyArray[row]};
    copyObject[indexNames[cell]] = Number(e.target.value);

    copyArray[row] = updateFinal(copyObject);


    setDataStudents(copyArray);
  };

  const updateFinal = (notes) => {

    const parcials = [Number(notes.parcialOne), Number(notes.parcialTwo), Number(notes.parcialThree)].sort((a, b)=>{
      return a - b
    });

    notes.avgParcial = (((parcials[2] + parcials[1]) /2 ) * 0.4).toFixed(2);

    notes.final = (Number(notes.avgParcial) + Number(notes.practices * 0.2) + Number(notes.exam * 0.4)).toFixed(0);
    return notes;
  }


  const toggleEditMode = () => {
    setIsChecked(!isChecked);
    setEditMode((prevMode) => !prevMode);
  };

  const handleSave = () => {
    setEditableCell(null);
    const editData = dataStudents.map(item => {return {
      idProgramming: item.idProgramming,
      parcialOne: item.parcialOne,
      parcialTwo: item.parcialTwo,
      parcialThree: item.parcialThree,
      avgParcial:item.avgParcial,
      practices: item.practices,
      exam: item.exam,
      final: item.final
    }})
    Axios.put(`${process.env.REACT_APP_SERVER_HOST}/api/programming/updateNotes`, editData).then(()=>{
      enqueueSnackbar('Actualizado',{variant:'success'})
    }).catch(error=>{
      enqueueSnackbar(error.response.data.message,{variant:'warning'})
    })
  }

  const handleFinishEnable = async () => {

    handleSave();
    
    Axios.put(`${process.env.REACT_APP_SERVER_HOST}/api/enable/finish/${subject.idEnable}`).then(()=>{
      enqueueSnackbar('Materia cerrada',{variant:'success'});
      setOpenModalQualifications(false);
      loadData();
    }).catch(error=>{
      enqueueSnackbar(error.response.data.message,{variant:'warning'});
    })

  }

  const loadDataListStudents = async(idEnable) => {
    Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/programming/allStudents/${idEnable}`).then(response=>{
        const data = response.data.map((item, index) => [
            index + 1,
            item.idStudent,
            item.fullName
        ])
        setDataListStudents(data);
    })
}

  const handleOpenStudentList = async(rowId) => {
    const idEnable = data[rowId].idEnable;
    loadDataListStudents(idEnable);
    setOpenModalStudentList(!openModalStudentList);
};

const [editableCell, setEditableCell] = useState(null);

  if (openModalQualifications) {
    return (
      <div className={modalClasses.total}>
        <div className={modalClasses.under}></div>        <div className={modalClasses.container}>
          <div className={modalClasses.content}>
            <div className={classes.subjectName}>
              <p className={classes.subjectName}> {subject.subject}</p>
            </div>
            <hr className={classes.lineQualification} />
            <div className={classes.contentTop}>
              <div className={classes.timeLimit}>
                <p>
                  {dataStudents[0]?.month}
                </p>
              </div>
              <div className={classes.buttonTop}>
                <Button
                  icon={upload}
                  text={"Finalizar"}
                  className={modalClasses.icons}
                  className2={`${classes.buttonDisable} ${
                    isChecked && classes.button
                  }`}
                  onClick={()=>{handleFinishEnable()}}
                />
              </div>
              <div
                className={classes.editTableContainer}
                onClick={toggleEditMode}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  className={classes.inputEditTable}
                />

                <div
                  className={`${classes.checkOff} ${
                    isChecked && classes.checkOn
                  }`}
                >
                  <div
                    className={`${classes.circleOff} ${
                      isChecked && classes.circle
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            <TableEdit
              editableCell={editableCell}
              setEditableCell={setEditableCell}
              columns={columnsQualifiedStudent}
              data={dataStudents.map((item, index)=>[
                index + 1,
                item.fullName,
                item.parcialOne,
                item.parcialTwo,
                item.parcialThree,
                item.avgParcial,
                item.practices,
                item.exam,
                item.final
              ])}
              className2={classes.bodyQualification}
              onEdit={handleEdit}
              editMode={editMode}
              tableRef={tableQualificationRef}
            />
            <div className={classes.buttons}>
              <div className={classes.buttonBottom}>
                <Button
                  icon={report}
                  text={"Generar Reporte"}
                  className={modalClasses.icons}
                  onClick={handleGenerateReportQualification}
                  className2={`${classes.buttonDisable} ${
                    isChecked && classes.button
                  }`}
                />
              </div>
              <div className={classes.buttonsRight}>
                <div className={classes.bottomRight}>
                  <Button
                    icon={save}
                    text={"Guardar"}
                    className={modalClasses.icons}
                    className2={`${classes.buttonDisable} ${
                      isChecked && classes.button
                    }`}
                    onClick={()=>{handleSave()}}
                  />
                </div>
                <div className={classes.bottomRight}>
                  <Button
                    icon={cancel}
                    text={"Cancelar"}
                    className={modalClasses.icons}
                    className2={`${classes.buttonDisable} ${
                      isChecked && classes.button
                    }`}
                    onClick={()=>{setOpenModalQualifications(false)}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (openModalStudentList) {
    return (
        <div className={modalClasses.total}>
            <div className={modalClasses.under}></div>
            <div className={modalClasses.container}>
                <div className={modalClasses.content}>
                    <p className={classes.titleEnable}>Lista de estudiantes</p>
                    <div className={classes.tableStudents}>
                        <Table columns={columnStudentList} data={dataListStudents} className2={classes.bodyTable} tableRef={tableRef} />
                    </div>
                    <div className={classes.buttonListStudent}>
                        <Button icon={reportList} text={"Generar lista "} onClick={handleGenerateList} />
                        <Button icon={cancel} text={"Cancelar "} onClick={()=>{setOpenModalStudentList(false)}} />
                    </div>
                    
                </div>
            </div>
        </div>

    );
  } else {
    return (
      <div>
        <div className={subjectsClasses.content}>
          <div className={classes.title}>
            <p className={subjectsClasses.text}>MATERIAS ACTIVAS</p>
            <hr className={subjectsClasses.lineTitle} />
          </div>
          <div className={classes.buttonSubjects}>
            
          </div>
          <div className={classes.subjectsTable}>
            <Table
              columns={columns}
              data={data.map((item, index)=>[
                index + 1,
                item.code,
                item.subject,
                item.month,
                item.career,
                item.year,
                item.idEnable,
              ])}
              columnIcon={"Acción"}
              icon3={list}
              icon={qualification}
              onEdit={handleOpenModalQualifications}
              onAdd={handleOpenStudentList}
            />
          </div>
        </div>
      </div>
    );
  }
};
export default ActiveSubjects;
