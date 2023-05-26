import styled from "styled-components";
import Products from "../../../components/Products";
import Newsletter from "../../../components/Newsletter";
import { mobile } from "../../../Assets/responsive";
import Layout from "../../../components/Layout";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";

const Title = styled.h1`
  margin: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Filter = styled.div`
  margin: 20px;
  ${mobile({ width: "0px 20px", display: "flex", flexDirection: "column" })}
`;

const FilterText = styled.span`
  font-size: 20px;
  font-weight: 600;
  margin-right: 20px;
  ${mobile({ marginRight: "0px" })}
`;

const Select = styled.select`
  padding: 10px;
  margin-right: 20px;
  ${mobile({ margin: "10px 0px" })}
`;
const Option = styled.option``;

const ProductList = () => {
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");
  const router = useRouter();
  const { productCategory } = router.query;

  const handleFilters = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value.toLowerCase(),
    });
  };

  return (
    <Layout>
      <Title>Brown Tinny</Title>
      <FilterContainer>
        <Filter>
          <FilterText>Filter Products:</FilterText>
          <Select name="color" onChange={handleFilters}>
            <Option disabled>Color</Option>
            <Option defaultValue="white">white</Option>
            <Option>black</Option>
            <Option>red</Option>
            <Option>blue</Option>
            <Option>yellow</Option>
            <Option>green</Option>
          </Select>
          <Select name="size" onChange={handleFilters}>
            <Option disabled>Size</Option>
            <Option>XS</Option>
            <Option>S</Option>
            <Option defaultValue="M">M</Option>
            <Option>L</Option>
            <Option>XL</Option>
          </Select>
        </Filter>
        <Filter>
          <FilterText>Sort Products:</FilterText>
          <Select
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setSort(e.target.value)
            }
          >
            <Option defaultValue="newest">Newest</Option>
            <Option value="asc">Price (asc)</Option>
            <Option value="desc">Price (desc)</Option>
          </Select>
        </Filter>
      </FilterContainer>
      <Products cat={productCategory} filters={filters} sort={sort} />
      <Newsletter />
    </Layout>
  );
};

export default ProductList;
