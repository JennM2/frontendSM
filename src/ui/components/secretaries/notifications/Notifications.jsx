import Axios from 'axios';
import { useEffect, useState } from 'react';
import secretariesStyles from '../Secretaries.style';
import modalStyles from '../../Modal.style';
import useStyles from './Notifications.style';
import Button from '../../forms/ButtonSM';
import Table from '../../table/Table';

import notificationsAddIcon from '../../../../assets/icons/newNotification.svg';
import cleanIcon from '../../../../assets/icons/clean.svg';
import cancelIcon from '../../../../assets/icons/cancel.svg';
import sendIcon from '../../../../assets/icons/send.svg';
import { enqueueSnackbar } from 'notistack';


const Notifications = () => {
    const secretariesClasses = secretariesStyles();
    const classes = useStyles();
    const modalClasses = modalStyles();
    const [openModalNewNotification, setOpenModalNotification] = useState(false);
    const [typeNotification, setTypeNotification] = useState('');
    const [messageNotification, setMessageNotification] = useState('');
    const [data, setData] = useState([]);
    const [dataType, setDataType] = useState([]);


    const columns = ['N°', 'Tipo', 'Mensaje', 'Fecha'];

    const loadData = () => {
        Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/notification`).then(response=>{
            const data = response.data.map((item, index)=>[
                index + 1,
                item.notification,
                item.message,
                item.dateNot.slice(0,10)
            ])
            setData(data);
        }).catch(error=>{
            console.log(error);
        })
        Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/notification/type`).then(response=>{
            setDataType(response.data);
        }).catch(error=>{
            console.log(error);
        })
    }
    useEffect(loadData,[])

    const handleOpenModalNotification = () => {
        handleStates();
        setOpenModalNotification(!openModalNewNotification);
    };
    const handleStates = () => {
        setTypeNotification('');
        setMessageNotification('');
    };

    const handleSend = () => {
        const currentDate = new Date().toISOString().slice(0, 10);
        const newMessage = {
            type: typeNotification,
            message : messageNotification,
            dateNot: currentDate
        }
        Axios.post(`${process.env.REACT_APP_SERVER_HOST}/api/notification`, newMessage).then(response=>{
            enqueueSnackbar('Creado',{variant:'success'});
            loadData();
            setOpenModalNotification(false);
            handleStates();
        }).catch(error=>{
            enqueueSnackbar(error.response.data.message,{variant:'warning'});
        })
    }
    const handleClean = () => {
        const lastRow = data[data.length - 1];
        lastRow[0] = '1';
        setData([lastRow]);
    }

    if (openModalNewNotification) {
        return (
            <div className={modalClasses.total}>
                <div className={modalClasses.under}></div>
                <div className={modalClasses.container}>
                    <div className={modalClasses.content}>
                        <p className={classes.titleNotification}>CREAR NOTIFICACIÓN</p>
                        <div className={classes.typeNotification}>
                            <label className={classes.labelType} htmlFor="type">Tipo:</label>
                            <select 
                                className={classes.selectType} 
                                id="type" 
                                name="type" 
                                value={typeNotification} 
                                onChange={(e) => setTypeNotification(e.target.value)
                                }>
                                <option value="">Seleccione el tipo</option>
                                {dataType.map((option) => (
                                    <option key={option.idTypNot} value={option.idTypNot}>
                                        {option.notification}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={classes.messageNotification}>
                            <label className={classes.labelType} htmlFor="message">Mensaje:</label>
                            <textarea className={classes.textAreaMessage} rows="7" cols="50" placeholder='Escribe aquí el mensaje'
                                id="message" name="message" value={messageNotification} onChange={(e) => setMessageNotification(e.target.value)}
                            ></textarea>
                        </div>
                        <div className={classes.buttons}>
                            <Button icon={sendIcon} text={"Enviar"} className={classes.iconButton} className2={classes.buttonSend} onClick={handleSend} />
                            <Button icon={cancelIcon} text={"Cancelar"} className={classes.iconButton} className2={classes.buttonCancel} onClick={handleOpenModalNotification} />
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={secretariesClasses.content} >
                <div>
                    <p className={secretariesClasses.text}>NOTIFICACIONES</p>
                    <hr className={secretariesClasses.lineTitle} />
                </div>
                <div className={classes.buttonNotification}>
                    <div className={classes.buttonNewNotification}><Button icon={notificationsAddIcon} text={"Crear notificaición"} className={classes.iconButton} onClick={handleOpenModalNotification} /></div>
                </div>
                <div className={classes.tableNotifications}>
                    <Table columns={columns} data={data} />
                </div>
                <div className={classes.buttonNotification}>
                    <div className={classes.buttonClean}><Button icon={cleanIcon} text={"Limpiar"} className={classes.iconButton} onClick={handleClean} /></div>
                </div>



            </div>
        );
    };
};
export default Notifications;