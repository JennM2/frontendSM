import { useEffect, useState } from 'react';
import { useRef } from 'react';
import secretariesStyles from '../../secretaries/Secretaries.style';
import Table from '../../table/Table';
import Button from '../../forms/ButtonSM';
import reportIcon from '../../../../assets/icons/reports.svg';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import logo from '../../../../assets/images/logoSMpdf.png';
import poppins from '../../../../assets/fonts/Poppins-Regular.ttf';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Axios from 'axios';
import Search from '../../forms/Search';
import useStyles from './report.style';


const Report = () => {

    const token = JSON.parse(localStorage.getItem('credentialSM'));

    const secretariesClasses = secretariesStyles();
    const classes = useStyles();
    const columns = [
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
    

    const [data, setData] = useState([]);
    const [dataSubject, setDataSubject] = useState([]);
    const [searchTermMonth, setSearchTermMonth] = useState("");
    const [searchTermSubject, setSearchTermSubject] = useState("");
    const [subjectName, setSubjectName] = useState("");

    const months= [
        'Enero', 'Febrero', 'Marzo', 
        'Abril', 'Mayo', 'Junio', 
        'Julio', 'Agosto', 'Septiembre', 
        'Octubre', 'Noviembre', 'Diciembre'];

    const loadStudents = () =>{


        if(searchTermSubject){
            setSubjectName(dataSubject.find(item=>item.idEnable === searchTermSubject).subject);

            console.log(searchTermSubject);
            Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/programming//allStudents/${searchTermSubject}`).then(response => {
                setData(response.data);
              }).catch (error=> {
                console.error("Error al obtener los datos:", error);
              })}
        }
    
    useEffect(loadStudents,[searchTermSubject, dataSubject])

    const loadDataSubjects = () => {
        if(searchTermMonth){
        Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/enable//byMonth/${searchTermMonth}/${token.idTeacher}`).then(response => {
            console.log(response);
            setDataSubject(response.data);
          }).catch (error=> {
            console.error("Error al obtener los datos:", error);
          })}
    }

    useEffect(loadDataSubjects,[searchTermMonth, token.idTeacher]);

    const tableRef = useRef(null);
    const currentDate = new Date();
    const formattedDate = format(currentDate, "MMMM dd, yyyy", { locale: es });

    const handleGenerateReport = () => {
        const month = `${months[searchTermMonth.slice(5,7) - 1]} / ${searchTermMonth.slice(0,4)}`;
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
        doc.text(`${subjectName} - ${month}`, 58, 45);

        if (tableRef.current) {

            doc.autoTable({
                html: tableRef.current,
                startY: 60,
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

    return (
        <div className={secretariesClasses.content} >
            <div>
                <p className={secretariesClasses.text}>REPORTE DE MATERIAS</p>
                <hr className={secretariesClasses.lineTitle} />
            </div>
            
            <div className={classes.searchUsers}>
                <Search label={"Buscar gestion"} text={"Buscar"} onSearch={setSearchTermMonth} type={'month'} />
                <Search 
                    label={"Buscar gestion"} 
                    text={"Buscar"} 
                    onSearch={setSearchTermSubject}
                    type={'select'} 
                    placeholder ={'seleccione la materia'}
                    options={[]}
                    values={dataSubject}
                />
            </div>
            <div className={classes.tablePayments}>
                <Table 
                    columns={columns} 
                    data={data.map((item,index)=>[
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
                    tableRef={tableRef} 
                    className={classes.tablePayments} 

                />
            </div>
            <div className={classes.buttonPayments}>
                <div className={classes.button}><Button icon={reportIcon} text={"Generar reporte"} className={classes.iconButton} onClick={handleGenerateReport} /></div>
            </div>

        </div>
    );
};

export default Report;