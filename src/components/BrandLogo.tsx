
import wordmark from '../assets/brand/miraj-wordmark.png'
import mark from '../assets/brand/miraj-mark.png'

type BrandLogoProps = {
  variant?: 'wordmark' | 'mark'
  className?: string
}

function BrandLogo({
  variant = 'wordmark',
  className = '',
}: BrandLogoProps) {
  const image = variant === 'wordmark' ? wordmark : mark

  return (
    <img
      src={image}
      alt="Miraj"
      className={className}
    />
  )
}

export default BrandLogo
