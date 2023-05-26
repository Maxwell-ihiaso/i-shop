import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
// import { login } from "../redux/apiCalls";
import { mobile } from "../Assets/responsive";
import { requestWithoutAuth } from "../utils/requestMethods";
// import { useDispatch, useSelector } from "react-redux";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/6984650/pexels-photo-6984650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 25%;
  padding: 20px;
  background-color: white;
  ${mobile({ width: "75%" })}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 10px 0;
  padding: 10px;
`;

const ButtonDiv = styled.div`
  display: flex;
  flex-direction: column;
`;
const Button = styled.button`
  /* width: 40%; */
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
  &:disabled {
    color: green;
    cursor: not-allowed;
  }
`;

const LogInError = styled.span`
  color: red;
  margin: 1rem;
`;

const Clink = styled.a`
  margin: 5px 0px;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
`;

const Error = styled.span`
  color: red;
`;

const Login = () => {
  const [error, setError] = useState("");
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  // const dispatch = useDispatch();
  // const { isFetching, error } = useSelector((state) => state.user);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleButtonClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!Object.entries(data).every(([_, value]) => value !== ""))
      return setError("All fields must be completed");

    requestWithoutAuth
      .post("/auth/login", data)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setError("");
        setData({
          username: "",
          password: "",
        });
        localStorage.setItem("access_token", data.accessToken);
      })
      .catch((err) => {
        setError(JSON.parse(err.request.response).message);
      });
  };

  useEffect(() => {
    const timerId = setTimeout(() => setError(""), 2500);

    return () => clearTimeout(timerId);
  }, [error]);

  // const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.post(`http://localhost:5000/api/auth/login`, {});
  //     console.log(res.data);
  //   } catch (error: any) {
  //     setError(error.message);
  // }
  // login(dispatch, { username, password });
  // };
  return (
    <Container>
      <Wrapper>
        <Title>SIGN IN</Title>
        <Form>
          <Input
            name="username"
            value={data.username}
            placeholder="username"
            onChange={handleInputChange}
          />
          <Input
            name="password"
            value={data.password}
            placeholder="password"
            type="password"
            onChange={handleInputChange}
          />
          <ButtonDiv>
            <Button
              onClick={handleButtonClick}
              // disabled={isFetching}
            >
              LOGIN
            </Button>
            {error && <LogInError>{error}</LogInError>}
          </ButtonDiv>
          {/* {error && <Error>Something went wrong...</Error>} */}
          <Clink>DO NOT YOU REMEMBER THE PASSWORD?</Clink>
          <Link href="/register">
            <Clink>CREATE A NEW ACCOUNT</Clink>
          </Link>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Login;
