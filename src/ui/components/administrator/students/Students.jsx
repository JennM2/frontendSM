import { useState, useEffect } from "react";
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
import saveIcon from "../../../../assets/icons/save.svg";
import cancelIcon from "../../../../assets/icons/cancel.svg";
import deletIconW from "../../../../assets/icons/deleteW.svg";
import alertIcon from "../../../../assets/images/alert.svg";
import editIconW from "../../../../assets/icons/editLight.svg";
import closeArrow from "../../../../assets/icons/arrow.svg";
import openArrow from "../../../../assets/icons/arrow2.svg";
import { enqueueSnackbar } from "notistack";

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
  const [years, setYears] = useState([]);
  const [toogles, setToogles] = useState([]);

  const columnsQualified = ['N°', 'Materia', 'Gestion', 'P1', 'P2', 'P3', 'Prom. Parcial', 'Practicas', 'Examen Final', 'Nota Final'];

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
  const handleCloseQualification = () => {
    setIsOpenQualification(!isOpenQualification);
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
                  onPasswordChange={e=>{setEditingRow({...editingRow, password:e})}}
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
            columnIcon={"Acción"}
            className={classes.tableStudents}
            onDelete={handleQualification}
            start={1}
            end={4}
            onEdit={handleEditClick}
            onAdd={handleQualification}
          />
        </div>
      </div>
    );
  }
};

export default Students;
