import './Radio.css'

const Radio = ({ label, selected, onChange, ...props }) => {
  const handleOnChange = (event) => {
    onChange(event.target.value)
  }

  return (
    <label className="ui-radio">
      <input
        type="radio"
        checked={selected === props.value}
        onChange={handleOnChange}
        {...props}
      />
      <div className="ui-radio__label">{label}</div>
    </label>
  )
}

export { Radio }
