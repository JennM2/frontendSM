import { makeStyles } from "@mui/styles";
const useStyles = makeStyles ((theme) => ({
    total:{
        position:'absolute',
        top:'0px',
        left:'0px',
        zIndex:'999',
        display:'flex'
    },
    under: {
        position:'absolute',
        width: "100vw",
        height: "100vh",
        backgroundColor: `${theme.palette.primary.dark}99`,
        backdropFilter: "blur(5px)",
    },
    container: {
        position:'relative',
        top:'50vh',
        left:'50vw',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "80vw",
        height: "95vh",
        background: `radial-gradient(circle at 0% 50%, ${theme.palette.primary.light}, ${theme.palette.primary.contrastText})`,
        transform: "translate(-50%, -50%)",
        borderRadius: "0.5vw",
    },
    content: {
        width: "90%",
        height: "90%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: theme.palette.primary.dark + "12",
        color: theme.palette.primary.main,
        fontSize: "2.5vw",
        fontFamily: "Poppins-Semibold",
        paddingTop: "3vh",
        borderRadius: "1vw",
        overflowY:'auto',
        overflowX:'hidden',
    },

    containerInputs: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
    },
    inputs: {
        color: theme.palette.primary.main,
        fontSize: "1.1vw",
        width: "30vw",
        paddingLeft: "1vw",
        fontFamily: "Poppins-Regular",
    },

    contentButtons: {
        display: "flex",
        alignItems: "center",
        marginBottom: "12vh",
        height: "22vh",
        paddingLeft: "20vh",
    },
    icons: {
        paddingLeft: "0.5vw",
        width: "2vw",
        height: "2vw",
    },
    tableModal: {
        width: '65vw',
        margin: ' 2vh 0vw 12vh 0.3vw'
    },
    containerDialog: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "40vw",
        height: "25vw",
        background: theme.palette.primary.main,
        position: "absolute",
        top: "20vh",
        left: "30vw",
        borderRadius: "0.5vw",
        boxShadow: `0.7vw 1.5vh 0.3vw  ${theme.palette.primary.light}50`
    },
    alert: {
        width: "100%",
        height: "9vw",
        background: `radial-gradient(circle at 0% 50%, ${theme.palette.primary.light}, ${theme.palette.primary.contrastText})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    iconAlert: {
        width: "7vw",
        height: "7vw",
    },
    cuestionAlert: {
        width: "82%",
        textAlign: "center",
        fontFamily: "Poppins-Semibold",
        fontSize: "1.4vw",
    },
    containerButtons: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
    },
    buttonAction: {
        width: "30%",
        height: "3vw",
        marginTop: "1vw",
        cursor: "pointer",
    },
    buttonCancel: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.contrastText + "80",
        fontSize: "1.1vw",
        borderRadius: "1vw",
        border: "none",
        cursor: "pointer",


    },
    buttonDelete: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.contrastText,
        fontSize: "1.1vw",
        borderRadius: "1vw",
        border: "none",
        cursor: "pointer",


    },

}));

export default useStyles;