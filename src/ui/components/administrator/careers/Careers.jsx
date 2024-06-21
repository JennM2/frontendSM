import { useState, useEffect } from "react";
import Axios from "axios";

import adminStyles from "../Admin.style";
import useStyles from "./Careers.style";
import modalStyles from "../../Modal.style";
import ButtonSM from "../../forms/ButtonSM";
import Table from "../../table/Table";
import DynamicInputs from "../../forms/DynamicInputs";
import newStudent from "../../../../assets/icons/qualificationW.svg";
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

const Careers = () => {
  const adminClasses = adminStyles();
  const classes = useStyles();
  const modalClasses = modalStyles();

  const [isOpenNew, setIsOpenNew] = useState(false);
  const [isOpenQualification, setIsOpenQualification] = useState(false);
  const [isDeleteDialog, setIsDeleteDilog] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editedId, setEditedId] = useState("");
  const [searchTerm] = useState("");

  const [idCareer, setIdCareer] = useState("");
  const [career, setCareer] = useState("");
  const [durationCar, setDurationCar] = useState("");

  //Listar Estudiantes
  const [data, setData] = useState([]);

  const [isTableVisible1, setTableVisible1] = useState(false);
  const [isTableVisible2, setTableVisible2] = useState(false);
  const [isTableVisible3, setTableVisible3] = useState(false);
  const [iconTable1Visible, setIconTable1Visible] = useState(false);
  const [iconTable2Visible, setIconTable2Visible] = useState(false);
  const [iconTable3Visible, setIconTable3Visible] = useState(false);

  const [dataQualifiedOne, setDataQualifiedOne] = useState([]);
  const [dataQualifiedTwo, setDataQualifiedTwo] = useState([]);
  const [dataQualifiedThree, setDataQualifiedThree] = useState([]);

  const toggleTable1 = () => {
    setTableVisible1(!isTableVisible1);
    setTableVisible2(false);
    setTableVisible3(false);
    setIconTable1Visible(!iconTable1Visible);
  };
  const toggleTable2 = () => {
    setTableVisible1(false);
    setTableVisible2(!isTableVisible2);
    setTableVisible3(false);
    setIconTable2Visible(!iconTable2Visible);
  };
  const toggleTable3 = () => {
    setTableVisible1(false);
    setTableVisible2(false);
    setTableVisible3(!isTableVisible3);
    setIconTable3Visible(!iconTable3Visible);
  };

  const options = [
    { label: "inhabilitado", value: "inhabilitado" },
    { label: "habilitado", value: "habilitado" },
  ];

  const columns = [
    "Numero",
    "Carrera",
    "Duracion",
    "Estado",
    "Acción",
  ];

  const columnsQualified = [
    "N°",
    "Codigo",
    "Materia",
    "Pre-Requisito",
  ];

  const loadData = () => {
    Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/careers`)
      .then((response) => {
        const dataArray = response.data.map((career) => [
          career.idCareer,
          career.career,
          career.durationCar,
          career.stateCareer,
          "",
          "",
        ]);
        setData(dataArray);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  useEffect(loadData, []);

  // Listar Materias de las carreras por el idCareer y año
  useEffect(() => {
    const fetchSubjects = (setDataFunction) => {
      if (idCareer) {
        Axios.get(
          `${process.env.REACT_APP_SERVER_HOST}/api/subjects/career/primero?idCareer=${idCareer}`
        )
          .then((response) => {
            const dataArray = response.data.map((subject, index) => [
              index + 1,
              subject.code,
              subject.subject,
              subject.preSubject,
            ]);
            setDataFunction(dataArray);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };

    fetchSubjects(setDataQualifiedOne);
  }, [idCareer]);

  // Listar Materias de las carreras por el idCareer
  useEffect(() => {
    const fetchSubjects = (setDataFunction) => {
      if (idCareer) {
        Axios.get(
          `${process.env.REACT_APP_SERVER_HOST}/api/subjects/career/segundo?idCareer=${idCareer}`
        )
          .then((response) => {
            const dataArray = response.data.map((subject, index) => [
              index + 1,
              subject.code,
              subject.subject,
              subject.preSubject
            ]);
            setDataFunction(dataArray);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };

    fetchSubjects(setDataQualifiedTwo);
  }, [idCareer]);

  // Listar Materias de las carreras por el idCareer

  

  useEffect(()=>{
    const fetchSubjects = (setDataFunction) => {
      if (idCareer) {
        Axios.get(
          `${process.env.REACT_APP_SERVER_HOST}/api/subjects/career/tercero?idCareer=${idCareer}`
        )
          .then((response) => {
            const dataArray = response.data.map((subject, index) => [
              index + 1,
              subject.code,
              subject.subject,
              subject.preSubject
            ]);
            setDataFunction(dataArray);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };
    fetchSubjects(setDataQualifiedThree);
  }, [idCareer]);

  const fieldsC1 = [
    {
      label: "Carrera",
      placeholder: "",
      type: "text",
      id: "career",
    },
  ];

  const fieldsC2 = [
    {
      label: "Duración",
      placeholder: "",
      type: "text",
      id: "durationCar",
    },
  ];

  const handleNew = () => {
    setIsOpenNew(!isOpenNew);
  };
  const handleQualification = (rowId) => {
    const row = data[rowId];
    setIdCareer(row[0]);
    setCareer(row[1]);
    setDurationCar(row[2]);
    setIsOpenQualification(!isOpenQualification);
  };
  const handleCloseQualification = () => {
    setIsOpenQualification(!isOpenQualification);
  };
  const handleDeleteModal = (id) => {
    setIsDeleteDilog(!isDeleteDialog);
    setIdDelete(id);
  };
  const handleInputChange = (id, newValue) => {
    switch (id) {
      case "idCareer":
        setIdCareer(newValue);
        break;
      case "career":
        setCareer(newValue);
        break;
      case "durationCar":
        setDurationCar(newValue);
        break;
      default:
        break;
    }
  };

  //Nueva Carrera
  const handleSave = () => {
    const newRow = {
      career: career,
      durationCar: durationCar,
    };

    Axios.post(`${process.env.REACT_APP_SERVER_HOST}/api/careers`, newRow)
      .then((res) => {
        
        loadData();
        enqueueSnackbar('Creado',{variant:'success'})
        setIsOpenNew(false);
      })
      .catch((error) => {
        console.error(error);
        enqueueSnackbar(error.response.data.message,{variant:'warning'})
        
      });
  };

  const handleInputChangeEdit = (id, newValue) => {
    const updatedRow = { ...editingRow, [id]: newValue };
    setEditingRow(updatedRow);
  };

  const handleFinalDeletion = () => {
    setData(data.filter((row) => row.slice(1, 4).join(" ") !== idDelete));
    setIsDeleteDilog(!isDeleteDialog);
  };

  //obtener los datos del estudiantes
  const handleEditClick = (rowId) => {
    const row = data[rowId];
    const editingRow = {
      idCareer: row[0],
      career: row[1],
      durationCar: row[2],
      stateCareer: row[3],
    };
    setCareer(row[1]);
    setIsModalEditOpen(true);
    setEditingRow(editingRow);
    setEditedId(row[0]);
  };

  //actulizar los datos
  const handleEditSave = () => {
    if (editingRow) {
      const editedRowData = {
        idCareer: editingRow.idCareer,
        career: editingRow.career,
        durationCar: editingRow.durationCar,
        stateCareer: editingRow.stateCareer,
      };

      Axios.put(`${process.env.REACT_APP_SERVER_HOST}/api/careers/${editedId}`, editedRowData)
        .then((res) => {
          loadData();
          enqueueSnackbar('Actualizado',{variant:'success'});
          setIsModalEditOpen(false);
          setEditingRow(null);
        })
        .catch((error) => {
          enqueueSnackbar(error.response.data.message,{variant:'warning'})
        });
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
              <p className={classes.titlemodalList}>NUEVA CARRERA</p>
            </div>
            <div className={classes.inputsModal}>
              <DynamicInputs
                fields={fieldsC1}
                className={modalClasses.inputs}
                onChange={handleInputChange}
              />
              <DynamicInputs
                fields={fieldsC2}
                className={modalClasses.inputs}
                onChange={handleInputChange}
              />
            </div>
            <div className={classes.modalBottom}>
              <div className={classes.container}>
                <div className={classes.selectContainer}></div>
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
              <p className={classes.titlemodalList}>Editar Carrera</p>
              <div className={classes.enrollment}>
                <label className={classes.labelStudent} htmlFor="idCareer">
                  ID: {editingRow.idCareer}
                </label>
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
              <div className={classes.container}>
                <div className={classes.selectContainer}>
                  <label className={classes.labelSelect} htmlFor="stateCareer">
                    Estado de la carrera:
                  </label>
                  <select
                    className={classes.select}
                    id="stateCareer"
                    name="stateCareer"
                    value={editingRow && editingRow["stateCareer"]}
                    onChange={(e) =>
                      handleInputChangeEdit("stateCareer", e.target.value)
                    }
                  >
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={classes.buttonsModal}>
                  <div className={classes.buttonStudents}>
                    <ButtonSM
                      icon={editIconW}
                      text="Actulizar"
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
                <p>{career}</p>
                <p>ID: {idCareer}</p>
              </div>
              <div>
                <div className={classes.sectionYear}>
                  <p className={classes.year}>Primer Año</p>
                  <button
                    className={classes.buttonArrow}
                    onClick={toggleTable1}
                  >
                    {iconTable1Visible ? (
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
                {isTableVisible1 && (
                  <div className={classes.positionTable}>
                    <Table
                      columns={columnsQualified}
                      data={dataQualifiedOne}
                      className2={classes.tableQualified}
                    />
                  </div>
                )}
              </div>
              <div>
                <div className={classes.sectionYear}>
                  <p className={classes.year}>Segundo Año</p>
                  <button
                    className={classes.buttonArrow}
                    onClick={toggleTable2}
                  >
                    {iconTable2Visible ? (
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
                {isTableVisible2 && (
                  <div className={classes.positionTable}>
                    <Table
                      columns={columnsQualified}
                      data={dataQualifiedTwo}
                      className2={classes.tableQualified}
                    />
                  </div>
                )}
              </div>
              <div>
                <div className={classes.sectionYear}>
                  <p className={classes.year}>Tercer Año</p>
                  <button
                    className={classes.buttonArrow}
                    onClick={toggleTable3}
                  >
                    {iconTable3Visible ? (
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
                {isTableVisible3 && (
                  <div className={classes.positionTable}>
                    <Table
                      columns={columnsQualified}
                      data={dataQualifiedThree}
                      className2={classes.tableQualified}
                    />
                  </div>
                )}
              </div>
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
          <p className={adminClasses.text}>CARRERAS</p>
          <hr className={adminClasses.lineTitle} />
        </div>
        <div className={classes.studentsTop}>
          <div className={classes.buttonNewStudent}>
            <ButtonSM
              icon={newStudent}
              text={"Nueva Carrera"}
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
            columnAction={"Materias"}            
            icon3={qualification}
            columnIcon={"Acción"}
            className={classes.tableStudents}
            onDelete={handleDeleteModal}
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

export default Careers;
