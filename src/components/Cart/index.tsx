import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/future/image'
import { CartButton } from '../CartButton'
import {
  CartContent,
  CartClose,
  CartProduct,
  CartProductImage,
  CartProductDetails,
  CartFinalization,
  FinalizationDetails,
} from './styles'
import { X } from 'phosphor-react'
import { useCart } from '../../hooks/useCart'
import axios from 'axios'

export function Cart() {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
    useState(false)

  const { cartItems, removeCartItem, cartTotal } = useCart()
  const cartQuantity = cartItems.length

  const cartTotalFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cartTotal)

  async function handleCheckout() {
    try {
      setIsCreatingCheckoutSession(true)

      const response = await axios.post('/api/checkout', {
        products: cartItems,
      })

      const { checkoutUrl } = response.data

      window.location.href = checkoutUrl
    } catch (err) {
      setIsCreatingCheckoutSession(false)
      alert('Falha ao direcionar ao checkout')
    }
  }
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <CartButton />
      </Dialog.Trigger>
      <Dialog.Portal>
        <CartContent>
          <CartClose>
            <X size={24} weight="bold" />
          </CartClose>

          <h2>Carrinho de compras</h2>
          <section>
            {cartQuantity <= 0 && <p>Parece que seu carrinho está vazio</p>}

            {cartItems.map((cartItem) => (
              <CartProduct key={cartItem.id}>
                <CartProductImage>
                  <Image
                    width={100}
                    height={93}
                    alt=""
                    src={cartItem.imageUrl}
                  />
                </CartProductImage>
                <CartProductDetails>
                  <p>{cartItem.name}</p>
                  <strong>{cartItem.price}</strong>
                  <button onClick={() => removeCartItem(cartItem.id)}>
                    Remover
                  </button>
                </CartProductDetails>
              </CartProduct>
            ))}
          </section>
          <CartFinalization>
            <FinalizationDetails>
              <div>
                <span>Quantidade</span>
                <p>
                  {cartQuantity} {cartQuantity === 1 ? 'item' : 'itens'}
                </p>
              </div>
              <div>
                <span>Valor total</span>
                <p>{cartTotalFormatted}</p>
              </div>
            </FinalizationDetails>
            <button
              onClick={handleCheckout}
              disabled={isCreatingCheckoutSession || cartQuantity <= 0}
            >
              Finalizar compra
            </button>
          </CartFinalization>
        </CartContent>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
