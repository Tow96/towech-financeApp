import { ReactNode } from 'react'
import { Icon } from './icon'

const MAX_ICON_ID = 35
const icons: ReactNode[] = []
for (let i = 0; i < MAX_ICON_ID; i++) {
	icons.push(<Icon className="h-18 w-18 rounded-full" id={i} name="C" />)
}

interface IconSelectorProps {
	
}
