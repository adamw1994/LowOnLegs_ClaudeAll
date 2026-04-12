interface Props {
  imagePath: string | null
  nickname: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-20 h-20 text-lg',
  xl: 'w-32 h-32 text-2xl',
}

export default function PlayerAvatar({ imagePath, nickname, size = 'md' }: Props) {
  const sizeClass = sizes[size]

  if (imagePath) {
    return (
      <img
        src={imagePath}
        alt={nickname}
        className={`${sizeClass} rounded-full object-cover border-2 border-white/20`}
        onError={e => { (e.target as HTMLImageElement).src = '/images/default-avatar.png' }}
      />
    )
  }

  return (
    <div className={`${sizeClass} rounded-full bg-white/10 flex items-center justify-center font-bold text-white/60 border-2 border-white/20`}>
      {nickname.slice(0, 2).toUpperCase()}
    </div>
  )
}
