import type { AppProps } from 'next/app'
import { Container } from '../styles/pages/app'
import { globalStyles } from '../styles/global'
import { Header } from '../components/Header'
import { CartContextProvider } from '../context/CartContext'

globalStyles()

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartContextProvider>
      <Container>
        <Header />
        <Component {...pageProps} />
      </Container>
    </CartContextProvider>
  )
}
