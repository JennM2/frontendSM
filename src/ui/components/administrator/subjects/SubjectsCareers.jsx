import { useState, useEffect, useRef } from "react";
import Axios from "axios";
import { enqueueSnackbar } from "notistack";

import adminStyles from "../Admin.style";
import useStyles from "./SubjectsCareers.style";
import modalStyles from "../../Modal.style";
import Search from "../../forms/Search";
import ButtonSM from "../../forms/ButtonSM";
import Table from "../../table/Table";
import DynamicInputs from "../../forms/DynamicInputs";
import newStudent from "../../../../assets/icons/addSubject.svg";
import editStudent from "../../../../assets/icons/edit.svg";
import saveIcon from "../../../../assets/icons/save.svg";
import cancelIcon from "../../../../assets/icons/cancel.svg";
import deletIconW from "../../../../assets/icons/delete.svg";
import alertIcon from "../../../../assets/images/alert.svg";
import paydIcon from "../../../../assets/icons/paid.svg";
import reportIcon from '../../../../assets/icons/reports.svg';
import closeIcon from '../../../../assets/icons/cancel.svg';
import logo from '../../../../assets/images/logoSMpdf.png';
import poppins from '../../../../assets/fonts/Poppins-Regular.ttf';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { jsPDF } from 'jspdf';


