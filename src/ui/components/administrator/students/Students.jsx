import { useState, useEffect, useRef } from "react";
import Axios from "axios";

import adminStyles from "../Admin.style";
import useStyles from "./Students.style";
import modalStyles from "../../Modal.style";
import Search from "../../forms/Search";
import ButtonSM from "../../forms/ButtonSM";
import Table from "../../table/Table";
import DynamicInputs from "../../forms/DynamicInputs";
import Credentials from "../../forms/Credentials";
import newStudent from "../../../../assets/icons/newUser.svg";
import editStudent from "../../../../assets/icons/edit.svg";
import qualification from "../../../../assets/icons/qualification.svg";
import history from "../../../../assets/icons/history.svg";
import saveIcon from "../../../../assets/icons/save.svg";
import cancelIcon from "../../../../assets/icons/cancel.svg";
import deletIconW from "../../../../assets/icons/deleteW.svg";
import alertIcon from "../../../../assets/images/alert.svg";
import editIconW from "../../../../assets/icons/editLight.svg";
import closeArrow from "../../../../assets/icons/arrow.svg";
import openArrow from "../../../../assets/icons/arrow2.svg";
import { enqueueSnackbar } from "notistack";
import reportIcon from '../../../../assets/icons/reports.svg';
import logo from '../../../../assets/images/logoSMpdf.png';
import poppins from '../../../../assets/fonts/Poppins-Regular.ttf';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { jsPDF } from 'jspdf';


