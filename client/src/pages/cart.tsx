import { Add, Remove } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { mobile } from "../Assets/responsive";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { addUnit, removeProduct, removeUnit } from "../redux/cartSlice";
import { useDispatch } from "react-redux";
import { requestWithAuth } from "../utils/requestMethods";

/**
 *
 * CHECKOUT FORM - temporary
 */
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
/**----------- */

const KEY: string = process.env.NEXT_PUBLIC_STRIPE_KEY as string;

interface ITopButton {
  texture?: string;
}

interface ISummaryItem {
  type?: string;
}

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton = styled.button<ITopButton>`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.texture === "filled" && "none"};
  background-color: ${(props) =>
    props.texture === "filled" ? "black" : "transparent"};
  color: ${(props) => props.texture === "filled" && "white"};
`;

const TopTexts = styled.div`
  ${mobile({ display: "none" })}
`;
const TopText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  margin: 0px 10px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;

const Image = styled.img`
  width: 200px;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const ProductName = styled.span``;

const ProductId = styled.span``;

const ProductColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const ProductSize = styled.span``;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
  ${mobile({ margin: "5px 15px" })}
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
  ${mobile({ marginBottom: "20px" })}
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div<ISummaryItem>`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
`;

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
// const stripePromise = loadStripe(KEY);
// const stripe = useStripe('pk_test_TYooMQauvdEDq54NiTphI7jx'

/**
 *
 * CHECKOUT FORM - temporary
 */
// import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "https://localhost:3000/cart",
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe}>Submit</button>
    </form>
  );
};

/**------------------ */

const Cart = () => {
  const { cart } = useSelector(
    (state: {
      cart: {
        products: any[];
        quantity: number;
        total: number;
      };
    }) => state
  );
  const dispatch = useDispatch();
  const [stripeToken, setStripeToken] = useState<{ [key: string]: any }>({});
  const router = useRouter();

  const onToken = (token: {}) => {
    setStripeToken(token);
  };

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await requestWithAuth.post("/checkout/payment", {
          tokenId: stripeToken.id,
          amount: 500,
          quantity: cart.quantity,
        });
        console.log(res.data);
        router.push({
          pathname: "/cart",
          query: {
            stripeData: res.data,
            // cart,
          },
        });
      } catch (error) {
        console.log(error);
      }
    };

    Object.keys(stripeToken).length !== 0 && makeRequest();
  }, [stripeToken, cart.total, router, cart]);
  return (
    <Layout title="CART" description="Checkout items in your basket.">
      <Wrapper>
        <Title>YOUR BAG</Title>
        <Top>
          <TopButton onClick={() => router.push("/products/category/")}>
            CONTINUE SHOPPING
          </TopButton>
          <TopTexts>
            <TopText>Shopping Bag({cart.quantity})</TopText>
            <TopText>Your Wishlist (0)</TopText>
          </TopTexts>
          <TopButton texture="filled">CHECKOUT NOW</TopButton>
        </Top>
        <Bottom>
          {cart.products.length <= 0 ? (
            <Info
              style={{
                textAlign: "center",
                padding: "5rem 0",
                fontSize: "3rem",
              }}
            >
              Your Cart is empty!
            </Info>
          ) : (
            <>
              <Info>
                {cart.products.map((product) => (
                  <Container key={product._id}>
                    <Product>
                      <ProductDetail>
                        <Image
                          src={
                            product.images.split("|")[
                              Math.floor(Math.random() * 3)
                            ]
                          }
                          alt={product.title}
                        />
                        <Details>
                          <ProductName>
                            <b>Product:</b> {product.title}
                          </ProductName>
                          <ProductId>
                            <b>ID:</b> {product.sku}
                          </ProductId>
                          <ProductId>
                            <b>Brand:</b> {product.brand}
                          </ProductId>
                          <ProductId>
                            <b>Price:</b> $ {product.price}
                          </ProductId>
                        </Details>
                      </ProductDetail>
                      <PriceDetail>
                        <ProductAmountContainer>
                          <Container
                            onClick={() =>
                              product.quantity < 10 &&
                              dispatch(addUnit({ ...product }))
                            }
                          >
                            <Add />
                          </Container>
                          <ProductAmount>{product.quantity}</ProductAmount>
                          <Container
                            onClick={() =>
                              product.quantity > 1
                                ? dispatch(removeUnit({ ...product }))
                                : dispatch(removeProduct({ ...product }))
                            }
                          >
                            <Remove />
                          </Container>
                        </ProductAmountContainer>
                        <ProductPrice>
                          $ {product.price * product.quantity}
                        </ProductPrice>
                      </PriceDetail>
                    </Product>
                    <Hr />
                  </Container>
                ))}
              </Info>
              <Summary>
                <SummaryTitle>ORDER SUMMARY</SummaryTitle>
                <SummaryItem>
                  <SummaryItemText>Subtotal</SummaryItemText>
                  <SummaryItemPrice>$ {cart.total.toFixed(2)}</SummaryItemPrice>
                </SummaryItem>
                <SummaryItem>
                  <SummaryItemText>Estimated Shipping</SummaryItemText>
                  <SummaryItemPrice>$ 5.9</SummaryItemPrice>
                </SummaryItem>
                <SummaryItem>
                  <SummaryItemText>Shipping Discount</SummaryItemText>
                  <SummaryItemPrice>$ -5.90</SummaryItemPrice>
                </SummaryItem>
                <SummaryItem type="total">
                  <SummaryItemText>Total</SummaryItemText>
                  <SummaryItemPrice>$ {cart.total.toFixed(2)}</SummaryItemPrice>
                </SummaryItem>

                {/* <StripeCheckout
                  name="I_Shop"
                  image="https://avatars.githubusercontent.com/u/64949174?v=4"
                  billingAddress
                  shippingAddress
                  description={`Your total is $${cart.total}`}
                  amount={cart.total * 100}
                  token={onToken}
                  stripeKey={KEY}
                ></StripeCheckout> */}
                {/* <Button>CHECKOUT NOW<
                Button> */}

                {/* <Elements stripe={stripePromise}>
                  <CheckoutForm />
                </Elements> */}

                <Button
                  onClick={() =>
                    stripe.redirectToCheckout({
                      // Make the id field from the Checkout Session creation API response
                      // available to this file, so you can provide it as argument here
                      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
                      sessionId: "{{CHECKOUT_SESSION_ID}}",
                    })
                  }
                >
                  CHECKOUT NOW
                </Button>
              </Summary>
            </>
          )}
        </Bottom>
      </Wrapper>
    </Layout>
  );
};

export default Cart;
