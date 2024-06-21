import { useState, useEffect } from "react";
import Axios from "axios";

import useStyles from "./Secretaries.style";
import modalStyles from "../../Modal.style";
import adminStyles from "../Admin.style";
import Table from "../../table/Table";
import DynamicInputs from "../../forms/DynamicInputs";
import ButtonSM from "../../forms/ButtonSM";
import Credentials from "../../forms/Credentials";
import newSecretary from "../../../../assets/icons/newUser.svg";
import deleteIcon from "../../../../assets/icons/delete.svg";
import saveIcon from "../../../../assets/icons/save.svg";
import cancelIcon from "../../../../assets/icons/cancel.svg";
import alertIcon from "../../../../assets/images/alert.svg";
import deletIconW from "../../../../assets/icons/deleteW.svg";
import editIcon from "../../../../assets/icons/edit.svg";
import editIconW from "../../../../assets/icons/editLight.svg";
import { enqueueSnackbar } from "notistack";

const Secretaries = () => {
  const classes = useStyles();
  const adminClasses = adminStyles();
  const modalClasses = modalStyles();
  const [isClick, setIsClick] = useState(false);
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editedId, setEditedId] = useState("");
  const [idSpecific, setIdSpecific] = useState("");

  const [surnamePaternalSecretary, setSurnamePaternalSecretary] = useState("");
  const [surnameMaternalSecretary, setSurnameMaternalSecretary] = useState("");
  const [nameSecretary, setNameSecretary] = useState("");
  const [emailSecretary, setEmailSecretary] = useState("");
  const [ciSecretary, setCiSecreatry] = useState("");
  const [phoneSecretary, setPhoneSecretary] = useState("");
  const [userSecretary, setUserSecretary] = useState("");
  const [passwordSecretary, setPasswordSecretary] = useState("");
  const [data, setData] = useState([]);
  const [fullNameToDelete, setFullNameToDelete] = useState("");

  //obtener todos los datos de los secretarios

  const loadData = () => {
    Axios.get(`${process.env.REACT_APP_SERVER_HOST}/api/secretaries`)
      .then((res) => {
        const dataArray = res.data.map((secretary,index) => [
          index + 1,
          secretary.user,
          secretary.paterno,
          secretary.materno,
          secretary.names,
          secretary.ci,
          secretary.email,
          secretary.phone,
          secretary.stateUser,
          secretary.idSecretary,
        ]);
        setData(dataArray);

      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(loadData, []);

  const handleNewClick = () => {
    setIsClick(!isClick);
  };

  const handleInputChange = (id, newValue) => {
    switch (id) {
      case "surnamePaternalSecretary":
        setSurnamePaternalSecretary(newValue);
        break;
      case "surnameMaternalSecretary":
        setSurnameMaternalSecretary(newValue);
        break;
      case "nameSecretary":
        setNameSecretary(newValue);
        break;
      case "emailSecretary":
        setEmailSecretary(newValue);
        break;
      case "ciSecretary":
        setCiSecreatry(newValue);
        break;
      case "phoneSecretary":
        setPhoneSecretary(newValue);
        break;
      default:
        break;
    }
  };
  const handleInputChangeEdit = (id, newValue) => {
    const updatedRow = { ...editingRow, [id]: newValue };
    setEditingRow(updatedRow);
  };

  //nuevo Secretario
  const handleSave = () => {
    const newRow = {
      user: userSecretary,
      password: passwordSecretary,
      paterno: surnamePaternalSecretary,
      materno: surnameMaternalSecretary,
      names: nameSecretary,
      ci: ciSecretary,
      email: emailSecretary,
      phone: phoneSecretary,
    };

    Axios.post(`${process.env.REACT_APP_SERVER_HOST}/api/secretaries`, newRow)
      .then((res) => {
        loadData();
        enqueueSnackbar('Creado',{variant:'success'});
        setIsClick(false);
      })
      .catch((error) => {
        enqueueSnackbar(error.response.data.message,{variant:'warning'});
      });
  };

  const handleDeleteModal = (id,idSpecific) => {

    setIsDeleteDialog(!isDeleteDialog);
    setIdSpecific(idSpecific);
    setFullNameToDelete(id);
  };

  const handleFinalDeletion = () => {
    Axios.delete(`${process.env.REACT_APP_SERVER_HOST}/api/secretaries/disable/${idSpecific}`)
      .then(() => {
        // Si la eliminación fue exitosa, actualiza el estado local eliminando el secretario de la lista
        enqueueSnackbar('inhabilitado',{variant:'success'})
        loadData();
        setIsDeleteDialog(!isDeleteDialog);
      })
      .catch((error) => {
        // Manejar cualquier error que ocurra durante la eliminación
        console.error("Error al eliminar secretario:", error);
      });
  };

  const handleOpenModalEdit = () => {
    setIsModalEditOpen(!isModalEditOpen);
  };

  //obtener los datos actuales del secretario
  const handleEditClick = (rowId) => {
    const row = data[rowId];
    const newRow = {
      userSecretary: row[1],
      surnamePaternalSecretary: row[2],
      surnameMaternalSecretary: row[3],
      nameSecretary: row[4],
      ciSecretary: row[5],
      emailSecretary: row[6],
      phoneSecretary: row[7],
      stateUser:row[8],
    };
    setUserSecretary(row[1]);
    setIsModalEditOpen(true);
    setEditingRow(newRow);
    setEditedId(row[9]);
  };

  //actulizar los datos
  const handleEditSave = () => {
    if (editingRow) {
      const editedRowData = {
        user: editingRow.userSecretary || "",
        paterno: editingRow.surnamePaternalSecretary || "",
        materno: editingRow.surnameMaternalSecretary || "",
        names: editingRow.nameSecretary || "",
        ci: editingRow.ciSecretary || "",
        email: editingRow.emailSecretary || "",
        phone: editingRow.phoneSecretary || "",
        password: passwordSecretary || "",
        stateUser: editingRow.stateUser || ""
      };
      Axios.put(
        `${process.env.REACT_APP_SERVER_HOST}/api/secretaries/${editedId}`,
        editedRowData
      )
        .then((res) => {
          loadData();
          enqueueSnackbar('Editado',{variant:'success'})
          setIsModalEditOpen(false);
          setEditingRow(null);
        })
        .catch((error) => {
          enqueueSnackbar(error.response.data.message,{variant:'warning'});
        });
    }
  };

  const columns = [
    "ID",
    "Usuario",
    "Paterno",
    "Materno",
    "Nombre",
    "CI",
    "Correo",
    "Teléfono",
    "Estado",
    "Acción",
  ];

  const fieldsC1 = [
    {
      label: "Apellido Paterno",
      placeholder: "",
      type: "text",
      id: "surnamePaternalSecretary",
    },
    { label: "Nombre", placeholder: "", type: "", id: "nameSecretary" },
    {
      label: "Correo electrónico",
      placeholder: "correo@gmail.com",
      type: "email",
      id: "emailSecretary",
    },
    {
      label: "Estado",
      placeholder: "",
      type: "select",
      id: "stateUser",
      options:['habilitado','deshabilitado']
    }
  ];
  const fieldsC1New = [
    {
      label: "Apellido Paterno",
      placeholder: "",
      type: "text",
      id: "surnamePaternalSecretary",
    },
    { label: "Nombre", placeholder: "", type: "", id: "nameSecretary" },
    {
      label: "Correo electrónico",
      placeholder: "correo@gmail.com",
      type: "email",
      id: "emailSecretary",
    }
  ];
  const fieldsC2 = [
    {
      label: "Apellido Materno",
      placeholder: "",
      type: "text",
      id: "surnameMaternalSecretary",
    },
    { label: "CI", placeholder: "", type: "text", id: "ciSecretary" },
    { label: "Teléfono", placeholder: "", type: "text", id: "phoneSecretary" },
  ];

  if (isClick) {
    return (
      <div className={modalClasses.total}>
        <div className={modalClasses.under}></div>
        <div className={modalClasses.container}>
          <div className={modalClasses.content}>
            <p>NUEVO SECRETARIO</p>
            <div className={modalClasses.containerInputs}>
              <DynamicInputs
                fields={fieldsC1New}
                className={modalClasses.inputs}
                onChange={handleInputChange}
              />
              <DynamicInputs
                fields={fieldsC2}
                className={modalClasses.inputs}
                onChange={handleInputChange}
              />
            </div>
            <div className={modalClasses.contentButtons}>
              <Credentials
                onUserChange={setUserSecretary}
                onPasswordChange={setPasswordSecretary}
              />
              <div className={classes.buttonSecretary}>
                <div className={classes.buttonS}>
                  <ButtonSM
                    icon={saveIcon}
                    text="Guardar"
                    className={modalClasses.icons}
                    onClick={handleSave}
                  />
                </div>
                <div className={classes.buttonS}>
                  <ButtonSM
                    icon={cancelIcon}
                    text="Cancelar"
                    className={modalClasses.icons}
                    onClick={handleNewClick}
                  />
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
        <div className={modalClasses.under}></div>
        <div className={modalClasses.containerDialog}>
          <div className={modalClasses.alert}>
            <img
              className={modalClasses.iconAlert}
              src={alertIcon}
              alt="alertDelete"
            />
          </div>
          <p className={modalClasses.cuestionAlert}>
            ¿Está seguro de que desea inhabilitar a <br /> {fullNameToDelete}?
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
  } else if (isModalEditOpen) {
    return (
      <div className={modalClasses.total}>
        <div className={modalClasses.under}></div>
        <div className={modalClasses.container}>
          <div className={modalClasses.content}>
            <p>EDITAR SECRETARIO</p>
            <div className={modalClasses.containerInputs}>
              <DynamicInputs
                fields={fieldsC1}
                className={modalClasses.inputs}
                onChange={handleInputChangeEdit}
                values={editingRow}
              />
              <DynamicInputs
                fields={fieldsC2}
                className={modalClasses.inputs}
                onChange={handleInputChangeEdit}
                values={editingRow}
              />
            </div>
            <div className={modalClasses.contentButtons}>
              <Credentials
                nameUser={userSecretary}
                onUserChange={setUserSecretary}
                onPasswordChange={setPasswordSecretary}
              />
              <div className={classes.buttonSecretary}>
                <div className={classes.buttonS}>
                  <ButtonSM
                    icon={editIconW}
                    text="Actualizar"
                    className={modalClasses.icons}
                    onClick={handleEditSave}
                  />
                </div>
                <div className={classes.buttonS}>
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
    );
  } else {
    return (
      <div className={adminClasses.content}>
        <div className={classes.title}>
          <p className={adminClasses.text}>SECRETARIOS</p>
          <hr className={adminClasses.lineTitle} />
        </div>
        <div className={classes.contentSecretaries}>
          <div className={classes.buttonSecretaries} onClick={handleNewClick}>
            <ButtonSM
              icon={newSecretary}
              text="Nuevo"
              className={classes.iconSecretaries}
            />
          </div>
          <div className={classes.tableSecretaries}>
            <Table
              columns={columns}
              data={data}
              columnIcon={"Acción"}
              icon={editIcon}
              icon2={deleteIcon}
              onDelete={handleDeleteModal}
              start={2}
              end={5}
              onEdit={handleEditClick}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default Secretaries;
