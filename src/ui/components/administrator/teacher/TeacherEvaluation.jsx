import { useEffect, useRef, useState } from 'react';
import adminStyles from '../Admin.style';
import useStyles from './Teachers.style';
import modalStyles from '../../Modal.style';
import Table from '../../table/Table';
import ButtonSM from '../../forms/ButtonSM';
import closeIcon from '../../../../assets/icons/cancel.svg';
import Axios from "axios";
import Search from '../../forms/Search';
import reportIcon from '../../../../assets/icons/reports.svg';
import logo from '../../../../assets/images/logoSMpdf.png';
import poppins from '../../../../assets/fonts/Poppins-Regular.ttf';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { jsPDF } from 'jspdf';


const TeacherEvaluation = () => {
    const classes = useStyles();
    const adminClasses = adminStyles();
    const modalClasses = modalStyles();
    const [isOpenDetail, setIsOpenDetail] = useState();
    const columns = ['N°', 'Paterno', 'Materno', 'Nombre', 'Correo', 'Teléfono', 'Acción'];
    const [data,setData] = useState([]);
    const [fullName, setFullName] = useState('');
    const [dataEvaluation,setDataEvaluation] = useState([]);
    const [searchTerm, setSearchTerm] = useState(``);

    const months= [
        'Enero', 'Febrero', 'Marzo', 
        'Abril', 'Mayo', 'Junio', 
        'Julio', 'Agosto', 'Septiembre', 
        'Octubre', 'Noviembre', 'Diciembre'];

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

    const columnsModal = ['N°','Materia','Gestion', 'Asp. 1', 'Asp. 2', 'Asp. 3', 'Asp. 4', 'Evaluaciones', 'Puntaje'];

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
        doc.text('Reporte de evaluacion', 78, 45);
        doc.setFontSize(14);
        doc.setTextColor(39, 103, 158);
        doc.text(`Docente: ${fullName}`,20,55);
        doc.text(`Gestion: ${searchTerm===''?'Todos':`${searchTerm}`}`,20,60);

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
                        <div className={classes.options}>
                            <Search label={"Buscar gestion"} text={"Buscar"} onSearch={setSearchTerm} type={'month'} value={searchTerm}/>
                            <div>
                                <ButtonSM icon={reportIcon} text={"Generar reporte"} className={classes.iconButton} onClick={()=>{handleGenerateReport()}} />
                            </div>
                        </div>
                        <div className={classes.containerTableDetail}>
                            <Table 
                                columns={columnsModal} 
                                data={dataEvaluation.filter((item) => {
                                    const date = `${months[Number(searchTerm.slice(5,7)) - 1]} / ${searchTerm.slice(0,4)}`;
                                    if(searchTerm==='')
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
                    <p></p>
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