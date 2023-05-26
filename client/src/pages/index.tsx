import type { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";
import Categories from "../components/Categories";
import Layout from "../components/Layout";
import Newsletter from "../components/Newsletter";
import Products from "../components/Products";
import Slider from "../components/Slider";

const Main = styled.div`
  font-family: "Urbanist", sans-serif;
`;

const Home: NextPage = () => {
  return (
    <Layout
      title="HOME"
      description="An online shooping App for your fashion items"
    >
      <Slider />
      <Categories />
      <Products />
      <Newsletter />
    </Layout>
  );
};

export default Home;
