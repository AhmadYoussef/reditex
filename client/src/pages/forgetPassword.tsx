import { Box, Button, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../util/createUrqlClient";
import NextLink from "next/link";

export const ForgetPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <>
      <Wrapper>
        <h1>Forget Password</h1>
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (values) => {
            await forgotPassword(values);
            setComplete(true);
          }}
        >
          {({ isSubmitting }) =>
            complete ? (
              <Box>
                <h1>Check Your email address</h1>
                <NextLink href={"/login"}>
                  <Link color="blueviolet">Login page</Link>
                </NextLink>
              </Box>
            ) : (
              <Form>
                <InputField
                  id={"email"}
                  label={"Email:"}
                  name={"email"}
                  placeholder={"email"}
                />

                <Button
                  mt={4}
                  type="submit"
                  isLoading={isSubmitting}
                  colorScheme="teal"
                >
                  Forget Password
                </Button>
              </Form>
            )
          }
        </Formik>
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(ForgetPassword);
