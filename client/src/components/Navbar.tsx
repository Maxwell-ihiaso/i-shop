import { Badge } from '@mui/material'
import { Search, ShoppingCartOutlined } from '@mui/icons-material'
import styled from 'styled-components'
import { mobile, tablet } from '../Assets/responsive'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSelector } from 'react-redux'

const Container = styled.section`
  position: sticky;
  top: 0;
  z-index: 9;
  backdrop-filter: blur(15px);
`

const Wrapper = styled.div`
  padding: 0.5rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  ${tablet({
    padding: '0 1.25rem',
  })}
`

const Left = styled.div`
  display: flex;
  align-items: center;

  ${tablet({
    display: 'none',
  })}
`

const Language = styled.span`
  font-size: 0.875rem;
  cursor: pointer;

  ${tablet({
    flex: 1,
    display: 'none',
  })}
`

const SearchContainer = styled.div`
  border: 0.0313rem solid lightgray;
  display: flex;
  align-items: center;
  margin-left: 1.5625rem;
  padding: 0.3125rem;
  border-radius: 0.5rem;

  ${tablet({
    flex: 1,
  })}
`

const Input = styled.input`
  border: none;
  padding: 0.5rem 1rem;
  color: gray;
  font-size: 1.3rem;
  background-color: transparent;

  &::placeholder {
    color: rgb(171, 172, 172);
    font-size: 1.2rem;
  }

  &:focus {
    border: none;
    outline: none;
  }
`

const Center = styled.div`
  text-align: center;

  ${tablet({
    textAlign: 'unset',
  })}
`

const Logo = styled.h1`
  color: teal;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: rotate(5deg);
  }
  ${mobile({ fontSize: '1.5rem' })}
`
const Right = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: flex-end;

  ${tablet({})}
`

const MenuItem = styled.a`
  text-decoration: none;
  font-size: 1.3rem;
  cursor: pointer;
  text-transform: capitalize;
  transition: all 0.3s ease;

  &:not(:last-child) {
    color: rgb(139, 139, 139);

    &:hover {
      color: teal;
      font-weight: bold;
    }
  }
  ${tablet({ fontSize: '1.2rem' })}
  ${mobile({ fontSize: '0.9rem' })}
`

const Navbar = () => {
  const { quantity } = useSelector(
    (state: {
      cart: {
        products: never[]
        quantity: number
        total: number
      }
    }) => state.cart
  )
  const router = useRouter()
  return (
    <Container>
      <Wrapper>
        <Left>
          <Language>EN</Language>
          <SearchContainer>
            <Input placeholder='search for fashion wears' type='text' />
            <Search style={{ color: 'gray', fontSize: 20 }} />
          </SearchContainer>
        </Left>
        <Center>
          <Link href='/'>
            <Logo>I_SHOP</Logo>
          </Link>
        </Center>
        <Right>
          <Link href='/register'>
            <MenuItem>register</MenuItem>
          </Link>
          <Link href='login'>
            <MenuItem>sign in</MenuItem>
          </Link>
          <MenuItem onClick={() => router.push('/cart')}>
            <Badge badgeContent={quantity} color='primary'>
              <ShoppingCartOutlined style={{ color: 'teal' }} />
            </Badge>
          </MenuItem>
        </Right>
      </Wrapper>
    </Container>
  )
}

export default Navbar
