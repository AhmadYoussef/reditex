import { Box, Button, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { createUrqlClient } from "../util/createUrqlClient";
import { toErrorMap } from "../util/toErrorMap";
import NextLink from "next/link";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          const response = await login(values);

          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              id={"usernameOrEmail"}
              label={"Username or Email:"}
              name={"usernameOrEmail"}
              placeholder={"usernameOrEmail"}
            />
            <Box mt={4}>
              <InputField
                id={"password"}
                label={"Password:"}
                name={"password"}
                placeholder={"password"}
                autoComplete="username"
                type="password"
              />
            </Box>
            <Box textAlign={"right"}>
              <NextLink href="/forgetPassword">
                <Link ml="auto" color="blue">
                  Forget Password
                </Link>
              </NextLink>
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
