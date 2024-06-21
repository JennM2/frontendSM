import useStyles from './NavMenu.style';


const User = ({userPerfil, nameUser, rol}) => {
    const classes = useStyles();

    return (
        <div className={classes.logo}>
            <div>
                <p className={classes.rol}>{rol}</p>
                <p >{nameUser}</p>
            </div>
            <img className={classes.photo} src={userPerfil} alt="user" />
        </div>
    );
};

export default User;