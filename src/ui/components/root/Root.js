import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom"

export const Root = () => {

    const navigator = useNavigate();
    const location = useLocation();

    useEffect(()=>{

        const token = JSON.parse(localStorage.getItem('credentialSM'));
        if(token === null){
            navigator('/login');
        }
        else{
            switch (token.rol) {
                case 'SuperUsuario':
                    break;
                case 'Estudiante':
                    if(! location.pathname.startsWith('/student'))
                        navigator('/student');
                    break;
                case 'Administrador':
                    if(! location.pathname.startsWith('/admin'))
                        navigator('/admin');
                    break;
                case 'Docente':
                    if(! location.pathname.startsWith('/teacher'))
                        navigator('/teacher');
                    break;
                case 'Secretario':
                    if(! location.pathname.startsWith('/secretary'))
                        navigator('/secretary');
                    break;
                default:
                    navigator('/login');
                    break;
            }
        }
    },[])

    return (
        <div style={{width:'100vw'}}>
                    <Outlet/>
        </div>
    )
}