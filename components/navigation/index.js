import {
  Box,
  Button,
  Stack,
  VStack,
  HStack,
  Text,
  Flex,
  Link,
  Input,
  Icon,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

function Navigation() {
  const { data: session } = useSession();

  const onLogoutClick = async () => {
    await signOut();
  };

  return (
    <Box
      width="100%"
      mx="auto"
      height="10vh"
      boxShadow={"lg"}
      bg="rgba(252,247,255,1)"
      //bgGradient="linear(270deg, rgba(252,247,255,1) 28%, rgba(18,61,97,1) 70%, rgba(10,0,133,1) 98%)"
      paddingLeft={10}
      paddingRight={10}
      rounded={6}
    >
      <HStack display={"flex"} justifyContent="space-between">
        <Flex display={"flex"} gap="50px">
          {!session && (
            <>
              <Image
                src="/logo-enigma.ico"
                alt="Vercel Logo"
                width={"50%"}
                height={"35%"}
              />
            </>
          )}
          {session && (
            <>
              <NextLink href="/">
                <Link>
                  <Image
                    src="/logo-enigma.ico"
                    alt="Vercel Logo"
                    width={"100%"}
                    height={"100%"}
                  />
                </Link>
              </NextLink>
              <Input
                type="text"
                value={""}
                placeholder="✎Search"
                variant="filled"
                width="250%"
                mr={"20px"}
                mb={"10px"}
                justifyContent="center"
              />
            </>
          )}
        </Flex>
        <Flex>
          {!session && (
            <>
              <NextLink href="/login">
                <Button variant="ghost" mt={5} w="100%">
                  Login
                </Button>
              </NextLink>
              <NextLink href="/regist">
                <Button variant="ghost" my={5} w="100%">
                  Register
                </Button>
              </NextLink>
            </>
          )}

          {session && (
            <>
              <NextLink href="/login">
                <Button onClick={onLogoutClick} variant="ghost" my={5} w="100%">
                  Logout
                </Button>
              </NextLink>
              <NextLink href={"/profile"}>
                <Button variant="ghost" my={5} w="100%">
                  Hello, {session?.user.username}
                </Button>
              </NextLink>
            </>
          )}
        </Flex>
      </HStack>
    </Box>
  );
}

export default Navigation;
