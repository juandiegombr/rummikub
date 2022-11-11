import { ReactComponent as SettingsIcon } from '../assets/icons/settings.svg'
import { ReactComponent as ZapIcon } from '../assets/icons/zap.svg'

const ICONS = {
  SETTINGS: SettingsIcon,
  ZAP: ZapIcon,
}
const Icon = ({ icon, size, color, ...props }) => {
  const IconComponent = ICONS[icon]
  return <IconComponent width={size} height={size} {...props}/>
}

export { Icon }
