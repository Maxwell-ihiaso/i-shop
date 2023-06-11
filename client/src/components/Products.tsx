import { useEffect, useState } from "react";
import styled from "styled-components";
import Product from "./Product";
import { requestWithoutAuth } from "../utils/requestMethods";
import { IProduct } from "../pages/products/[productID]";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

interface IProductComponent {
  cat?: string | string[];
  filters?: {};
  sort?: string;
}

/***
 * This is an helper function for getting around
 * index an object
 *
 */
function hasKey<O extends Object>(obj: O, key: PropertyKey): key is keyof O {
  return key in obj;
}
/**------------------------------------ */

const Products = ({ cat, filters, sort }: IProductComponent) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await requestWithoutAuth.get<IProduct[]>(
          cat
            ? `products?category=${cat}`
            : "products"
        );
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getProducts();
  }, [cat]);

  useEffect(() => {
    cat &&
      setFilteredProducts(
        products.filter((item: IProduct) =>
          Object.entries(filters!).every(([key, value]) => {
            // use the hasKey function to ensure that key is a valid Object property
            // then use the string assertion to ensure the indexing return sonly
            // a string array
            return (
              hasKey(item, key) &&
              (item[key] as string[]).includes(value as string)
            );
          })
        )
      );
  }, [products, cat, filters]);

  useEffect(() => {
    if (sort === "newest") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => Number(a.createdAt) - Number(b.createdAt))
      );
    } else if (sort === "asc") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.price - b.price)
      );
    } else {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => b.price - a.price)
      );
    }
  }, [sort]);

  return (
    <Container>
      {cat
        ? filteredProducts.map((item) => <Product {...item} key={item._id} />)
        : products
            .slice(0, 8)
            .map((item) => <Product {...item} key={item._id} />)}
    </Container>

    // <Container>
    //   {popularProducts.map((item) => (
    //     <Product {...item} key={item.id} />
    //   ))}
    // </Container>
  );
};

export default Products;
