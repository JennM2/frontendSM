import { useEffect, useState } from 'react';
import useStyles from './Qualifications.style';
import studenStyles from '../Student.style';
import openArrow from '../../../../assets/icons/arrowD.svg';
import closeArrow from '../../../../assets/icons/arrowD0.svg';
import Table from '../../table/Table';
import Axios from "axios";

const Qualification = () => {

    const token = JSON.parse(localStorage.getItem('credentialSM'));

    const classes = useStyles();
    const studentClasses = studenStyles();

    const toogleTable = (index, value) => {
        let copy = [...toogles];
        copy[index] = !value;
        setToogles([...copy]);
      }

    const [dataQualified, setDataQualified] = useState([]);
    const [years, setYears] = useState([]);
    const [toogles, setToogles] = useState([]);


    const columnsQualified = ['N°', 'Materia', 'Gestion', 'P1', 'P2', 'P3', 'Prom. Parcial', 'Practicas', 'Examen Final', 'Nota Final'];
    

    const loadData = () => {
        Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/programming/notesByIdStudent/${token.idStudent}`).then((response) => {
            let dataYears = [];
            let dataToogles = [];
            response.data.years.forEach(element => {
                dataYears.push(element);
                dataToogles.push(false);
            });
            setYears(dataYears);
            setToogles(dataToogles);

            setDataQualified(response.data.data);
        }).catch((error) => {
            console.log(error);
        });
    }
    useEffect(loadData,[token.idStudent]);

    return (
        <>
            <div className={studentClasses.content} >
                <div className={classes.title}>
                    <p className={studentClasses.text}>NOTAS</p>
                    <hr className={studentClasses.lineTitle} />
                </div>
                <div className={classes.contentQualification}>
                {
                    years.map((item, index)=>{
                        return (
                        <div>
                            <div className={classes.sectionYear}>
                            <p className={classes.year}>{`${item} Año`}</p>
                            <button className={classes.buttonArrow} onClick={()=>{toogleTable(index, toogles[index])}}>
                                {toogles[index] ? (
                                <img
                                    className={classes.iconArrow}
                                    src={openArrow}
                                    alt="arrow"
                                />
                                ) : (
                                <img
                                    className={classes.iconArrow}
                                    src={closeArrow}
                                    alt="arrow"
                                />
                                )}
                            </button>
                            </div>
                            <hr className={classes.lineFirst} />
                            {toogles[index ] && (
                            <div className={classes.positionTable}>

                                <Table
                                columns={columnsQualified}
                                data={dataQualified[index].map((item, index)=>[
                                    index + 1,
                                    item.subject,
                                    item.month,
                                    item.parcialOne,
                                    item.parcialTwo,
                                    item.parcialThree,
                                    item.avgParcial,
                                    item.practices,
                                    item.exam,
                                    item.final
                                ])}
                                className2={classes.tableQualified}
                                />
                            </div>
                            )}
                        </div>
                        )
                    })
                    }
                </div>
            </div>
        </>
    );
};

export default Qualification;