const SubjectsCareers = () => {
  const adminClasses = adminStyles();
  const classes = useStyles();
  const modalClasses = modalStyles();

  const [isOpenNew, setIsOpenNew] = useState(false);
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const [idDeleteSpecific, setIdDeleteSpecific] = useState("");
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalPriceOpen, setIsModalPriceOpen] = useState(false);

  const [editingRow, setEditingRow] = useState(null);
  const [editedId, setEditedId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermMonth, setSearchTermMonth] = useState("");

  const [careers, setCareers] = useState("");
  const [selectedCareer, setSelectedCareer] = useState("");
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [, setStateSubject] = useState("");

  const [subject, setSubject] = useState("");
  const [code, setCode] = useState("");
  const [preSubject, setPreSubject] = useState("");
  const [dataPrice, setDataPrice] = useState([]);
  const [nameSubject, setNameSubject] = useState('');

  const columns = [
    "N°",
    "Codigo",
    "Materia",
    "Año",
    "Pre-Requisito",
    "Carrera",
    "Estado",
    "Acción",
  ];
  const options = [
    { label: "habilitado", value: "habilitado" },
    { label: "inhabilitado", value: "inhabilitado" },
  ];

  //LISTAR MATERIAS
  const [data, setData] = useState([]);

  const loadData = () => {
    Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/subjects/subjects`)
      .then((response) => {
        const dataArray = response.data.map((subject, index) => [
          index + 1,
          subject.code,
          subject.subject,
          subject.year,
          subject.preSubject,
          subject.career,
          subject.stateSubject,
          subject.idSubject,
        ]);
        setData(dataArray);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(loadData, []);

  const loadDataPrice = (id) => {
    Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/enable/price/${id}`)
      .then((response) => {
        setDataPrice(response.data.map((item, index)=>[
          index + 1,
          item.month,
          item.price,
          item.students
        ]));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //---------------Obtener laa carreras y sus anios por el nombre
  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/careers`)
      .then((response) => {
        setCareers(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener careers:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedCareer) {
      Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/careers/year/${selectedCareer}`)
        .then((response) => {
          setYears(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener años:", error);
        });
    }
  }, [selectedCareer]);

  const handleCareerChange = (event) => {
    setSelectedCareer(event.target.value);
    setSelectedYear(""); // Reset year when career changes
  };

  const fieldsC1 = [
    {
      label: "Materia",
      placeholder: "",
      type: "text",
      id: "subject",
    },
    { label: "Prerrequisito", placeholder: "", type: "", id: "preSubject" },
  ];
  const fieldsC2 = [
    {
      label: "Código",
      placeholder: "",
      type: "text",
      id: "code",
    },
  ];

  const handleNew = () => {
    setIsOpenNew(!isOpenNew);
    setSelectedCareer("");
    setSelectedYear("");
  };

  const handleInputChange = (id, newValue) => {
    switch (id) {
      case "subject":
        setSubject(newValue);
        break;
      case "code":
        setCode(newValue);
        break;
      case "preSubject":
        setPreSubject(newValue);
        break;
      default:
        break;
    }
  };

  // Nueva materia
  const handleSave = () => {
    
    const newSubject = {
      year: selectedYear,
      subject: subject,
      code: code,
      preSubject: preSubject,
      careerName: selectedCareer,
    };

    Axios.post(`${process.env.REACT_APP_SERVER_HOST}/api/subjects/subjects`, newSubject)
      .then((res) => {
        enqueueSnackbar('Creado',{variant:'success'})
        loadData();
        setIsOpenNew(false);
      })
      .catch((error) => {
        enqueueSnackbar(error.response.data.error, {
          variant: "warning",
        });
      });
  };

  const handleInputChangeEdit = (id, newValue) => {
    const updatedRow = { ...editingRow, [id]: newValue };
    setEditingRow(updatedRow);
  };

  const handleDeleteModal = (id, idSpecific) => {
    setIsDeleteDialog(!isDeleteDialog);
    setIdDelete(id);
    setIdDeleteSpecific(idSpecific);
    console.log("tttttttttttttttt", idSpecific);
  };

  const handleFinalDeletion = () => {
    Axios.put(
      `${process.env.REACT_APP_SERVER_HOST}/api/subjects/inactivate/${idDeleteSpecific}`
    )
      .then(loadData)
      .then(() => {
        setIsDeleteDialog(!isDeleteDialog);
        enqueueSnackbar("Inhabilitado", { variant: "success" });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //obtener los datos de las materias
  const handleEditClick = (rowId) => {
    const row = data[rowId];
    const editingRow = {
      idSubject: row[7],
      code: row[1],
      subject: row[2],
      year: row[3],
      preSubject: row[4],
      career: row[5],
      stateSubject: row[6],
    };
    setSubject(row[2]);
    setStateSubject(row[6]);
    setSelectedCareer(row[5]);
    setSelectedYear(row[3]);
    setIsModalEditOpen(true);
    setEditingRow(editingRow);
    setEditedId(row[7]);
    console.log(row[6]);
  };

  //actulizar los datos de las materias -------------------------------- Error
  const handleEditSave = () => {
    if (editingRow) {
      const editedRowData = {
        idSubject: editingRow.idSubject,
        code: editingRow.code,
        subject: editingRow.subject,
        year: selectedYear,
        preSubject: editingRow.preSubject,
        career: selectedCareer,
        state: editingRow.stateSubject,
      };

      Axios.put(
        `${process.env.REACT_APP_SERVER_HOST}/api/subjects/subjects/${editedId}`,
        editedRowData
      )
        .then((res) => {
          loadData();
          enqueueSnackbar('Editado',{variant:'success'});
          setIsModalEditOpen(false);
          setEditingRow(null);
        })
        .catch((err) => {
          enqueueSnackbar(err.response.data.error,{variant:'error'});
        });
    }
  };

  const handleOpenModalEdit = () => {
    setIsModalEditOpen(!isModalEditOpen);
  };

  const handleClickPrice = (id, idSpecific, name) => {
    setIsModalPriceOpen(!isModalPriceOpen);
    loadDataPrice(idSpecific);
    setNameSubject(name);
  }
  const columnsModal = ['N°', 'Gestion', 'Precio', 'Estudiantes'];
  const months= [
    'Enero', 'Febrero', 'Marzo', 
    'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 
    'Octubre', 'Noviembre', 'Diciembre'];

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
      doc.text('Reporte de precios', 78, 45);
      doc.setFontSize(14);
      doc.setTextColor(39, 103, 158);
      doc.text(`Materia: ${nameSubject}`,20,55);
      doc.text(`Gestion: ${searchTermMonth===''?'Todos los registrados':`${searchTermMonth}`}`,20,60);

      if (tableRef.current) {

          doc.autoTable({
              html: tableRef.current,
              startY: 70,
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


  if (isModalPriceOpen) {
    return (
        <div className={modalClasses.total}>
            <div className={modalClasses.under}></div>
            <div className={modalClasses.container}>
                <div className={modalClasses.content}>
                    <p className={classes.titleEnable}>Historial de precios</p>
                    <div className={classes.containerName}>
                        <div className={classes.nameteacher}>
                            <p>{nameSubject}</p>
                        </div>
                    </div>
                    <hr className={classes.lineDetail} />
                    
                    <div className={classes.options}>
                        <Search label={"Buscar gestion"} text={"Buscar"} onSearch={setSearchTermMonth} type={'month'} value={searchTermMonth}/>
                        <div>
                            <ButtonSM icon={reportIcon} text={"Generar reporte"} className={classes.iconButton} onClick={()=>{handleGenerateReport()}} />
                        </div>
                    </div>
                    <div className={classes.containerTableDetail}>
                        <Table 
                            columns={columnsModal} 
                            data={dataPrice.filter((item) => {
                                const date = `${months[Number(searchTermMonth.slice(5,7)) - 1]} / ${searchTermMonth.slice(0,4)}`;
                                if(searchTermMonth==='')
                                    return true
                                else
                                    return item[2] === date
                            }
                                )} 
                            className={classes.tableDetail} 
                            className2={classes.bodyTableDetail}
                            tableRef={tableRef} 
                        />
                    </div>
                    <div className={classes.buttonClose}>
                        <ButtonSM icon={closeIcon} text="Cerrar" className={classes.iconTeacher} onClick={()=>{setIsModalPriceOpen(false)}} />
                    </div>
                  </div>
              </div>
          </div>
      );
  } else if (isDeleteDialog) {
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
              <p className={classes.titlemodalList}>NUEVA MATERIA</p>
              <div className={classes.enrollment}></div>
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
              <div className={classes.credentials}>
                <div className={classes.selectContainer}>
                  <label className={classes.labelSelect} htmlFor="careers">
                    Carreras:
                  </label>
                  <select
                    className={classes.select}
                    id="careers"
                    name="careers"
                    value={selectedCareer}
                    onChange={handleCareerChange}
                  >
                    <option value="">Seleccione la Carrera</option>
                    {careers.map((career, index) => (
                      <option key={index} value={career.career}>
                        {career.career}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={classes.container}>
                <div className={classes.selectContainer}>
                  <label className={classes.labelSelect} htmlFor="year">
                    Año:
                  </label>
                  <select
                    className={classes.select}
                    id="years"
                    name="years"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="">Seleccione el Año</option>
                    {years.map((year, index) => (
                      <option key={index} value={year.number}>
                        {year.number}
                      </option>
                    ))}
                  </select>
                </div>
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
        <div className={modalClasses.under}></div>        <div className={modalClasses.container}>
          <div className={modalClasses.content}>
            <div className={classes.modalTop}>
              <p className={classes.titlemodalList}>EDITAR MATERIA</p>
              <div className={classes.enrollment}></div>
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
                  <div className={classes.selectContainer}>
                    <label className={classes.labelSelect} htmlFor="careers">
                      Carreras:
                    </label>
                    <select
                      className={classes.select}
                      id="careers"
                      name="careers"
                      value={selectedCareer}
                      onChange={handleCareerChange}
                    >
                      <option value="">Seleccione la Carrera</option>
                      {careers.map((career, index) => (
                        <option key={index} value={career.career}>
                          {career.career}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={classes.container}>
                  <div className={classes.selectContainer}>
                    <label className={classes.labelSelect} htmlFor="year">
                      Año:
                    </label>
                    <select
                      className={classes.select}
                      id="years"
                      name="years"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      <option value="">Seleccione el Año</option>
                      {years.map((year, index) => (
                        <option key={index} value={year.number}>
                          {year.number}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={classes.selectContainer}>
                    <label className={classes.labelSelect} htmlFor="year">
                      Estado:
                    </label>
                    <select
                      className={classes.select}
                      id="stateSubject"
                      name="stateSubject"
                      value={editingRow && editingRow["stateSubject"]}
                      onChange={(e) =>
                        handleInputChangeEdit("stateSubject", e.target.value)
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
                        icon={saveIcon}
                        text="Guardar"
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
  } else {
    return (
      <div className={adminClasses.content}>
        <div className={classes.title}>
          <p className={adminClasses.text}>MATERIAS</p>
          <hr className={adminClasses.lineTitle} />
        </div>
        <div className={classes.studentsTop}>
          <Search text={"Codigo"} onSearch={setSearchTerm} />
          <div className={classes.buttonNewStudent}>
            <ButtonSM
              icon={newStudent}
              text={"Nueva Materia"}
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
            icon2={deletIconW}
            icon3={paydIcon}
            columnIcon={"Acción"}
            className={classes.tableStudents}
            onDelete={handleDeleteModal}
            start={1}
            end={3}
            onEdit={handleEditClick}
            state={6}
            onAdd={handleClickPrice}
          />
        </div>
      </div>
    );
  }
};

export default SubjectsCareers;
