import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useRef } from 'react';
import useStyles from './Subjects.style';
import modalStyles from '../../Modal.style'
import secretariesStyles from '../Secretaries.style';
import Button from '../../forms/ButtonSM';
import Table from '../../table/Table';

import addSubject from '../../../../assets/icons/addSubject.svg';
import editSubject from '../../../../assets/icons/edit.svg';
import deleteSubject from '../../../../assets/icons/delete.svg';
import listSubject from '../../../../assets/icons/listSubject.svg';
import alertIcon from '../../../../assets/images/alert.svg';
import cancelIcon from '../../../../assets/icons/cancel.svg';
import deletIconW from '../../../../assets/icons/deleteW.svg';
import enableIcon from '../../../../assets/icons/enable.svg';
import editIcon from '../../../../assets/icons/editLight.svg';
import reportList from '../../../../assets/icons/reports.svg';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import logo from '../../../../assets/images/logoSMpdf.png';
import poppins from '../../../../assets/fonts/Poppins-Regular.ttf';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { enqueueSnackbar } from 'notistack';
import Search from '../../forms/Search';


const Subjects = () => {
    const classes = useStyles();
    const modalClasses = modalStyles();
    const secretariesClasses = secretariesStyles();

    const [searchTerm, setSearchTerm] = useState(`${new Date().getFullYear() }-${new Date().getMonth() + 1}`);
    const [isDeleteDialog, setIsDeleteDilog] = useState(false);
    const [idDelete, setIdDelete] = useState('');
    const [idSpecific, setIdSpecific] = useState('');
    const [openModalEnableSubject, setOpenModalEnableSubject] = useState(false);
    const [openModalEditSubject, setOpenModalEditSubject] = useState(false);
    const [openModalStudentList, setOpenModalStudentList] = useState(false);
    const [editingRow, setEditingRow] = useState(null);
    const [editedId, setEditedId] = useState('');

    const [career, setCareer] = useState('');
    const [subject, setSubject] = useState('');
    const [year, setYear] = useState('');
    const [teacher, setTeacher] = useState('');
    const [schedule, setSchedule] = useState('');
    const [group, setGroup] = useState(1);
    const [month, setMonth] = useState('');
    const [enablementDate, setEnablementDate] = useState('');
    const [disablementDate, setDisablementDate] = useState('');
    const [subjectList, setSubjectList] = useState('');
    const [limit, setLimit] = useState(20);
    const [price, setPrice] = useState(200);


    const columns = ['N°', 'Materia', 'Carrera', 'Año', 'Docente', 'Horario', 'Grupo', "Limite", "Mes", 'Fecha de habilitación', 'Fecha de Finalización','Precio', 'Estado', 'Acción'];
    const horarios = ['Mañana','Tarde','Noche'];
    const grupos = ['1','2','3','4','5'];
    const months= [
        'Enero', 'Febrero', 'Marzo', 
        'Abril', 'Mayo', 'Junio', 
        'Julio', 'Agosto', 'Septiembre', 
        'Octubre', 'Noviembre', 'Diciembre'];

    //obtener todas las habilitaciones
    const [data, setData] = useState([]);
    const [careers, setCareers] = useState([]);
    const [years, setYears] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);

    const loadData = () => {
        Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/enable`)
          .then((res) => {
            console.log(res);
            const dataArray = res.data.map((enable, index) => [
              index + 1,
              enable.subject,
              enable.career,
              enable.year,
              enable.teacher,
              enable.schedule,
              enable.groupe,
              enable.limite,
              enable.month,
              enable.dateStart.slice(0,10),
              enable.dateEnd.slice(0,10),
              enable.price,
              enable.stateEnable,
              enable.idEnable,
            ]);
            setData(dataArray);
          })
          .catch((error) => {
            console.error(error);
          });
        Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/careers/enable`)
        .then((response) => {
            setCareers(response.data);
        })
        .catch((error) => {
        });
    }
    useEffect(loadData, []);

    const loadDataYear = (editCareer) => {
        const years = careers.find(item => item.career === (editCareer || career))?.durationCar || 0;
        let yearsArray = []
        for (let index = 1; index <= years; index++) {
          yearsArray.push(index);
        }
        setYears(yearsArray);
    }
    useEffect(loadDataYear,[career])


    useEffect(() => {
        Axios.get(
          `${process.env.REACT_APP_SERVER_HOST}/api/subjects?carrera=${career  || 'default'}&year=${year  || 'default'}`
        )
          .then((response) => {

            setSubjects(response.data);
          })
          .catch((error) => {
          });
    }, [career, year]);

    useEffect(()=>{

        Axios.get(
            `${process.env.REACT_APP_SERVER_HOST}/api/subjectTeacher/subjectTeacher/${subject || 'default'}`
          )
            .then((response) => {
              setTeachers(response.data);
            })
            .catch((error) => {
            });
    },[career,year,subject])



    const columnStudentList = ['N°', 'Matrícula', 'Nombre Completo'];
    const [dataStudents, setDatsStudents] = useState([
    ]);
    const handleDeleteModal = (id, idSpecific) => {
        setIsDeleteDilog(!isDeleteDialog);
        setIdDelete(id);
        setIdSpecific(idSpecific);
    };

    const handleFinalDeletion = () => {
        Axios.delete(`${process.env.REACT_APP_SERVER_HOST}/api/enable/${idSpecific}`).then(()=>{
            enqueueSnackbar('Editado',{variant:'success'});
            loadData();
        }).catch((error)=>{
            enqueueSnackbar(error.response.data.message,{variant:'warning'})
        })
        setIsDeleteDilog(!isDeleteDialog);
    };

    const handleOpenModalEnable = () => {
        setOpenModalEnableSubject(!openModalEnableSubject);
        handleStates();
    };
    const handleOpenModalEditSubject = () => {
        setOpenModalEditSubject(!openModalEditSubject);
        handleStates();
    };
    const handleStates = () => {
        setCareer('');
        setSubject('');
        setYear('');
        setTeacher('');
        setSchedule('');
        setGroup('');
        setEnablementDate('');
        setDisablementDate('');
        setLimit(20);
    };

    const handleSave = () => {
        const newRow = {
            idTeaSub :teacher,
            month : month,
            dateStart : enablementDate,
            dateEnd : disablementDate,
            schedule : schedule,
            subjectName : subject,
            group: group,
            limit: limit,
            price: price
        }
        Axios.post(`${process.env.REACT_APP_SERVER_HOST}/api/enable`,newRow).then(()=> {
            enqueueSnackbar('Creado',{variant:'success'});
            loadData();
            handleOpenModalEnable();
        }).catch((error)=>{
            console.log('error');
            enqueueSnackbar(error.response.data.message,{variant:'warning'})
        })
        ///handleOpenModalEnable(false);
        ///handleStates();

    };
    const handleInputChangeEdit = (id, newValue) => {
        const updatedRow = { ...editingRow, [id]: newValue };
        setEditingRow(updatedRow);
    };

    const handleEditClick = (rowId,specific) => {

        const row = data.find(item=>item[13]===specific);

        setCareer(row[2]);
        setYear(row[3]);
        setSubject(row[1]);
        setTeacher(row[4]);
        setSchedule(row[5]);
        setGroup(row[6]);
        setLimit(row[7]);
        setMonth(`${row[8].slice(-4)}-${
            ((a = (['Enero', 'Febrero', 'Marzo', 
            'Abril', 'Mayo', 'Junio', 
            'Julio', 'Agosto', 'Septiembre', 
            'Octubre', 'Noviembre', 'Diciembre'].findIndex(item=>item===(row[8].slice(0,(row[8].indexOf('/') - 1)))) + 1))=>{return a>=10? a : `0${a}`})()}`);
        setEnablementDate(row[9]);
        setDisablementDate(row[10]);
        setPrice(row[11]);
        
        setOpenModalEditSubject(true);
        setEditedId(row[13]);
    };
    const handleEditSave = () => {
        const updateData = {
            idTeaSub : teachers.find(item => item.nombre === teacher).idTeaSub,
            subjectName : career,
            dateStart : enablementDate,
            dateEnd : disablementDate,
            schedule : schedule,
            group : group,
            month : month,
            limit : limit,
            price : price,
        }
        Axios.put(`${process.env.REACT_APP_SERVER_HOST}/api/enable/${editedId}`,updateData).then(()=>{
            enqueueSnackbar('Editado',{variant:'success'});
            loadData();
            setOpenModalEditSubject(false);
        }).catch((error)=>{
            console.log(error);
            enqueueSnackbar(error.response.data.message,{variant:'warning'})
        })
    };

    const loadDataStudents = async(idEnable) => {
        Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/programming/allStudents/${idEnable}`).then(response=>{
            const data = response.data.map((item, index) => [
                index + 1,
                item.idStudent,
                item.fullName
            ])
            setDatsStudents(data);
        })
    }

    const handleOpenStudentList = async(rowId) => {
        const idEnable = data[rowId][11];
        setSubjectList(`${data[rowId][1]} - ${data[rowId][7]}`);
        loadDataStudents(idEnable);
        setOpenModalStudentList(!openModalStudentList);
    };

    const tableRef = useRef(null);
    const currentDate = new Date();
    const formattedDate = format(currentDate, "MMMM dd, yyyy", { locale: es });

    const handleGenerateList = () => {
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
        doc.text('Lista de Estudiantes', 78, 45);
        doc.setFont('Poppins');
        doc.setFontSize(14);
        doc.text(`MATERIA: ${subjectList}`, 15, 60);



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
                    const startY = 80;
                    const endY = 80;
                    const tableWidth = doc.internal.pageSize.width - 25;
                    doc.line(12, startY, tableWidth, endY);
                }
            });

        }

        doc.save('reporte.pdf');
        setOpenModalStudentList(!openModalStudentList);
    };


    if (isDeleteDialog) {
        return (
            <div className={modalClasses.total}>
                <div className={modalClasses.under}></div>
                <div className={modalClasses.containerDialog}>
                    <div className={modalClasses.alert}>
                        <img className={modalClasses.iconAlert} src={alertIcon} alt="alertDelete" />
                    </div>
                    <p className={modalClasses.cuestionAlert}>¿Está seguro de que desea eliminar a <br /> {idDelete}?</p>
                    <div className={modalClasses.containerButtons}>
                        <div className={modalClasses.buttonAction}>
                            <Button icon={cancelIcon} text="Cancelar" className2={modalClasses.buttonCancel} onClick={handleDeleteModal} />
                        </div>
                        <div className={modalClasses.buttonAction}>
                            <Button icon={deletIconW} text="Eliminar" className2={modalClasses.buttonDelete} onClick={handleFinalDeletion} />
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if (openModalEnableSubject) {
        return (
            <div className={modalClasses.total}>
                <div className={modalClasses.under}></div>
                <div className={modalClasses.container}>
                    <div className={modalClasses.content}>
                        <p className={classes.titleEnable}>HABILITAR MATERIA</p>
                        <div className={classes.contentEnableSubject}>
                            <div className={classes.contentLeft}>
                                <div className={classes.dataEnable}>
                                    <label className={classes.labelSelect} htmlFor="opciones">Carrera:</label>
                                    <select className={classes.select} id="opciones" name="opciones" value={career} onChange={(e) => {
                                        setCareer(e.target.value);
                                        setYear('');
                                        setSubject('');
                                        setTeacher('');
                                    }}>
                                        <option>Seleccione la carrera</option>
                                        {careers.map((option) => (
                                            <option key={option.career} value={option.career}>
                                                {option.career}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={classes.dataEnable}>
                                    <label className={classes.labelSelect} htmlFor="opciones">Año:</label>
                                    <select className={classes.select} id="opciones" name="opciones" value={year} onChange={(e) => {
                                        setYear(e.target.value);
                                        setSubject('');
                                        setTeacher('');
                                    }}>
                                        <option>Seleccione el año</option>
                                        {years.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={classes.dataEnable}>
                                    <label className={classes.labelSelect} htmlFor="opciones">Materia:</label>
                                    <select className={classes.select} id="opciones" name="opciones" value={subject} onChange={(e) => {
                                        setSubject(e.target.value);
                                        setTeacher('');
                                    }}>
                                        <option>Seleccione la materia</option>
                                        {subjects.map((option) => (
                                            <option key={option.subject} value={option.subject}>
                                                {option.subject}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={classes.dataEnable}>
                                    <label className={classes.labelSelect} htmlFor="opciones">Docente:</label>
                                    <select className={classes.select} id="opciones" name="opciones" value={teacher} onChange={(e) => setTeacher(e.target.value)}>
                                        <option>Seleccione el docente</option>
                                        {teachers.map((option) => (
                                            <option key={option.idTeaSub} value={option.idTeaSub}>
                                                {option.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className={classes.contentRight}>
                                
                                <div className={classes.intoConentRignt}>
                                    <div className={classes.dataEnableInto}>
                                        <label className={classes.labelSelect} htmlFor="opciones">Gestion:</label>
                                        <input className={classes.selectInto} type="month" id="month" name="month" value={month} onChange={(e) => setMonth(e.target.value)} />
                                    </div>
                                    <div className={classes.dataEnableInto}>
                                        <label className={classes.labelSelect} htmlFor="opciones">Horario:</label>
                                        <select className={classes.selectInto} id="opciones" name="opciones" value={schedule} onChange={(e) => setSchedule(e.target.value)}>
                                            <option>Seleccione un horario</option>
                                            {horarios.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className={classes.intoConentRignt}>
                                    <div className={classes.dataEnableInto}>
                                        <label className={classes.labelSelect} htmlFor="opciones">Grupo:</label>
                                        <select className={classes.selectInto} id="opciones" name="opciones" value={group} onChange={(e) => setGroup(e.target.value)}>
                                            <option>Seleccione el grupo</option>
                                            {grupos.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={classes.dataEnableInto}>
                                        <label className={classes.labelSelect} htmlFor="opciones">Limite:</label>
                                        <input className={classes.selectInto} min={0} type='number' placeholder='Limite de estudiantes' value={limit} onChange={({target}) => setLimit(target.value)}/>
                                    </div>
                                </div>
                                <div className={classes.intoConentRignt}>
                                    <div className={classes.dataEnableInto}>
                                        <label className={classes.labelSelect} htmlFor="opciones">Precio Bs:</label>
                                        <input className={classes.selectInto} min={0} type='number' placeholder='Limite de estudiantes' value={price} onChange={({target}) => setPrice(target.value)}/>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <hr className={classes.lineSubject} />
                        <div className={classes.contentBottomEnable}>
                            <div className={classes.contentBottom}>
                                <div className={classes.dataEnableBottom}>
                                    <label className={classes.labelSelectBottom} htmlFor="enablementDate">Fecha de habilitación:</label>
                                    <input className={classes.selectInto} type="date" id="enablementDate" name="enablementDate" value={enablementDate} onChange={(e) => setEnablementDate(e.target.value)} />
                                </div>
                                <div className={classes.dataEnableBottom}>
                                    <label className={classes.labelSelectBottom} htmlFor="disablementDate">Fecha de finalización:</label>
                                    <input className={classes.selectInto} type="date" id="disablementDate" name="disablementDate" value={disablementDate} onChange={(e) => setDisablementDate(e.target.value)} />
                                </div>
                            </div>
                            <div className={classes.buttonsEnableSubject}>
                                <Button icon={enableIcon} text={"Habilitar"} className={classes.iconButton} className2={classes.buttonEnable} onClick={handleSave} />
                                <Button icon={cancelIcon} text={"Cancelar"} className={classes.iconButton} className2={classes.buttonCancel} onClick={handleOpenModalEnable} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    } else if (openModalEditSubject) {
        return (
            <div className={modalClasses.total}>
                <div className={modalClasses.under}></div>
                <div className={modalClasses.container}>
                    <div className={modalClasses.content}>
                        <p className={classes.titleEnable}>EDITAR MATERIA HABILITADA</p>
                        <div className={classes.contentEnableSubject}>
                            <div className={classes.contentLeft}>
                                <div className={classes.dataEnable}>
                                    <label className={classes.labelSelect} htmlFor="career">Carrera:</label>
                                    <select className={classes.select} id="career" name="career" value={career} onChange={(e) => {setCareer(e.target.value);setYear('');setSubject('');setTeacher('')}}>
                                        {careers.map((option) => (
                                            <option key={option.career} value={option.career}>
                                                {option.career}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={classes.dataEnable}>
                                    <label className={classes.labelSelect} htmlFor="year">Año:</label>
                                    <select className={classes.select} id="year" name="year" value={year} onChange={(e) => {setYear(e.target.value);setSubject('');setTeacher('')}}>
                                        <option>Seleccione el año</option>
                                        {years.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={classes.dataEnable}>
                                    <label className={classes.labelSelect} htmlFor="subject">Materia:</label>
                                    <select className={classes.select} id="subject" name="opciosubjectnes" value={subject} onChange={(e) => {setSubject(e.target.value);setTeacher('')}}>
                                        <option>Seleccione la materia</option>
                                        {subjects.map((option) => (
                                            <option key={option.subject} value={option.subject}>
                                                {option.subject}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={classes.dataEnable}>
                                    <label className={classes.labelSelect} htmlFor="opciones">Docente:</label>
                                    <select className={classes.select} id="opciones" name="opciones" value={teacher} onChange={(e) =>{setTeacher(e.target.value)}}>
                                        <option>Seleccione el docente</option>
                                        {teachers.map((option) => (
                                            <option key={option.nombre} value={option.nombre}>
                                                {option.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className={classes.contentRight}>
                                <div className={classes.intoConentRignt}>
                                    <div className={classes.dataEnableInto}>
                                        <label className={classes.labelSelect} htmlFor="opciones">Gestion:</label>
                                        <input className={classes.selectInto} type="month" id="month" name="month" value={month} onChange={(e) => setMonth(e.target.value)} />
                                    </div>
                                    <div className={classes.dataEnableInto}>
                                        <label className={classes.labelSelect} htmlFor="opciones">Horario:</label>
                                        <select className={classes.selectInto} id="opciones" name="opciones" value={schedule} onChange={(e) => setSchedule(e.target.value)}>
                                            <option>Seleccione un horario</option>
                                            {horarios.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                </div>
                                <div className={classes.intoConentRignt}>
                                    <div className={classes.dataEnableInto}>
                                        <label className={classes.labelSelect} htmlFor="opciones">Grupo:</label>
                                        <select className={classes.selectInto} id="opciones" name="opciones" value={group} onChange={(e) => setGroup(e.target.value)}>
                                            <option>Seleccione el grupo</option>
                                            {grupos.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={classes.dataEnableInto}>
                                        <label className={classes.labelSelect} htmlFor="opciones">Limite:</label>
                                        <input className={classes.selectInto} min={0} type='number' placeholder='Limite de estudiantes' value={limit} onChange={({target}) => setLimit(target.value)}/>
                                    </div>
                                </div>
                                <div className={classes.intoConentRignt}>
                                    <div className={classes.dataEnableInto}>
                                        <label className={classes.labelSelect} htmlFor="opciones">Precio Bs:</label>
                                        <input className={classes.selectInto} min={0} type='number' placeholder='Limite de estudiantes' value={price} onChange={({target}) => setPrice(target.value)}/>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <hr className={classes.lineSubject} />
                        <div className={classes.contentBottomEnable}>
                            <div className={classes.contentBottom}>
                                <div className={classes.dataEnableBottom}>
                                    <label className={classes.labelSelectBottom} htmlFor="enablementDate">Fecha de habilitación:</label>
                                    <input className={classes.selectInto} type="date" id="enablementDate" name="enablementDate" value={enablementDate} onChange={(e) => setEnablementDate(e.target.value)} />
                                </div>
                                <div className={classes.dataEnableBottom}>
                                    <label className={classes.labelSelectBottom} htmlFor="disablementDate">Fecha de finalización:</label>
                                    <input className={classes.selectInto} type="date" id="disablementDate" name="disablementDate" value={disablementDate} onChange={(e) => setDisablementDate(e.target.value)} />
                                </div>
                            </div>
                            <div className={classes.buttonsEnableSubject}>
                                <Button icon={editIcon} text={"Editar"} className={classes.iconButton} className2={classes.buttonEnable} onClick={handleEditSave} />
                                <Button icon={cancelIcon} text={"Cancelar"} className={classes.iconButton} className2={classes.buttonCancel} onClick={handleOpenModalEditSubject} />
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
                        <p className={classes.titleEnable}>EDITAR MATERIA HABILITADA</p>
                        <div className={classes.tableStudents}>
                            <Table columns={columnStudentList} data={dataStudents} className2={classes.bodyTable} tableRef={tableRef} />
                        </div>
                        <div className={classes.buttonListStudent}>
                            <Button icon={reportList} text={"Generar lista "} onClick={handleGenerateList} />
                            <Button icon={cancelIcon} text={"Cancelar "} onClick={()=>{setOpenModalStudentList(false)}} />
                        </div>
                    </div>
                </div>
            </div>

        );
    } else {
        return (
            <div className={secretariesClasses.content} >
                <div>
                    <p className={secretariesClasses.text}>MATERIAS HABILITADAS</p>
                    <hr className={secretariesClasses.lineTitle} />
                </div>
                <div className={classes.searchUsers}>
                    <Search label={"Buscar gestion"} text={"Buscar"} onSearch={setSearchTerm} type={'month'} value={searchTerm}/>
                </div>
                <div className={classes.buttonSubject}>
                    <Button icon={addSubject} text={"Habilitar Materia"} className={classes.iconButton} onClick={handleOpenModalEnable} />
                </div>
                <div className={classes.tableSubject}>
                    <Table 
                        columns={columns} 
                        data={data.filter(item=>{
                            const date = `${months[Number(searchTerm.slice(5,7)) - 1]} / ${searchTerm.slice(0,4)}`;
                            if(searchTerm==='')
                                return true
                            else
                                return item[8] === date
                        })} 
                        columnIcon={"Acción"} 
                        icon={editSubject} 
                        icon2={deleteSubject} 
                        icon3={listSubject} 
                        className={classes.sizeTable} 
                        classNameIcon={classes.sizeIcons}
                        onEdit={handleEditClick} 
                        start={1} 
                        end={2} 
                        onDelete={handleDeleteModal} 
                        onAdd={handleOpenStudentList}
                        state={12}
                    />
                </div>
            </div>
        );
    }



};
export default Subjects;