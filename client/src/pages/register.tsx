import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { useMutation } from "urql";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";

interface registerProps {}

const REGISTER_MUTATION = `
mutation Register($username: String!, $password: String!){
	register(options:{username: $username, password: $password}){
		user{
      		id
    username
    }
    errors {field message}
  }
}
`;
const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useMutation(REGISTER_MUTATION);
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => {
          console.log(values);
          return register(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              id={"username"}
              label={"Username:"}
              name={"username"}
              placeholder={"username"}
            />
            <Box mt={4}>
              <InputField
                id={"password"}
                label={"Password:"}
                name={"password"}
                placeholder={"password"}
                type="password"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
