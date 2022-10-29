import { useEffect, useRef, useState } from "react"

import './Tile.css'

const Tile = ({ tile, spot, selected, onDrag, onMove, onDrop, onClick }) => {
  const tileRef = useRef()
  const staticActive = useRef(false)
  const originalPosition = useRef({})
  const initialTranslation = useRef({})
  const [active, setActive] = useState(false)
  const [currentTranslation, setCurrentTranslation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    originalPosition.current = {
      x: tileRef.current.getBoundingClientRect().left,
      y: tileRef.current.getBoundingClientRect().top,
    }
    document.addEventListener("mousemove", move)
    document.addEventListener("mouseup", leave)

    document.addEventListener("touchmove", move)
    document.addEventListener("touchend", leave)

    return () => {
      document.removeEventListener("mousemove", move)
      document.removeEventListener("mouseup", leave)

      document.removeEventListener("touchmove", move)
      document.removeEventListener("touchend", leave)
    }
  }, [])

  useEffect(() => {
    if(!spot) return

    const spotElement = document.getElementById(`${spot.x}-${spot.y}`)
    if(!spotElement) {
      return
    }
    const currentTranslation = {
      x: spotElement.getBoundingClientRect().left - originalPosition.current.x ,
      y: spotElement.getBoundingClientRect().top - originalPosition.current.y,
    }
    setCurrentTranslation(currentTranslation)
  }, [spot])

  const getCursorPosition = (event) => {
    if (event.type === "touchstart" || event.type === "touchmove") {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY }
    } else {
      return { x: event.clientX, y: event.clientY }
    }
  }

  const getTileCenterPosition = () => {
    const tileMeasures = tileRef.current.getBoundingClientRect()
    return {
      x: tileMeasures.left + tileMeasures.width / 2,
      y: tileMeasures.top + tileMeasures.height / 2,
    }
  }

  const move = (event) => {
    if (staticActive.current) {
      event.preventDefault()
      const cursor = getCursorPosition(event)
      const moveDeltaX = cursor.x - initialTranslation.current.x
      const moveDeltaY = cursor.y - initialTranslation.current.y
      const currentTranslation = {
        x: moveDeltaX,
        y: moveDeltaY,
      }
      setCurrentTranslation(currentTranslation)
      onMove(getTileCenterPosition())
    }
  }

  // const take = (event) => {
  //   const cursor = getCursorPosition(event)
  //   initialTranslation.current = {
  //     x: cursor.x - currentTranslation.x,
  //     y: cursor.y - currentTranslation.y,
  //   }
  //   staticActive.current = true
  //   setActive(true)
  //   onDrag()
  // }

  const leave = () => {
    if (staticActive.current) {
      initialTranslation.current = {
        x: currentTranslation.x,
        y: currentTranslation.y,
      }
      staticActive.current = false
      setActive(false)
      onDrop({ tile, position: getTileCenterPosition() })
    }
  }

  const getTransformValue = () => {
    const translate = `translate(${currentTranslation.x}px, ${currentTranslation.y}px)`
    const rotate = `rotate(5deg) scale(1.05)`
    if (active) {
      return translate + " " + rotate
    }
    return translate
  }

  return (
    <div
      ref={tileRef}
      id={tile.id}
      aria-label={`Tile ${tile.value} ${tile.color}`}
      className={`tile tile--${tile.color} ${selected ? 'tile--selected' : ''}`}
      // onMouseDown={take}
      // onTouchStart={take}
      onClick={() => onClick(tile)}
      style={{ transform: getTransformValue(), zIndex: active ? 99 : 0 }}
    >
      <div className="tile__number">{tile.value}</div>
      <div className="tile__brand">
        <div className="tile__brand-letter">Rummikub</div>
      </div>
    </div>
  )
}

export { Tile }
