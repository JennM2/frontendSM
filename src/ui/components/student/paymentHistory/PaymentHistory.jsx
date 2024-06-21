import Axios from "axios";
import { useEffect, useState } from "react";
import useStyles from "./PaymentHistory.style";
import studentsStyles from "../Student.style";
import Table from "../../table/Table";
import Button from "../../forms/ButtonSM";
import reportHistory from "../../../../assets/icons/reports.svg";

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
        />
      </div>
      <div className={classes.buttonsHistory}>
        <Button
          icon={reportHistory}
          text={"Generar Historial"}
          className={classes.iconButton}
        />
      </div>
    </div>
  );
};

export default PaymentHitory;
