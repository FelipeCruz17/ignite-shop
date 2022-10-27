import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/future/image'
import Head from 'next/head'
import { useRouter } from 'next/router'

import Stripe from 'stripe'
import { IProduct } from '../../context/CartContext'
import { useCart } from '../../hooks/useCart'
import { stripe } from '../../lib/stripe'
import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from '../../styles/pages/product'

interface ProductProps {
  product: IProduct
}

export default function Products({ product }: ProductProps) {
  const { isFallback } = useRouter()

  const { checkIfItemAlreadyExists, addToCart } = useCart()

  if (isFallback) {
    return <p>Loading...</p>
  }

  const itemAlreadyExists = checkIfItemAlreadyExists(product.id)

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>
      <ProductContainer>
        <ImageContainer>
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={520}
            height={480}
          />
        </ImageContainer>
        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>
          <p>{product.description}</p>
          <button
            disabled={itemAlreadyExists}
            onClick={() => addToCart(product)}
          >
            {itemAlreadyExists
              ? 'Produto está no carrinho'
              : 'Colocar na sacola'}
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: {
          id: 'prod_MQr0GKeRBw31i1',
        },
      },
    ],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
  params,
}) => {
  const productId = params!.id

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  })

  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(price.unit_amount! / 100),
        numberPrice: price.unit_amount! / 100,
        description: product.description,
        defaultPriceId: price.id,
      },
    },
    revalidate: 60 * 60 * 1, // 1hour
  }
}
