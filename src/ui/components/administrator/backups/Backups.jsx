import { useEffect, useState } from 'react';
import adminStyles from '../Admin.style';
import useStyles from './Backups.style';
import backups from '../../../../assets/icons/backupMenu.svg';
import ButtonSM from '../../forms/ButtonSM';
import Table from '../../table/Table';
import Axios from "axios";
import { enqueueSnackbar } from 'notistack';



const Backups = () => {

    const adminClasses = adminStyles();
    const classes = useStyles();
    const [monthlyChecked, setMonthlyChecked] = useState(true);
    const [valueRule, setValueRule] = useState('');
    const [data, setData] = useState([]);


    const columns = ['ID', 'Nombre', 'Fecha', 'Tamaño'];
    
    const handleChangeCheck = () => {
        setMonthlyChecked(!monthlyChecked);
        setValueRule('');
    }

    const handleSaveChange = () => {
        Axios.post(`${process.env.REACT_APP_SERVER_HOST}/api/admin/taskBackup`,{monthly:monthlyChecked, value:valueRule}).then(()=>{
            enqueueSnackbar('Reprogramado',{variant:'success'})
        }).catch(err=>{
            console.log(err);
            enqueueSnackbar(err.response.data.message,{variant:'success'});
        })
    }

    const handleGenerateBackup = () => {
        enqueueSnackbar('Generando copia porfavor espere');
        Axios.post(`${process.env.REACT_APP_SERVER_HOST}/api/admin/generateBackups`,{}).then(response=>{
            enqueueSnackbar('Generado',{variant:'success'})
        }).catch(err=>{
            enqueueSnackbar(err.response.data.message,{variant:'success'})

        })
    }

    const loadData = () => {
        Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/admin/allBackup`).then(response => {
            setData(response.data);
        }).catch(err=>{
            console.log(err);
        })

        Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/admin/configBack`).then(response => {
            console.log(response.data)
            setMonthlyChecked(response.data.monthly);
            setValueRule(response.data.value);
        }).catch(err=>{
            console.log(err);
        })
    }

    useEffect(loadData,[]);

    const days = []
    for (let index = 1; index <= 30; index++) {
        days.push(index);
    }
    const dayOfWeek = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

    return(
        <div className={adminClasses.content} >
            <div className={classes.title}>
                <p className={adminClasses.text}>COPIAS DE SEGURIDAD</p>
                <hr className={adminClasses.lineTitle} />
            </div>
            <div className={classes.containerProgram}>
                <div className={classes.contentProgram}>
                    <div className={classes.programTime}>
                        <p className={classes.subtitle} >Programar Backup</p>
                        <div className={classes.program}>
                            <div className={classes.check}>
                                <input type="radio" id="monthly" name="monthly" value="monthly" checked={monthlyChecked} onChange={handleChangeCheck}/>
                                <label className={classes.labelCheck} for="monthly">Mensual</label>
                            </div>
                            <div className={classes.check}>
                                <input type="radio" id="monthly" name="monthly" value="monthly" checked={!monthlyChecked} onChange={handleChangeCheck}/>
                                <label className={classes.labelCheck} for="weekly">Semanal</label>
                            </div>
                        </div>
                        <div className={classes.selectArea}>
                            {monthlyChecked?
                            <select
                                value={valueRule}
                                onChange={(e)=>{setValueRule(e.target.value)}}
                                className={classes.selectMonth}
                            >
                                <option>Seleccione el dia</option>
                                {days.map((item, index)=>{
                                    return <option value={item} key={index}>{item}</option>
                                })}
                            </select>
                            :
                            <select
                                value={valueRule}
                                onChange={(e)=>{setValueRule(e.target.value)}}
                                className={classes.selectWeek}
                            >
                                <option>Seleccione el dia</option>
                                {dayOfWeek.map((item, index)=>{
                                    return <option value={item} key={index}>{item}</option>
                                })}
                            </select>}
                        </div>
                        <div className={classes.buttonSave}>
                            <ButtonSM text={"Programar"} className={classes.iconProgram} onClick={handleSaveChange}/>
                        </div>
                    </div>
                    <div className={classes.buttonProgram}>
                        <ButtonSM icon={backups} text={"Generar Backup"} className={classes.iconProgram} onClick={()=>{handleGenerateBackup()}}/>
                    </div>
                </div>
                <hr className={adminClasses.lineTitle} />
                <div className={classes.recentsBackup}>
                    <p className={classes.subtitle}>Backup Recientes</p>
                    <div className={classes.tableContent}>
                        <Table 
                            columns={columns} 
                            data={data.map((item, index)=>[
                                index + 1,
                                item.name,
                                item.createAt.slice(0,10) + ' : ' + item.createAt.slice(11,19),
                                item.size + 'bytes'
                            ])} 
                            className={classes.tableBackups} 
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Backups;