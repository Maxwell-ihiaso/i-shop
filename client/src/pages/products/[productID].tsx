import { Add, Remove } from "@mui/icons-material";
import styled from "styled-components";
import Newsletter from "../../components/Newsletter";
import { mobile } from "../../Assets/responsive";
import { useState } from "react";
import Layout from "../../components/Layout";
import { requestWithoutAuth } from "../../utils/requestMethods";
import { GetStaticPaths, GetStaticProps } from "next";
import { addProduct } from "../../redux/cartSlice";
import { useDispatch } from "react-redux";

const Wrapper = styled.div`
  padding: 50px;
  display: flex;
  ${mobile({ padding: "10px", flexDirection: "column" })}
`;

const ImgContainer = styled.div`
  flex: 1;
`;

const Image = styled.img`
  width: 100%;
  height: 90vh;
  object-fit: cover;
  ${mobile({ height: "40vh" })}
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 0px 50px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 200;
`;

const Desc = styled.p`
  margin: 20px 0px;
`;

const Price = styled.span`
  font-weight: 100;
  font-size: 40px;
`;

const FilterContainer = styled.div`
  width: 50%;
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  ${mobile({ width: "100%" })}
`;

const Filter = styled.div`
  display: flex;
  align-items: center;
`;

const FilterTitle = styled.span`
  font-size: 20px;
  font-weight: 200;
`;

const FilterColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  margin: 0px 5px;
  cursor: pointer;
`;

const FilterSize = styled.select`
  margin-left: 10px;
  padding: 5px;
`;

const FilterSizeOption = styled.option``;

const AddContainer = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ width: "100%" })}
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
`;

const Amount = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid teal;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
`;

const Hr = styled.hr`
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 15px;
  border: 2px solid teal;
  background-color: white;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #f8f4f4;
  }
`;

const Product = ({ product }: any) => {
  const [prod, setProd] = useState<IProduct>(product);
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const dispatch = useDispatch();

  const handleQuantity = (type: string) => {
    if (type === "dec") {
      quantity > 1 && setQuantity(quantity - 1);
    } else {
      setQuantity(quantity + 1);
    }
  };

  const handleClick = () => {
    dispatch(addProduct({ ...product, quantity, color, size }));
  };

  return (
    <Layout>
      <Wrapper>
        <ImgContainer>
          <Image src={prod.main_image} alt="" />
        </ImgContainer>
        <InfoContainer>
          <Title>{prod.title}</Title>
          <Desc>Brand: {prod.brand}</Desc>
          <Desc>SKU: {prod.sku}</Desc>

          <Title>Description</Title>
          <Desc>{prod.description}</Desc>
          <Price>$ {prod.price}</Price>

          {/* <FilterContainer>
            <Filter>
              <FilterTitle>Color</FilterTitle>
              {prod.color?.map((c) => (
                <FilterColor color={c} key={c} onClick={() => setColor(c)} />
              ))}
            </Filter>
            <Filter>
              <FilterTitle>Size</FilterTitle>
              <FilterSize onChange={(e) => setSize(e.target.value)}>
                {prod.size?.map((s) => (
                  <FilterSizeOption key={s}>{s}</FilterSizeOption>
                ))}
              </FilterSize>
            </Filter>
          </FilterContainer> */}
          <AddContainer>
            <AmountContainer>
              <Remove onClick={() => handleQuantity("dec")} />
              <Amount>{quantity}</Amount>
              <Add onClick={() => handleQuantity("inc")} />
            </AmountContainer>
            <Button onClick={handleClick}>ADD TO CART</Button>
          </AddContainer>
          <Hr />
          <Title>Highlights</Title>
          {prod.highlights.split("|").map((spec: string, i: number) => (
            <Desc key={i}>{spec}</Desc>
          ))}
        </InfoContainer>
      </Wrapper>
      <Newsletter />
    </Layout>
  );
};

export interface IProduct {
  _id: string;
  title: string;
  description: string;
  main_image: string;
  categories: string[];
  // size: string[];
  // color: string[];
  price: number;
  brand: string;
  sku: number;
  curreny: string;
  specifications: string;
  highlights: string;
  images: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

// This gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  const res = await requestWithoutAuth.get("/products");
  const products: IProduct[] = res.data;

  // Get the paths we want to pre-render based on products
  const paths = products.map((product) => ({
    params: { productID: product._id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
};

// This also gets called at build time
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // params contains the product `id`.
  // If the route is like /product/1, then params.productID is 1
  const res = await requestWithoutAuth.get(
    `/products/find/${params?.productID}`
  );
  const product = res.data;

  // Pass post data to the page via props
  return { props: { product } };
};

export default Product;
