import { useEffect, useState } from 'react';
import { useRef } from 'react';
import secretariesStyles from '../Secretaries.style'
import useStyles from './Payments.style';
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


const Payments = () => {
    const secretariesClasses = secretariesStyles();
    const classes = useStyles();
    const columns = ['N°', 'Nombre Completo', 'Matricula', 'Materia' ,'Gestion', 'Fecha', 'Monto', 'Estado'];
    

    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const months= [
        'Enero', 'Febrero', 'Marzo', 
        'Abril', 'Mayo', 'Junio', 
        'Julio', 'Agosto', 'Septiembre', 
        'Octubre', 'Noviembre', 'Diciembre'];

    const loadData = () => {
        Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/payments`).then(response=>{
            setData(response.data);
        }).catch(error=>{
            console.log(error);
        })
    }

    useEffect(loadData,[]);

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
        doc.text('Reporte de Pagos', 78, 45);

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
                <p className={secretariesClasses.text}>PAGOS</p>
                <hr className={secretariesClasses.lineTitle} />
            </div>
            
            <div className={classes.searchUsers}>
                <Search label={"Buscar gestion"} text={"Buscar"} onSearch={setSearchTerm} type={'month'} />
            </div>
            <div className={classes.tablePayments}>
                <Table 
                    columns={columns} 
                    data={data.map((item,index)=>[
                        index + 1,
                        item.fullName,
                        item.idStudent,
                        item.subject,
                        item.month,
                        item.datePay.slice(0,10),
                        item.amount,
                        item.statePay
                    ]).filter((item) => {
                        const date = `${months[Number(searchTerm.slice(5,7)) - 1]} / ${searchTerm.slice(0,4)}`;
                        if(searchTerm==='')
                            return true
                        else
                            return item[4] === date
                    }
                        )
                    } 
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

export default Payments;