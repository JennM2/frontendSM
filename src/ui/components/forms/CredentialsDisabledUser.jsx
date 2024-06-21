import { useState } from 'react';
import useStyles from './Forms.style';
import user from '../../../assets/icons/userLog.svg';

const CredentialsDisabled = ({nameUser, onUserChange}) => {
    const classes = useStyles();
    return (
        <form  className={classes.user}>
            <div className={classes.containerInputs} >
                <input disabled className={classes.txField} placeholder="Usuario" value={nameUser} onChange={e => onUserChange(e.target.value)}/>
                <img className={classes.iconLog} src={user} alt="user"/>
            </div>
      </form>
    );
};

export default CredentialsDisabled ;