const Students = () => {
  const adminClasses = adminStyles();
  const classes = useStyles();
  const modalClasses = modalStyles();

  const toogleTable = (index, value) => {
    let copy = [...toogles];
    copy[index] = !value;
    setToogles([...copy]);
  }

  const [dataQualified, setDataQualified] = useState([]);
  const [dataHistory, setDataHistory] = useState([]);
  const [years, setYears] = useState([]);
  const [toogles, setToogles] = useState([]);

  const columnsQualified = ['N°', 'Materia', 'Gestion', 'P1', 'P2', 'P3', 'Prom. Parcial', 'Practicas', 'Examen Final', 'Nota Final'];
  const columnsHistory = ['N°', 'Materia', 'Gestion', 'Nota Final'];

  const newStudentObject = {
    matricula:"",
    paterno:"",
    materno:"",
    name:"",
    ci:"",
    email:"",
    phone:"",
    user:"",
    password:"",
    career:""
  };

  const [isOpenNew, setIsOpenNew] = useState(false);
  const [isOpenQualification, setIsOpenQualification] = useState(false);
  const [isOpenHistory, setIsOpenHistory] = useState(false);
  const [isDeleteDialog, setIsDeleteDilog] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [, setEditedId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  
  const [nameStudent, setNameStudent] = useState({});
  const [nameSubect, setNameSubject] = useState("");
  const [codeStudent, setCodeStudent] = useState("");

  const [userStudent, setUserStudent] = useState("");
  const [passwordStudent, setPasswordStudent] = useState("");
  const [newStudentForm, setNewStudentForm] = useState(newStudentObject);


  

  
  
  const columns = [
    "N°",
    "Codigo",
    "User",
    "Paterno",
    "Materno",
    "Nombre",
    "CI",
    "Correo",
    "Telefono",
    "Carrera",
    "Acción",
  ];

  //Listar Estudiantes
  const [data, setData] = useState([]);
  const [dataCarrera, setDataCarrera] = useState([]);
  const [average, setAverage] = useState(0);

  const loadData = () => {
    Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/students`)
      .then((response) => {
        const dataArray = response.data.map((student, index) => [
          index + 1,
          student.idStudent,
          student.user,
          student.paterno,
          student.materno,
          student.names,
          student.ci,
          student.email,
          student.phone,
          student.carrera,
          student.idUser,
        ]);
        setData(dataArray);
      })
      .catch((error) => {
        console.error(error);
      });
    Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/careers/enable`)
      .then((response) => {
        const dataArray = response.data.map(career => career.career)
        setDataCarrera(["Seleccione su carrera", ...dataArray]);
      })
  }
  useEffect(loadData, []);


  const fieldsC1 = [
    {
      label: "Apellido Paterno",
      placeholder: "",
      type: "text",
      id: "paterno",
    },
    { label: "Nombre", placeholder: "", type: "", id: "name" },
    {
      label: "Correo electrónico",
      placeholder: "correo@gmail.com",
      type: "email",
      id: "email",
    },
  ];
  const fieldsC2 = [
    {
      label: "Apellido Materno",
      placeholder: "",
      type: "text",
      id: "materno",
    },
    { label: "CI", placeholder: "", type: "text", id: "ci" },
    { label: "Teléfono", placeholder: "", type: "text", id: "phone" },
    { label: "Carrera:", placeholder: "", type:"select", id:'career', options:dataCarrera}
  ];

  const handleNew = () => {
    setIsOpenNew(!isOpenNew);
  };

  const loadDataQualification = (id) => {
    Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/programming/notesByIdStudent/${id}`).then((response) => {
      let dataYears = [];
      let dataToogles = [];
      response.data.years.forEach(element => {
          dataYears.push(element);
          dataToogles.push(false);
      });
      setYears(dataYears);
      setToogles(dataToogles);
      setDataQualified(response.data.data);
  }).catch((error) => {
      console.log(error);
  });
  }

  const loadDataHistory = (id) => {
    Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/programming/notesHistoryByIdStudent/${id}`).then((response) => {
      console.log(response)
      setDataHistory(response.data);
      let sum = 0;
      if(response.data.length !== 0){
        response.data.map(item=>{
          sum += item.final
          return true
        })
        setAverage((sum/response.data.length).toFixed(2))
      }else{
        setAverage(0);
      }
      
  }).catch((error) => {
      console.log(error);
  });
  }

  const handleQualification = (rowId,idSpecific) => {

    const student = data.find(item =>  {return item[10] === idSpecific;})
    const idStudent = student[1];
    setNameStudent({
      patern : student[3],
      matern : student[4],
      names : student[5],
    })
    setNameSubject(student[9]);
    setCodeStudent(student[1]);
    loadDataQualification(idStudent);
    setIsOpenQualification(!isOpenQualification);
    
  };

  const handleHistory = (rowId, idSpecific) => {
    setIsOpenHistory(!isOpenHistory);
    const student = data.find(item =>  {return item[10] === idSpecific;})
    const idStudent = student[1];
    setNameStudent({
      patern : student[3],
      matern : student[4],
      names : student[5],
    })
    setNameSubject(student[9]);
    setCodeStudent(student[1]);
    loadDataHistory(idStudent);
  }

  const handleCloseQualification = () => {
    setIsOpenQualification(!isOpenQualification);
  };
  const handleCloseHistory = () => {
    setIsOpenHistory(!isOpenHistory);
  };
  const handleDeleteModal = (id) => {
    setIsDeleteDilog(!isDeleteDialog);
    setIdDelete(id);
  };

  const handleInputChangeEdit = (id, newValue) => {
    const updatedRow = { ...editingRow, [id]: newValue };
    setEditingRow(updatedRow);
  };

  const handleInputChange = (id, newValue) => {
    const updateStudent = { ...newStudentForm, [id]:newValue };
    setNewStudentForm(updateStudent);
  };

  //Nuevo estudiante
  const handleSave = () => {
    const newRow = {
      ...newStudentForm,
      user: userStudent,
      password: passwordStudent
    };

    Axios.post(`${process.env.REACT_APP_SERVER_HOST}/api/students/`, newRow)
      .then((res) => {
        enqueueSnackbar('Creado',{variant:'success'});
        loadData();
        setNewStudentForm(newStudentObject);
        setUserStudent("");
        setPasswordStudent("");
        handleNew();
      })
      .catch((error) => {
        enqueueSnackbar(error.response.data.message,{variant:'warning'})
      });
  };

  const handleFinalDeletion = () => {
    setData(data.filter((row) => row.slice(1, 4).join(" ") !== idDelete));
    setIsDeleteDilog(!isDeleteDialog);
  };

  //obtener los datos del estudiantes
  const handleEditClick = (rowId) => {
    const row = data[rowId];
    const editRow = {
      enrollmentStudent: row[1],
      user: row[2],
      paterno: row[3],
      materno: row[4],
      name: row[5],
      ci: row[6],
      email: row[7],
      phone: row[8],
      career: row[9],
    };
    setUserStudent(row[1]);
    setIsModalEditOpen(true);
    setEditingRow(editRow);
    setEditedId(row[0]);
  };

  //actul
  const handleEditSave = () => {
    if (editingRow) {
      const newData ={
        paterno:editingRow.paterno,
        materno:editingRow.materno,
        name:editingRow.name,
        ci:editingRow.ci,
        email:editingRow.email,
        phone:editingRow.phone,
        career:editingRow.career,
        password:passwordStudent
      };
      
      Axios.put(`${process.env.REACT_APP_SERVER_HOST}/api/students/${userStudent}`,newData)
        .then(()=>{
          enqueueSnackbar('Editado',{variant:'success'});
          loadData();
          setIsModalEditOpen(false);
          setEditingRow(null);
        }).catch(err=> {
          enqueueSnackbar(err.response.data.message,{variant:'warning'});
        })
    }
  };
  const handleOpenModalEdit = () => {
    setIsModalEditOpen(!isModalEditOpen);
  };

  const tableRef = useRef(null);
    const currentDate = new Date();
    const formattedDate = format(currentDate, "MMMM dd, yyyy", { locale: es });

    const handleGenerateReport = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.addFont(poppins, 'Poppins', 'normal');
        doc.setFont('Poppins');
        doc.addImage(logo, 'SVG', 10, 9, 20, 20);
        doc.setFontSize(10);
        doc.setTextColor(39, 103, 158);
        doc.text('Instituto Técnico', 33, 18);
        doc.setFontSize(14);
        doc.text('SAN MARTIN', 33, 23);
        doc.setFontSize(10);
        doc.text('Fecha', 180, 20);
        doc.text(formattedDate, 166, 25);
        doc.setFontSize(20);
        doc.setTextColor(17, 45, 94);
        doc.setFont('Helvetica');
        doc.text('Historial academico', 78, 45);
        doc.setFontSize(14);
        doc.setTextColor(39, 103, 158);
        doc.text(`Estudiante: ${(nameStudent.patern + ' ' + nameStudent.matern + ' ' + nameStudent.names) }`,20,55);
        doc.text(`N° de programaciones: ${dataHistory.length}`,20,60);
        doc.text(`Promedio: ${average}`,20,65);
        doc.setDrawColor(39, 103, 158);
        doc.rect(130, 50, 55, 20);
        doc.setFont("bold");
        doc.setFontSize(10);
        doc.text(`Rectora`,152,69);
        doc.line(135, 66, 180, 66);
        if (tableRef.current) {

            doc.autoTable({
                html: tableRef.current,
                startY: 75,
                theme: 'plain',
                headStyles: {
                    textColor: [39, 103, 158],
                    fontSize: 12,
                },
                styles: {
                    fontSize: 10,
                    cellPadding: 2,
                    rowHeight: 10,
                    textColor: [126, 138, 149],
                    valign: 'middle',
                    vjustificate: 'center'
                },
                columnStyles: { 0: { fontStyle: 'bold' } },
                didDrawPage: function () {
                    doc.setLineWidth(0.5);
                    doc.setDrawColor(39, 103, 158);
                    const startY = 70;
                    const endY = 70;
                    const tableWidth = doc.internal.pageSize.width - 25;
                    doc.line(12, startY, tableWidth, endY);
                }
            });

        }
        doc.save('reporte.pdf');
    };


  if (isDeleteDialog) {
    return (
      <div className={modalClasses.total}>
        <div className={modalClasses.under}></div>
        <div className={modalClasses.containerDialog}>
          <div className={modalClasses.alert}>
            <img
              className={modalClasses.iconAlert}
              src={alertIcon}
              alt="alertDelete"
            />
          </div>
          <p className={modalClasses.cuestionAlert}>
            ¿Está seguro de que desea eliminar a <br /> {idDelete}?
          </p>
          <div className={modalClasses.containerButtons}>
            <div className={modalClasses.buttonAction}>
              <ButtonSM
                icon={cancelIcon}
                text="Cancelar"
                className2={modalClasses.buttonCancel}
                onClick={handleDeleteModal}
              />
            </div>
            <div className={modalClasses.buttonAction}>
              <ButtonSM
                icon={deletIconW}
                text="Eliminar"
                className2={modalClasses.buttonDelete}
                onClick={handleFinalDeletion}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else if (isOpenNew) {
    return (
      <div className={modalClasses.total}>
        <div className={modalClasses.under}></div>
        <div className={modalClasses.container}>
          <div className={modalClasses.content}>
            <div className={classes.modalTop}>
              <p className={classes.titlemodalList}>NUEVO ESTUDIANTE</p>
              <div className={classes.enrollment}>
                <label
                  className={classes.labelStudent}
                  htmlFor="enrollmentStudent"
                >
                  Matrícula:
                </label>
                <input
                  className={classes.inputEnrollment}
                  type="text"
                  id="enrollmentStudent"
                  onChange={(e) =>
                    handleInputChange("enrollmentStudent", e.target.value)
                  }
                />
              </div>
            </div>
            <div className={classes.inputsModal}>
              <DynamicInputs
                fields={fieldsC1}
                className={modalClasses.inputs}
                onChange={handleInputChange}
                values={newStudentForm}
              />
              <DynamicInputs
                fields={fieldsC2}
                className={modalClasses.inputs}
                onChange={handleInputChange}
                values={newStudentForm}
              />
            </div>
            <div className={classes.modalBottom}>
              <div className={classes.credentials}>
                <Credentials
                  onUserChange={setUserStudent}
                  onPasswordChange={setPasswordStudent}
                />
              </div>
              <div className={classes.container}>
                
                <div className={classes.buttonsModal}>
                  <div className={classes.buttonStudents}>
                    <ButtonSM
                      icon={saveIcon}
                      text="Guardar"
                      className={modalClasses.icons}
                      onClick={handleSave}
                    />
                  </div>
                  <div className={classes.buttonStudents}>
                    <ButtonSM
                      icon={cancelIcon}
                      text="Cancelar"
                      className={modalClasses.icons}
                      onClick={handleNew}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (isModalEditOpen) {
    return (
      <div className={modalClasses.total}>
        <div className={modalClasses.under}></div>
        <div className={modalClasses.container}>
          <div className={modalClasses.content}>
            <div className={classes.modalTop}>
              <p className={classes.titlemodalList}>EDITAR ESTUDIANTE</p>
              <div className={classes.enrollment}>
                <label
                  className={classes.labelStudent}
                  htmlFor="enrollmentStudent"
                >
                  Matrícula:
                </label>
                <input
                  disabled
                  className={classes.inputEnrollment}
                  type="text"
                  id="enrollmentStudent"
                  onChange={(e) =>
                    handleInputChangeEdit("enrollmentStudent", e.target.value)
                  }
                  value={editingRow && editingRow["enrollmentStudent"]}
                />
              </div>
            </div>
            <div className={classes.inputsModal}>
              <DynamicInputs
                fields={fieldsC1}
                className={modalClasses.inputs}
                onChange={handleInputChangeEdit}
                values={editingRow}
              />
              <DynamicInputs
                fields={fieldsC2}
                className={modalClasses.inputs}
                onChange={handleInputChangeEdit}
                values={editingRow}
              />
            </div>
            <div className={classes.modalBottom}>
              <div className={classes.credentials}>
                <Credentials
                  nameUser={editingRow.user}
                  onUserChange={setUserStudent}
                  onPasswordChange={setPasswordStudent}
                />
              </div>
              <div className={classes.container}>
                <div className={classes.buttonsModal}>
                  <div className={classes.buttonStudents}>
                    <ButtonSM
                      icon={editIconW}
                      text="Editar"
                      className={modalClasses.icons}
                      onClick={handleEditSave}
                    />
                  </div>
                  <div className={classes.buttonStudents}>
                    <ButtonSM
                      icon={cancelIcon}
                      text="Cancelar"
                      className={modalClasses.icons}
                      onClick={handleOpenModalEdit}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (isOpenQualification) {
    return (
      <div className={modalClasses.total}>
        <div className={modalClasses.under}></div>
        <div className={modalClasses.container}>
          <div className={modalClasses.content}>
            <div className={classes.containerStudent}>
              <div className={classes.nameStudent}>
                <p>
                  {nameStudent.names} <br /> {nameStudent.patern} {nameStudent.matern}
                </p>
                <div className={classes.dataStudent}>
                  <p>Matrícula: {codeStudent}</p>
                  <p>Carrera: {nameSubect}</p>
                </div>
              </div>
              {
                    years.map((item, index)=>{
                        return (
                        <div>
                            <div className={classes.sectionYear}>
                            <p className={classes.year}>{`${item} Año`}</p>
                            <button className={classes.buttonArrow} onClick={()=>{toogleTable(index, toogles[index])}}>
                                {toogles[index] ? (
                                <img
                                    className={classes.iconArrow}
                                    src={openArrow}
                                    alt="arrow"
                                />
                                ) : (
                                <img
                                    className={classes.iconArrow}
                                    src={closeArrow}
                                    alt="arrow"
                                />
                                )}
                            </button>
                            </div>
                            <hr className={classes.lineFirst} />
                            {toogles[index ] && (
                            <div className={classes.positionTable}>

                                <Table
                                columns={columnsQualified}
                                data={dataQualified[index].map((item, index)=>[
                                    index + 1,
                                    item.subject,
                                    item.month,
                                    item.parcialOne,
                                    item.parcialTwo,
                                    item.parcialThree,
                                    item.avgParcial,
                                    item.practices,
                                    item.exam,
                                    item.final
                                ])}
                                className2={classes.tableQualified}
                                />
                            </div>
                            )}
                        </div>
                        )
                    })
                    }
              <div className={classes.buttons}>
                <ButtonSM
                  className={classes.iconPosition}
                  icon={cancelIcon}
                  text="Cerrar"
                  onClick={handleCloseQualification}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (isOpenHistory) {
    return (
      <div className={modalClasses.total}>
        <div className={modalClasses.under}></div>
        <div className={modalClasses.container}>
          <div className={modalClasses.content}>
            <div className={classes.containerStudent}>
              <div className={classes.nameStudent}>
                <p>
                  {nameStudent.names} <br /> {nameStudent.patern} {nameStudent.matern}
                </p>
                <div className={classes.dataStudent}>
                  <p>Matrícula: {codeStudent}</p>
                  <p>Carrera: {nameSubect}</p>
                </div>
              </div>
              <div className={classes.data}>
                <div>
                  <p>{`Numero de Programaciones: ${dataHistory.length }`}</p>
                  <p>{`Promedio total: ${average}`}</p>
                </div>
                <div className={classes.dataButton}>
                    <ButtonSM icon={reportIcon} text={"Generar reporte"} className={classes.iconButton} onClick={()=>{handleGenerateReport()}} />
                </div>
              </div>
                <Table
                  columns={columnsHistory}
                  data={dataHistory.map((item, index)=>[
                      index + 1,
                      item.subject,
                      item.month,
                      item.final
                  ])}
                  className2={classes.tableQualified}
                  tableRef={tableRef}
                />
              <div className={classes.buttons}>
                <ButtonSM
                  className={classes.iconPosition}
                  icon={cancelIcon}
                  text="Cerrar"
                  onClick={handleCloseHistory}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={adminClasses.content}>
        <div className={classes.title}>
          <p className={adminClasses.text}>ESTUDIANTES</p>
          <hr className={adminClasses.lineTitle} />
        </div>
        <div className={classes.studentsTop}>
          
          <Search text={"Matrícula"} onSearch={setSearchTerm} />
          <div className={classes.buttonNewStudent}>
            <ButtonSM
              icon={newStudent}
              text={"Nuevo"}
              className={classes.iconStudent}
              onClick={handleNew}
            />
          </div>
        </div>
        <div className={classes.tableStudentContent}>
          <Table
            columns={columns}
            data={data.filter((row) =>
              Object.values(row).some(
                (val) =>
                  typeof val === "string" &&
                  val.toLowerCase().includes(searchTerm.toLowerCase())
              )
            )}
            icon={editStudent}
            icon2={qualification}
            icon3={history}
            columnIcon={"Acción"}
            className={classes.tableStudents}
            onDelete={handleQualification}
            start={1}
            end={4}
            onEdit={handleEditClick}
            onAdd={handleHistory}
          />
        </div>
      </div>
    );
  }
};

export default Students;
