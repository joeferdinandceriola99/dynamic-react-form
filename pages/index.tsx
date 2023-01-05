import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import {
  Typography,
  Container,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import getConfig from "next/config";
import DynamicInput from "../components/inputs/DynamicInput";

const inter = Inter({ subsets: ["cyrillic"] });
const { publicRuntimeConfig } = getConfig();

interface FormField {
  fieldName: string;
  type: string;
  value: string;
  options: Array<string>;
}

interface FormBody {
  firstName: string;
  lastName: string;
  emailAddress: string;
  gender: string;
  age: number;
  testimonial: string;
}

export default function Home() {
  const [forms, setForms] = useState<FormField[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);

  const [prompt, setPrompt] = useState({
    type: "",
    message: "",
  });

  const getForms = async () => {
    try {
      const res = await axios.get(publicRuntimeConfig.API_URI + "/api/form");

      const formFields: FormField[] = res?.data?.data;

      setForms(formFields);
    } catch (error) {
      console.log(error, "err");
    }
  };

  useEffect(() => {
    getForms();
  }, []);

  const submitForm = async () => {
    setDisabled(true);
    let body: any = {};
    forms.forEach((item) => {
      body[item.fieldName] = item.value;
    });
    try {
      const { data } = await axios.post(
        publicRuntimeConfig.API_URI + "/api/form",
        body
      );
      setPrompt({
        type: "success",
        message: data.message,
      });
      setTimeout(() => {
        setPrompt({
          type: "",
          message: "",
        });
      }, 5000);
    } catch (error: any) {
      let errMessage = "";
      if (error.response) {
        errMessage = error.response.data.message;
      } else {
        errMessage = "Something went wrong";
      }
      setPrompt({
        type: "error",
        message: errMessage,
      });
      setTimeout(() => {
        setPrompt({
          type: "",
          message: "",
        });
      }, 5000);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <>
      <Head>
        <title>Dynamic Form</title>
      </Head>

      <Container
        maxWidth="md"
        sx={{
          minHeight: "100vh",
          margin: "0 auto",
          padding: 5,
        }}
      >
        <Typography component="h1" variant="h4" textAlign="center">
          Dynamic Form
        </Typography>
        <Stack gap={2} marginY={4}>
          {forms.map((field, index) => (
            <DynamicInput
              key={index}
              type={field?.type}
              name={field.fieldName}
              label={field.fieldName}
              value={field.value}
              options={field.options}
              onChange={(e: any) =>
                setForms((prev) => {
                  return prev.map((item) => {
                    if (item.fieldName === field.fieldName) {
                      item.value = e.target.value;
                    }
                    return item;
                  });
                })
              }
              disabled={disabled}
            />
          ))}
          <Button disabled={disabled} onClick={submitForm} variant="contained">
            Submit
          </Button>
        </Stack>
        <Dialog open={!!prompt.type} fullWidth maxWidth="sm">
          <DialogTitle
            textTransform="capitalize"
            color={prompt.type === "error" ? "red" : "green"}
          >
            {prompt.type}
          </DialogTitle>
          <DialogContent>
            <Typography>{prompt.message}</Typography>
          </DialogContent>
          <DialogActions>
            <Stack direction={"row"}>
              <Button
                variant="contained"
                onClick={(e) => setPrompt({ type: "", message: "" })}
              >
                Okay
              </Button>
            </Stack>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
