import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Http } from 'services/http'

const NameStep = ({ onConfirm }) => {
  const inputRef = useRef()

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const createUser = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const name = formData.get('name')
    const user = await Http.get(`/user/${name}`).then(response => response.json())
    localStorage.setItem('userId', user.id)
    localStorage.setItem('userName', user.name)
    onConfirm()
  }

  return (
    createPortal(
      <div className="initialize-dialog__overlay">
        <div role="dialog" aria-labelledby="initialize-title" className="initialize-dialog">
          <h2 id="initialize-title" className="initialize-dialog__title">Welcome! 👋</h2>
          <form className="initialize-dialog__form" onSubmit={createUser}>
            <div className="ui-input">
              <label htmlFor="name-field" className="ui-input__label">Name:</label>
              <input id="name-field" ref={inputRef} className="ui-input__input" type="text" name="name" placeholder="Write your name here"/>
            </div>
            <button className="ui-button" type="submit">Confirm</button>
          </form>
        </div>
      </div>,
      document.getElementById('dialog'),
    )
  )
}

export { NameStep }
