import { ReactComponent as CopyIcon } from '../assets/icons/copy.svg'
import { ReactComponent as GearIcon } from '../assets/icons/gear.svg'
import { ReactComponent as LogoutIcon } from '../assets/icons/logout.svg'
import { ReactComponent as MenuIcon } from '../assets/icons/menu.svg'
import { ReactComponent as SettingsIcon } from '../assets/icons/settings.svg'
import { ReactComponent as ZapIcon } from '../assets/icons/zap.svg'

const ICONS = {
  COPY: CopyIcon,
  GEAR: GearIcon,
  LOGOUT: LogoutIcon,
  MENU: MenuIcon,
  SETTINGS: SettingsIcon,
  ZAP: ZapIcon,
}
const Icon = ({ icon, size, color, ...props }) => {
  const IconComponent = ICONS[icon]
  return <IconComponent width={size} height={size} {...props} />
}

export { Icon }
