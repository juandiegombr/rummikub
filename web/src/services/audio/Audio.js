import selectAudio from '../../system-ui/assets/sounds/select.wav'
import turnAudio from '../../system-ui/assets/sounds/turn.wav'

const SOUNDS = {
  SELECT: 'SELECT',
  TURN: 'TURN',
}

const SOUNDS_MAP = {
  SELECT: selectAudio,
  TURN: turnAudio,
}

const play = (soundName) => {
  const sound = SOUNDS_MAP[soundName]
  new Audio(sound).play()
}

export const AudioService = {
  play,
  ...SOUNDS,
}
