import { Flex, Heading, Input, Button, head } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import instance from "../servee";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";

function register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRepassword] = useState("");
  const [view, setView] = useState()

  const { data: session } = useSession();
  if (session) router.replace("/");

  const RegisterClick = async () => {
    try {
      const body = { username, email, password, rePassword };
      const respons = await instance.post("/user/regist", body);
      alert(respons.data.message);
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };
  return (
    <>
      <Head>
        <title>Register</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="logo-enigma.ico" />
      </Head>
      <Flex
        alignItems={"center"}
        justifyContent="center"
        bgGradient="linear(270deg, rgba(252,247,255,1) 28%, rgba(18,61,97,1) 70%, rgba(10,0,133,1) 98%)"
        p={20}
        rounded={6}
        margin={10}
        width="100%"
      >
        <Flex direction={"column"}>
          <Heading mb={5}> Register </Heading>
          <Input
            type="text"
            value={email}
            placeholder="your@mail.com"
            variant="filled"
            mb={3}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            type="text"
            value={username}
            placeholder="@UserName"
            variant="filled"
            mb={3}
            onChange={(event) => setUsername(event.target.value)}
          />
          <Flex>
          <Input
            type={view ? "text" : "password"}
            value={password}
            placeholder=" ??? ??? ??? ??? ???"
            variant="filled"
            mb={3}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button onClick={() => setView((view) => !view)}>
            {view ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
          </Button>
          </Flex>
         <Flex>
          <Input
            type={view ? "text" : "password"}
            value={rePassword}
            placeholder=" ??? ??? ??? ??? ???"
            variant="filled"
            mb={3}
            onChange={(event) => setRepassword(event.target.value)}
          />
          <Button onClick={() => setView((view) => !view)}>
            {view ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
          </Button>
          </Flex>
          <Button colorScheme="teal" onClick={RegisterClick}>
            Register
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
export default register;
