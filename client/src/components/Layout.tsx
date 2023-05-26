import Head from "next/head";
import styled from "styled-components";
import Announcement from "./Announcement";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Container = styled.div``;
const Main = styled.main``;

interface ILayout {
  children?: React.ReactNode;
  title?: string;
  description?: string;
}
const Layout = ({
  children,
  title = "",
  description = "An online shooping App for fashion items",
}: ILayout) => {
  return (
    <Container>
      <Head>
        <title>{`I_SHOP | ${title}`}</title>
        <meta name="description" content={description} />
      </Head>
      <Announcement />
      <Navbar />
      <Main>{children}</Main>
      <Footer />
    </Container>
  );
};

export default Layout;
