import React from "react";
import { Box, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  return (
    <Flex bg="tomato" p={4} ml={"auto"}>
      <Box ml={"auto"}>
        <NextLink href="/login">
          <Link mr={4}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </Box>
    </Flex>
  );
};
