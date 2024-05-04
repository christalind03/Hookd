type Props = {
  text: string
  icon: JSX.Element
  isDestructive?: boolean
}

export function IconLabel({ text, icon, isDestructive }: Props) {
  return (
    <div
      className={`flex items-center space-x-3 text-sm ${
        isDestructive ? "text-destructive" : ""
      }`}
    >
      {icon}
      <p>{text}</p>
    </div>
  )
}
