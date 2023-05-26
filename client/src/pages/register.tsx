import { Key } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { setEnvironmentData } from "worker_threads";
import { mobile } from "../Assets/responsive";
import { requestWithoutAuth } from "../utils/requestMethods";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 40%;
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
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 20px 10px 0px 0px;
  padding: 10px;
  border: 1px solid teal;
  &:required:valid {
    border-color: green;
  }
  &:invalid {
    border-color: #ff0000;
  }
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0px;
`;

const Clink = styled.a`
  margin: 5px 0px;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
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
`;

const LogInError = styled.span`
  color: red;
  margin: 1rem;
`;

const Register = () => {
  const [error, setError] = useState("");
  const [data, setData] = useState({
    name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const router = useRouter();

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

    if (data.password !== data.confirm_password)
      return setError("Passwords do not match");

    requestWithoutAuth
      .post("/auth/register", data)
      .then((res) => res.data)
      .then((data) => {
        setError("");
        setData({
          name: "",
          last_name: "",
          username: "",
          email: "",
          password: "",
          confirm_password: "",
        });
        localStorage.setItem("access_token", data.accessToken);
        router.push("/login");
      })
      .catch((err) => {
        setError(JSON.parse(err.request.response).message);
      });
  };

  useEffect(() => {
    const timerId = setTimeout(() => setError(""), 2500);

    return () => clearTimeout(timerId);
  }, [error]);

  return (
    <Container>
      <Wrapper>
        <Title>CREATE AN ACCOUNT</Title>
        <Form>
          <Input
            name="name"
            value={data.name}
            placeholder="name"
            onChange={handleInputChange}
            required
          />
          <Input
            type="text"
            name="last_name"
            value={data.last_name}
            placeholder="last name"
            onChange={handleInputChange}
            required
          />
          <Input
            type="text"
            name="username"
            value={data.username}
            placeholder="username"
            onChange={handleInputChange}
            required
          />
          <Input
            type="email"
            name="email"
            value={data.email}
            placeholder="email"
            onChange={handleInputChange}
            required
          />
          <Input
            type="password"
            name="password"
            value={data.password}
            placeholder="password"
            onChange={handleInputChange}
            required
          />
          <Input
            type="password"
            name="confirm_password"
            value={data.confirm_password}
            placeholder="confirm password"
            onChange={handleInputChange}
            required
          />
          <Agreement>
            By creating an account, I consent to the processing of my personal
            data in accordance with the <b>PRIVACY POLICY</b>
          </Agreement>
          <ButtonDiv>
            <Button onClick={handleButtonClick}>CREATE</Button>{" "}
            {error && <LogInError>{error}</LogInError>}
            <Link href="/login">
              <Clink>SIGN IN</Clink>
            </Link>
          </ButtonDiv>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Register;
