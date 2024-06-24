import React from "react";
import useStyles from "./Table.style";

const ActionColumn = ({ icon, icon2, icon3, onDelete, onEdit, id, idEdit, onAdd, classNameIcon, idSpecific }) => {
  const classes = useStyles();
  return (
    <>
      {icon && <img className={classNameIcon || classes.iconAccion} src={icon} alt=" " onClick={() => onEdit(idEdit,idSpecific)} />}
      {icon2 && <img className={classNameIcon || classes.iconAccion} src={icon2} alt=" " onClick={() => onDelete(id,idSpecific)} />}
      {icon3 && <img className={classNameIcon || classes.iconAccion} src={icon3} alt=" " onClick={() => onAdd(idEdit,idSpecific, id)} />}
    </>
  );
};

export default ActionColumn;
