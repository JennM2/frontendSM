import { useState, useEffect } from "react";
import Axios from "axios";

import useStyles from "./Users.style";
import modalStyles from "../../Modal.style";
import adminStyles from "../Admin.style";
import Table from "../../table/Table";
import Search from "../../forms/Search";
import ButtonSM from "../../forms/ButtonSM";
import deletIconW from "../../../../assets/icons/deleteW.svg";
import alertIcon from "../../../../assets/images/alert.svg";
import cancelIcon from "../../../../assets/icons/cancel.svg";
import editIconW from "../../../../assets/icons/editLight.svg";
import editStudent from "../../../../assets/icons/edit.svg";
import DynamicInputsDisabled from "../../forms/DynamicInputsDisabled";
import CredentialsDisabledUser from "../../forms/CredentialsDisabledUser";
import { enqueueSnackbar } from "notistack";

const Users = () => {
  const classes = useStyles();
  const adminClasses = adminStyles();
  const modalClasses = modalStyles();

  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialog, setIsDeleteDilog] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const [data, setData] = useState([]);

  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const options = [
    { label: "deshabilitado", value: "deshabilitado" },
    { label: "habilitado", value: "habilitado" },
  ];

  const loadData = () => {
    Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/users`)
      .then((res) => {
        const dataArray = res.data.map((user) => [
          user.idUser,
          user.user,
          user.rol,
          user.stateUser,
          user.paterno,
          user.materno,
          user.names,
          user.ci,
          user.phone,
          user.password,
        ]);
        setData(dataArray);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(loadData, []);

  const columns = [
    "ID",
    "Usuario",
    "Rol",
    "Estado",
    "Paterno",
    "Materno",
    "Nombre",
    "CI",
    "Teléfono",
    "Acción",
  ];

  const handleDeleteModal = (id) => {
    setIsDeleteDilog(!isDeleteDialog);
    setIdDelete(id);
  };

  const handleInputChangeEdit = (id, newValue) => {
    const updatedRow = { ...editingRow, [id]: newValue };
    setEditingRow(updatedRow);
  };

  const handleFinalDeletion = () => {
    setData(data.filter((row) => row[0] !== idDelete));
    setIsDeleteDilog(!isDeleteDialog);
  };

  const handleEditClick = (rowId) => {
    const row = data[rowId];
    const editingRow = {
      idUser: row[0],
      nameUser: row[1],
      rol: row[2],
      stateUser: row[3],
      surnamePUser: row[4],
      surnameMUser: row[5],
      namesUser: row[6],
      ciUser: row[7],
      phoneUser: row[8],
    };
    setIsModalEditOpen(true);
    setEditingRow(editingRow);
  };

  const handleEditSave = () => {
    if (editingRow) {
      // Enviar solicitud PUT para actualizar el estado del usuario
      Axios.put(`${process.env.REACT_APP_SERVER_HOST}/api/users/user/${editingRow.idUser}`, {
        stateUser: editingRow.stateUser,
      })
        .then(() => {
          loadData();
          setIsModalEditOpen(false);
          setEditingRow(null);
          enqueueSnackbar('Editado',{variant:'success'});
        })
        .catch((error) => {
          console.error("Error al actualizar el estado del usuario:", error);
        });
    }
  };

  const handleOpenModalEdit = () => {
    setIsModalEditOpen(!isModalEditOpen);
  };

  const fieldsC1 = [
    {
      label: "Apellido Paterno",
      type: "text",
      id: "surnamePUser",
    },
    { label: "Nombre", type: "text", id: "namesUser" },
    { label: "Teléfono", type: "text", id: "phoneUser" },
  ];
  const fieldsC2 = [
    {
      label: "Apellido Materno",
      type: "text",
      id: "surnameMUser",
    },
    { label: "CI", type: "text", id: "ciUser" },
    {
      label: "Rol Usuario",
      type: "text",
      id: "rol",
    },
  ];

  if (isModalEditOpen) {
    return (
      <div className={modalClasses.total}>
        <div className={modalClasses.under}></div>        <div className={modalClasses.container}>
          <div className={modalClasses.content}>
            <div className={classes.modalTop}>
              <p className={classes.titlemodalList}>
                EDITAR ESTADO DEL USUARIO
              </p>
              <div className={classes.enrollment}>
                <label className={classes.labelStudent} htmlFor="idUser">
                  ID:
                </label>
                <input
                  disabled
                  className={classes.inputEnrollment}
                  type="text"
                  id="idUser"
                  onChange={(e) =>
                    handleInputChangeEdit("idUser", e.target.value)
                  }
                  value={editingRow && editingRow["idUser"]}
                />
              </div>
            </div>
            <div className={classes.inputsModal}>
              <DynamicInputsDisabled
                fieldsf={fieldsC1}
                className={modalClasses.inputs}
                onChange={handleInputChangeEdit}
                values={editingRow}
              />
              <DynamicInputsDisabled
                fieldsf={fieldsC2}
                className={modalClasses.inputs}
                onChange={handleInputChangeEdit}
                values={editingRow}
              />
            </div>
            <div className={classes.modalBottom}>
              <div className={classes.credentials}>
                <CredentialsDisabledUser
                  nameUser={editingRow && editingRow["nameUser"]}
                />
              </div>
              <div className={classes.container}>
                <div className={classes.selectContainer}>
                  <label
                    className={classes.labelSelect}
                    htmlFor="careerStudent"
                  >
                    Estado del Usuario:
                  </label>
                  <select
                    className={classes.select}
                    id="careerStudent"
                    name="careerStudent"
                    value={editingRow && editingRow["stateUser"]}
                    onChange={(e) =>
                      handleInputChangeEdit("stateUser", e.target.value)
                    }
                  >
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={classes.buttonsModal}>
                  <div className={classes.buttonStudents}>
                    <ButtonSM
                      icon={editIconW}
                      text="Guardar"
                      className={modalClasses.icons}
                      onClick={handleEditSave}
                    />
                  </div>
                  <div className={classes.buttonStudents}>
                    <ButtonSM
                      icon={cancelIcon}
                      text="Cancelar"
                      className={modalClasses.icons}
                      onClick={handleOpenModalEdit}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (isDeleteDialog) {
    return (
      <div className={modalClasses.total}>
        <div className={modalClasses.under}></div>        <div className={modalClasses.containerDialog}>
          <div className={modalClasses.alert}>
            <img
              className={modalClasses.iconAlert}
              src={alertIcon}
              alt="alertDelete"
            />
          </div>
          <p className={modalClasses.cuestionAlert}>
            ¿Está seguro de que desea inhabilitar al usuario <br /> {idDelete}?
          </p>
          <div className={modalClasses.containerButtons}>
            <div className={modalClasses.buttonAction}>
              <ButtonSM
                icon={cancelIcon}
                text="Cancelar"
                className2={modalClasses.buttonCancel}
                onClick={handleDeleteModal}
              />
            </div>
            <div className={modalClasses.buttonAction}>
              <ButtonSM
                icon={deletIconW}
                text="Eliminar"
                className2={modalClasses.buttonDelete}
                onClick={handleFinalDeletion}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={adminClasses.content}>
        <div className={classes.title}>
          <p className={adminClasses.text}>USUARIOS</p>
          <hr className={adminClasses.lineTitle} />
        </div>
        <div className={classes.contentUsers}>
          <div className={classes.searchUsers}>
            <Search text={"Buscar"} onSearch={setSearchTerm} />
          </div>
          <div className={classes.tableUsers}>
            <Table
              columns={columns}
              data={data.filter((row) =>
                Object.values(row).some(
                  (val) =>
                    typeof val === "string" &&
                    val.toLowerCase().includes(searchTerm.toLowerCase())
                )
              )}
              columnIcon={"Acción"}
              icon={editStudent}
              onEdit={handleEditClick}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default Users;
