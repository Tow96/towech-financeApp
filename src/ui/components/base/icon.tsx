import { Avatar, AvatarFallback, AvatarImage } from './avatar'

interface IconProps {
	className?: string
	id: number
	name: string
}
export const Icon = (props: IconProps) => (
	<div>
		<Avatar className={props.className}>
			<AvatarImage src={`/icon/${props.id}.svg`} alt={props.name} />
			<AvatarFallback>{props.name.charAt(0)}</AvatarFallback>
		</Avatar>
	</div>
)
