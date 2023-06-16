import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../../Firebase/Firebase";
import Loader from "../Loader";

import logo from '../../Assets/clean.svg';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Password has to be atleast 6 characters long")
    .required("Required"),
});

const SingIn = () => {

  const [err, setErr] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const logIn = (e) => {
    setLoading(true);
    signInWithEmailAndPassword(auth, e.email, e.password)
      .then((userCredential) => {
        // Signed in
        setLoading(false);
        setErr(undefined);
        // ...
      })
      .catch((error) => {
        console.log(error);
        let errorCode = error.code;
        let errormessage = error.message;
        let errorMessage;
        if (errorCode === "auth/wrong-password") {
          errorMessage = "You have entered an invalid username or password";
        } else if (errorCode === "auth/user-not-found") {
          errorMessage = "You have entered an invalid username";
        } else if (errorCode === "auth/too-many-requests") {
          errorMessage =
            "Too many unsuccessful login attempts. Please try again later";
        } else {
          errorMessage = errormessage;
        }
        setLoading(false);
        setErr(errorMessage);
      });
  };

  return (
    <>
      {
        loading ?
          <Loader />
          :
          <div className="mx-4 w-full">
            <div className="flex justify-center w-full">
            <span className="rounded-full highlightBGColor overflow-hidden p-2 flex items-center justify-center border border-white"><img alt="" src={logo} className="h-20" /></span>
            </div>
            <div className="text-xl m-2 font-medium text-center text-white mb-6">
              Sign in
            </div>

            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={LoginSchema}
              // validator={() => ({})}
              onSubmit={(values) => {
                logIn(values);
              }}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className={`w-full flex flex-col my-2`}>
                    <label className="text-white text-sm font-medium tracking-wider mb-1">
                      Email
                    </label>
                    <Field
                      name="email"
                      placeholder="Enter Email"
                      autoComplete="on"
                      className="appearance-none block w-full bg-white text-gray-800 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    />
                    {errors.email && touched.email ? (
                      <div className="text-red-500 text-sm">{errors.email}</div>
                    ) : null}
                  </div>

                  <div className={`w-full flex flex-col my-2`}>
                    <label className="text-white text-sm font-medium tracking-wider mb-1">
                      Password
                    </label>
                    <Field
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      autoComplete="on"
                      className="appearance-none block w-full bg-white text-gray-800 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    />
                    {errors.password && touched.password ? (
                      <div className="text-red-500 text-sm">{errors.password}</div>
                    ) : null}
                  </div>

                  {err ? (
                    <div className="text-red-600 text-xm text-center">
                      {err}
                    </div>
                  ) : null}

                  <div className="w-full flex justify-between items-center mb-4 mt-2">
                    <button
                      type="submit"
                      value="submit"
                      className="w-full px-5 py-2 highlightBGColor shadow-lg hover:shadow-xl rounded inline-flex justify-center items-center"
                    >
                      <span className="text-white font-medium tracking-wider">
                        Login
                      </span>
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
      }

    </>
  );
};

export default SingIn;
