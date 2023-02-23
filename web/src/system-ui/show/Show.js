import './Show.css'

const Show = ({ when, children }) => {
  const classNames = () => {
    let className = 'ui-show'
    if (when) {
      className = className + ' ui-show--visible'
    }
    return className
  }

  return <div className={classNames()}>{children}</div>
}

export { Show }
