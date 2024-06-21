import search from '../../../assets/icons/search.svg'
import useStyles from './Forms.style'
const Search = ({text, onSearch, type='text', values, placeholder}) => {
    const classes = useStyles();
    const months= [
        'Enero', 'Febrero', 'Marzo', 
        'Abril', 'Mayo', 'Junio', 
        'Julio', 'Agosto', 'Septiembre', 
        'Octubre', 'Noviembre', 'Diciembre'];
    
    const setValue = (e) => {
        onSearch(e.target.value);
    }

    return(
        <div className={classes.search}>
            {type==='select'?
                <select className={classes.inputSearch} onChange={(e)=>{onSearch(e.target.value)}}>
                    <option>{placeholder}</option>
                    
                    {
                        values.map((item, index) => (
                            <option key={index} value={item.idEnable}>
                                {item.subject}
                            </option>
                            )
                        )
                    }
                </select>
                :
                <input className={classes.inputSearch} type={type} placeholder={text} onChange={e => {setValue(e)}} />
            }
            <img className={classes.iconSearch} src={search} alt="search" />
        </div>
    );
};

export default Search;