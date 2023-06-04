import styled from 'styled-components'
import { categories } from '../Assets/data'
import { mobile } from '../Assets/responsive'
import CategoryItem from './CategoryItem'

const Container = styled.div`
  display: flex;
  padding: 1.25rem;
  justify-content: space-between;
  
  ${mobile({
    padding: '0 1rem',
    flexDirection: 'column',
  })}
`

const Categories = () => {
  return (
    <Container>
      {categories.map((item) => (
        <CategoryItem {...item} key={item.id} />
      ))}
    </Container>
  )
}

export default Categories
