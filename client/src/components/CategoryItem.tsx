import { useRouter } from "next/router";
import styled from "styled-components";
import { mobile } from "../Assets/responsive";
import { ICategory } from "../interfaces";

const Container = styled.div`
  flex: 1;
  margin: 0.1875rem;
  height: 70vh;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  ${mobile({ height: "20vh" })}
`;

const Info = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  color: white;
  margin-bottom: 1.25rem;
`;

const Button = styled.button`
  border: none;
  padding: 0.625rem;
  background-color: white;
  color: gray;
  cursor: pointer;
  font-weight: 600;
`;

const CategoryItem = (item: ICategory) => {
  const router = useRouter();
  return (
    <Container onClick={() => router.push(`products/category/${item.cat}`)}>
      <Image src={item.img} alt={item.title} />
      <Info>
        <Title>{item.title}</Title>
        <Button>SHOP NOW</Button>
      </Info>
    </Container>
  );
};

export default CategoryItem;
