import Link from 'next/link'
import logoImg from '../../assets/logo.svg'
import Image from 'next/future/image'
import { HeaderContainer } from './styles'
import { Cart } from '../Cart'
import { useRouter } from 'next/router'

export function Header() {
  const { pathname } = useRouter()

  const showCartButton = pathname !== '/success'

  return (
    <HeaderContainer>
      <Link href="/">
        <a>
          <Image src={logoImg} alt="" />
        </a>
      </Link>
      {showCartButton && <Cart />}
    </HeaderContainer>
  )
}
