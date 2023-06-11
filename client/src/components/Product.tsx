import {
  FavoriteBorderOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from '@mui/icons-material'
import Link from 'next/link'
import styled from 'styled-components'
import { IProduct } from '../pages/products/[productID]'

const Container = styled.section`
  flex: 1;
  margin: 0.3125rem;
  min-width: 10rem;
  width: 19rem;
  height: 15rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fdfdfd;
  position: relative;
  flex-direction: column;
  border-radius: 0.5rem;
  overflow: hidden;
  padding: 1rem 0;
`

const Image = styled.img`
  height: 55%;
  z-index: 2;
  mix-blend-mode: multiply;
  flex: 3;
`

const Info = styled.div`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`

const Icon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.625rem;
  transition: all 0.5s ease;
  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  }
`

const ProducDetails = styled.div`
  flex: 1;
`

const ProductDetailsTitle = styled.p`
  text-transform: capitalize;
  font-size: 0.8rem;
  margin-bottom: 0;
`

const ProductDetailsPrice = styled.span`
  font-weight: 500;
`
const Product = (item: IProduct) => {
  const desc =
    item?.title.length > 25 ? `${item.title.substring(0, 25)}...` : item.title
  return (
    <Container>
      <Image src={item.main_image} alt='' />

      <ProducDetails>
        <ProductDetailsTitle>{desc}</ProductDetailsTitle>
        <ProductDetailsPrice>${item.price}</ProductDetailsPrice>
      </ProducDetails>
      <Info>
        <Icon>
          <ShoppingCartOutlined />
        </Icon>
        <Icon>
          <Link
            as={`products/${encodeURIComponent(item._id)}`}
            href='products/[productID]'
          >
            <SearchOutlined />
          </Link>
        </Icon>
        <Icon>
          <FavoriteBorderOutlined />
        </Icon>
      </Info>
    </Container>
  )
}

export default Product
