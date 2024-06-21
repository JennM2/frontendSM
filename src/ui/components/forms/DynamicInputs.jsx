import useStyles from './Forms.style'

const DynamicInputs = ({ fields, className, onChange, values, enable=false}) => {
  const classes = useStyles();

  return (
    <div>
      {fields.map(({ label, placeholder, type,id, options=[], min, max }, index) => {
        return(
        <div className={classes.dynInputs} key={index}>
          <label className={className||classes.dynLabel} htmlFor={id}>{label}:</label>
          {
            type!=='select'?
              <input 
                disabled={enable} 
                className={classes.dynInput} 
                type={type} 
                id={id} 
                placeholder={`${placeholder}`} 
                {...(values && { value: values[id] })}
                {...((min && max) && {min:min, max:max})}
                onChange={e => onChange(id, e.target.value)}
              />:
              <div className={classes.selectContainer}>
                <select
                  className={classes.select}
                  value={values[id]}
                  id={id}
                  name={id}
                  onChange={e=>{onChange(id,e.target.value)}}
                >
                  {options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
          }
          
        </div>
      )})}
    </div>
  );
};

export default DynamicInputs;