import { useRouter } from 'next/router'
import styled from 'styled-components'
import { mobile, tablet } from '../Assets/responsive'
import { ICategory } from '../interfaces'

const Container = styled.div<{ img: string }>`
  min-height: 400px;
  background: linear-gradient(
      90deg,
      rgba(2, 0, 36, 0.7) 48%,
      rgba(2, 0, 36, 0.5) 100%
    ),
    url(${(props) => props.img});

  background-position: center;
  background-size: cover;
  display: flex;
  flex: 1;
  align-items: flex-end;
  justify-content: center;

  ${tablet({
    minHeight: '300px',
  })}

  
  ${mobile({
    minHeight: '200px',
  })}


`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Title = styled.h1`
  color: white;
  margin-bottom: 1.25rem;

  ${tablet({
    fontSize: "20px",
  })}

  
  ${mobile({
    fontSize: "24px",
  })}


`

const Button = styled.button`
  border: none;
  padding: 0.625rem;
  background-color: white;
  color: gray;
  cursor: pointer;
  font-weight: 600;
  text-transform: uppercase;
  transition: border-radius 0.2s ease;

  &:hover {
    border-radius: 0.5rem;
  }
`

const CategoryItem = (item: ICategory) => {
  const router = useRouter()
  return (
    <Container img={item.img}>
      <Info>
        <Title>{item.title}</Title>
        <Button onClick={() => router.push(`products/category/${item.cat}`)}>
          shop now
        </Button>
      </Info>
    </Container>
  )
}

export default CategoryItem
