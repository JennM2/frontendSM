import Axios from "axios";
import { useEffect, useRef, useState } from "react";
import useStyles from "./PaymentHistory.style";
import studentsStyles from "../Student.style";
import Table from "../../table/Table";
import Button from "../../forms/ButtonSM";
import reportHistory from "../../../../assets/icons/reports.svg";
import logo from '../../../../assets/images/logoSMpdf.png';
import poppins from '../../../../assets/fonts/Poppins-Regular.ttf';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { jsPDF } from 'jspdf';

const PaymentHitory = () => {

  const token = JSON.parse(localStorage.getItem('credentialSM'));

  const classes = useStyles();
  const studentClasses = studentsStyles();

  const columns = ["Materia", "Gestion", "Fecha de pago", "Estado de pago"];
  const [data, setData] = useState([]);

  const loadData = () => {
    Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/payments/${token.idStudent}`).then((response)=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error)
    })
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
      doc.text('Historial de pagos', 78, 45);
      doc.setFontSize(14);
      doc.setTextColor(39, 103, 158);
      doc.text(`Estudiante: ${token.fullName}`,20,55);
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
        <p className={studentClasses.text}>HISTORIAL DE PAGOS</p>
        <hr className={studentClasses.lineTitle} />
      </div>
      <div className={classes.tableHistory}>
        <Table 
          columns={columns} 
          data={data.map(item=>[item.subject, item.month, item.datePay.slice(0,10), item.statePay])} 
          tableRef={tableRef}
        />
      </div>
      <div className={classes.buttonsHistory}>
        <Button
          icon={reportHistory}
          text={"Generar Historial"}
          className={classes.iconButton}
          onClick={handleGenerateReport}
        />
      </div>
    </div>
  );
};

export default PaymentHitory;
