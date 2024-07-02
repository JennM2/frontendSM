import Axios from "axios";
import useStyle from "./history.style";
import studentStyle from "../Student.style";
import Table from "../../table/Table";
import { useEffect, useRef } from "react";
import { useState } from "react";
import scheduleIcon from "../../../../assets/icons/schedule.svg";
import ButtonSM from "../../forms/ButtonSM";
import reportIcon from '../../../../assets/icons/reports.svg';
import logo from '../../../../assets/images/logoSMpdf.png';
import poppins from '../../../../assets/fonts/Poppins-Regular.ttf';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { jsPDF } from 'jspdf';

const History = () => {

  const token = JSON.parse(localStorage.getItem('credentialSM'));


  const classes = useStyle();
  const studentClasses = studentStyle();

  const columns = ["N°", "Materia", "Gestion", "Nota Final"];
  const [data, setData] = useState([]);
  const [average, setAverage] = useState(0);

    const loadData = (id) => {
        Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/programming/notesHistoryByIdStudent/${token.idStudent}`).then((response) => {
        console.log(response)
        setData(response.data);
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



  useEffect(loadData,[token.idStudent])

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
        doc.text(`Estudiante: ${token.fullName}`,20,55);
        doc.text(`N° de programaciones: ${data.length}`,20,60);
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

    return (
      <div className={studentClasses.content}>
          <div className={classes.title}>
            <p className={studentClasses.text}>HISTORIAL ACADEMICO</p>
            <hr className={studentClasses.lineTitle} />
          </div>
          <div>
            <div className={classes.dataStudent}>
                <p className={classes.subtitle}>
                    {`Numero de Programaciones: ${data.length}`}
                    <br/>
                    {`Promedio Total: ${average}`}
                </p>
                <div className={classes.buttonStudents}>
                    <ButtonSM icon={reportIcon} text={"Generar reporte"} className={classes.iconButton} onClick={()=>{handleGenerateReport()}} />
                </div>
            </div>
            
            <div className={classes.tableSchedule}>
              <Table
                icon2={scheduleIcon}
                columns={columns}
                data={data.map((item ,index)=>[
                  index + 1,
                  item.subject,
                  item.month,
                  item.final
                ])}
                columnAction={"Accin"}
                columnIcon={"Acción"}
                textLink={"Programar"}
                start={1}
                end={5}
                tableRef={tableRef}
              />
            </div>
          </div>
        </div>
    )
  }

export default History;
