import { Flex, Button, Heading, Input, Box, Link } from "@chakra-ui/react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";

function login() {
  // formLog : {email, }
  const [email, setEmaillog] = useState("");
  const [pass, setPasslog] = useState("");
  const router = useRouter();
  const [loginProcess, setloginProcess] = useState(false);

  const loginClick = async () => {
    try {
      setloginProcess(true);
      const respons = await signIn("credentials", {
        redirect: false,
        email,
        pass,
      });

      if (!respons.error) {
        router.replace("/");
      } else {
        alert(respons.error);
      }
      // setloginProcess;
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
    // setTimeout(() => {
    //   setloginProcess(false);
    // }, 5000);
    setloginProcess(false);
  };

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="logo-enigma.ico" />
      </Head>
      <Flex
        display={"flex"}
        direction="row"
        height="85vh"
        alignItems="center"
        justifyContent="space-evenly"
        bgGradient="linear(270deg, rgba(252,247,255,1) 28%, rgba(18,61,97,1) 70%, rgba(10,0,133,1) 98%)"
        width={"100%"}
        m={5}
        rounded={6}
      >
        <Image
          objectFit="cover"
          src="/wer.png"
          width={500}
          height={560}
          alt="enigma"
        />

        <Flex direction="column" p={20} rounded={6} margin={20}>
          <Heading mb={6} as="i">
            Login Again
          </Heading>
          <Input
            type="text"
            value={email}
            placeholder="your@mail.com"
            variant="filled"
            mb={3}
            onChange={(event) => setEmaillog(event.target.value)}
          />
          <Input
            type="password"
            value={pass}
            placeholder="password"
            variant="filled"
            mb={6}
            onChange={(event) => setPasslog(event.target.value)}
          />
          <Button
            isLoading={loginProcess}
            colorScheme="teal"
            onClick={loginClick}
          >
            Login
          </Button>
          <Box fontWeight="bold" p="1rem" alignItems="center">
            New to us?{" "}
            <Link color="teal.500" href="/regist">
              Register
            </Link>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}

export default login;
