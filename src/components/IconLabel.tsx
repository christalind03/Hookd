type Props = {
  text: string
  icon: JSX.Element
  isDestructive?: boolean
}

export function IconLabel({ text, icon, isDestructive }: Props) {
  return (
    <div
      className={`flex items-center justify-center space-x-3 ${
        isDestructive ? "text-destructive" : ""
      }`}
    >
      {icon}
      <p>{text}</p>
    </div>
  )
}
