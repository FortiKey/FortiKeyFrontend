import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Navbar from "../global/Navbar";

const CreateUser = () => {
  const handleFormSubmit = (values) => {
    console.log(values);
  };

  return (
    <Box>
      <Navbar />
      <Box
        sx={{
          paddingTop: "40px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          width="500px"
          sx={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "10px",
            boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h2"
            color="#007BFF"
            fontWeight="bold"
            sx={{ mb: "40px", textAlign: "center" }}
          >
            Create Account
          </Typography>
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap="30px">
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    label="Full Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.fullName}
                    name="fullName"
                    error={!!touched.fullName && !!errors.fullName}
                    helperText={touched.fullName && errors.fullName}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="password"
                    label="Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="password"
                    label="Confirm Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.confirmPassword}
                    name="confirmPassword"
                    error={
                      !!touched.confirmPassword && !!errors.confirmPassword
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    label="Company Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.companyName}
                    name="companyName"
                    error={!!touched.companyName && !!errors.companyName}
                    helperText={touched.companyName && errors.companyName}
                  />
                  <Box display="flex" justifyContent="center" mt="20px">
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: "#007BFF",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#0056b3",
                        },
                      }}
                    >
                      Create New User
                    </Button>
                  </Box>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  fullName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("required"),
  companyName: yup.string().required("required"),
});

const initialValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  companyName: "",
};

export default CreateUser;
