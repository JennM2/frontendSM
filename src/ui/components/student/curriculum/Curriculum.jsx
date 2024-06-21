import { useState, useEffect } from "react";
import Axios from "axios";

import useStyles from "./Curriculum.style";
import studenStyles from "../Student.style";
import openArrow from "../../../../assets/icons/arrowD.svg";
import closeArrow from "../../../../assets/icons/arrowD0.svg";
import Table from "../../table/Table";

const Curriculum = () => {

  const token = JSON.parse(localStorage.getItem('credentialSM'));

  const classes = useStyles();
  const studentClasses = studenStyles();

  const toogleTable = (index, value) => {
    let copy = [...toogles];
    copy[index] = !value;
    setToogles([...copy]);
  }

  const columnsQualified = ["N°", "Codigo", "Materia", "Año", "Pre-Requisito"];

  const [dataQualified, setDataQualified] = useState([]);
  const [years, setYears] = useState([]);
  const [toogles, setToogles] = useState([]);


  const loadData = () => {
    Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/careers/pensum/${token.idCareer}`).then(response=>{
      let dataYears = [];
      let dataToogles = [];
      response.data.years.forEach(element => {
        dataYears.push(element);
        dataToogles.push(false);
      });
      setYears(dataYears);
      setToogles(dataToogles);

      setDataQualified(response.data.data);

    }).catch(error=>{
      console.log(error);
    })
  }



  useEffect(loadData,[token.idCareer]);

 
  return (
    <div className={studentClasses.content}>
      <div className={classes.title}>
        <p className={studentClasses.text}>PLAN DE ESTUDIOS</p>
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
                        item.code,
                        item.subject,
                        item.year,
                        item.preSubject
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
  );
};

export default Curriculum;
