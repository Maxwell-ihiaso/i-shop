import { Badge } from "@mui/material";
import { Search, ShoppingCartOutlined } from "@mui/icons-material";
import styled from "styled-components";
import { mobile } from "../Assets/responsive";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector } from "react-redux";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 0.625rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ padding: "0.625rem 0rem" })}
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Language = styled.span`
  font-size: 0.875rem;
  cursor: pointer;
  ${mobile({ display: "none" })}
`;

const SearchContainer = styled.div`
  border: 0.0313rem solid lightgray;
  display: flex;
  align-items: center;
  margin-left: 1.5625rem;
  padding: 0.3125rem;
`;

const Input = styled.input`
  border: none;
  ${mobile({ width: "3.125rem" })}
`;

const Center = styled.div`
  flex: 1;
  text-align: center;
`;

const Logo = styled.h1`
  font-weight: bold;
  cursor: pointer;
  ${mobile({ fontSize: "1.5rem" })}
`;
const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${mobile({ flex: 2, justifyContent: "center" })}
`;

const MenuItem = styled.div`
  font-size: 0.875rem;
  cursor: pointer;
  margin-left: 1.5625rem;
  text-transform: uppercase;
  ${mobile({ fontSize: "0.75rem", marginLeft: "0.625rem" })}
`;

const Navbar = () => {
  const { quantity } = useSelector(
    (state: {
      cart: {
        products: never[];
        quantity: number;
        total: number;
      };
    }) => state.cart
  );
  const router = useRouter();
  return (
    <Container>
      <Wrapper>
        <Left>
          <Language>EN</Language>
          <SearchContainer>
            <Input placeholder="Search" />
            <Search style={{ color: "gray", fontSize: 16 }} />
          </SearchContainer>
        </Left>
        <Center>
          <Link href="/">
            <Logo>I_SHOP</Logo>
          </Link>
        </Center>
        <Right>
          <Link href="/register">
            <MenuItem>REGISTER</MenuItem>
          </Link>
          <Link href="login">
            <MenuItem>SIGN IN</MenuItem>
          </Link>
          <MenuItem onClick={() => router.push("/cart")}>
            <Badge badgeContent={quantity} color="primary">
              <ShoppingCartOutlined />
            </Badge>
          </MenuItem>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Navbar;
