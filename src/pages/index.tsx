import { MouseEvent } from 'react'
import Stripe from 'stripe'
import Image from 'next/future/image'
import Link from 'next/link'
import Head from 'next/head'

import { GetStaticProps } from 'next'
import { stripe } from '../lib/stripe'

import { HomeContainer, Product } from '../styles/pages/home'
import { useKeenSlider } from 'keen-slider/react'

import 'keen-slider/keen-slider.min.css'
import { CartButton } from '../components/CartButton'
import { useCart } from '../hooks/useCart'
import { IProduct } from '../context/CartContext'

interface HomeProps {
  products: IProduct[]
}

export default function Home({ products }: HomeProps) {
  const { addToCart, checkIfItemAlreadyExists } = useCart()

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  })

  function handleAddToCart(
    event: MouseEvent<HTMLButtonElement>,
    product: IProduct,
  ) {
    event.preventDefault()
    addToCart(product)
  }

  return (
    <>
      <Head>
        <title>Ignite Shop</title>
      </Head>
      <HomeContainer ref={sliderRef} className="keen-slider">
        {products.map((product) => {
          return (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              prefetch={false}
            >
              <Product className="keen-slider__slide">
                <Image src={product.imageUrl} width={520} height={480} alt="" />
                <footer>
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.price}</span>
                  </div>
                  <CartButton
                    color="green"
                    size="large"
                    disabled={checkIfItemAlreadyExists(product.id)}
                    onClick={(event) => handleAddToCart(event, product)}
                  />
                </footer>
              </Product>
            </Link>
          )
        })}
      </HomeContainer>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price'],
    //  relacionamento de preço com produto dentro do Stripe
  })

  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price
    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price.unit_amount! / 100),
      numberPrice: price.unit_amount! / 100,
      defaultPriceId: price.id,
    }
  })

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // 2 hours
  }
}
