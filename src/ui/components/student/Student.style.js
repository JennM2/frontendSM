import { makeStyles } from "@mui/styles";
const useStyles = makeStyles ((theme) => ({

    content: {
        width: "82.9vw",
        right: "0px",
        bottom: "0px",

    },
    titleNotification: {
        margin: "0vw 0vw 3vw 0vw",
    },
    labelType: {
        marginBottom: "0.5vw",
        fontFamily: "Poppins-Regular",
        fontSize: "1.5vw",
    },
    buttonCancel: {
        width: "14%",
        height: "2.5vw",
        backgroundColor: theme.palette.primary.dark + "60",
        color: theme.palette.primary.main,
        fontFamily: "Poppins-Regular",
        fontSize: "1.1vw",
        border: "none",
        borderRadius: "1vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "2vw",
        cursor: "pointer",
    },
    iconButton: {
        paddingLeft: "1vw",
        width: "2.5vw",
        height: "2.5vw",
        cursor: "pointer",
    },
    buttons: {
        display: "flex",
        width: "100%",
        alignItems: "flex-end",
        justifyContent: "center",
        height: "5vw",
    },
    textAreaMessage: {
        borderRadius: "1vw",
        padding: "1vw 0vw 0vw 1vw",
        height: "10vw",
    },
    messageNotification: {
        width: "80%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    typeNotification: {
        width: "80%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        marginBottom: "1vw",
    },
    text: {
        fontFamily: "Poppins-Bold",
        fontSize: "2.7vw",
        margin: "0vh 0vw 0vh 7vw",
        color: theme.palette.primary.light
    },
    lineTitle: {
        width: "78vw",
        height: "0.5vh",
        borderColor: theme.palette.primary.light + "10",
        backgroundColor: theme.palette.primary.light + "10",
    },

    menu: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: `radial-gradient(circle at 0% 5%, ${theme.palette.primary.light}  , ${theme.palette.primary.contrastText} )`,
        width: "17vw",
        height: "85vh",
        position: 'sticky',
        top:'15vh',
        borderRadius: " 0vh 4vw 0vh 0vw",

    },
    line: {
        width: "90%",
        borderColor: theme.palette.primary.light + "90",
        height: "3px",
        backgroundColor: theme.palette.primary.light + "90",

    },
    top: {
        display: "flex",
        height:'15vh',
        justifyContent: "space-between",
        position:'sticky',
        top:0,
        background:'white',
        zIndex:1
    },
    second:{
        display:'flex'
    },
    notification: {
        position: "absolute",
        top: "1vw",
        right: "15vw",
    }
}));
export default useStyles;

