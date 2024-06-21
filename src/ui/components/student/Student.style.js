import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({

    content: {
        width: "82.9vw",
        right: "0px",
        bottom: "0px",

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

