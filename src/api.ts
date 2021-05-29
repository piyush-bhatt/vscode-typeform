import axios from "axios";
import { getTypeformToken } from "./utils";

const BASE_URL = "https://api.typeform.com";

let typeformAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: { Authorization: `Bearer ${getTypeformToken()}` },
});

export const updateTypeformAPIAuth = () => {
  typeformAPI = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: { Authorization: `Bearer ${getTypeformToken()}` },
  });
};

export const getForms = async () => {
  try {
    const res = await typeformAPI.get(`/forms`);
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getFormInsights = async (id: string) => {
  try {
    const res = await typeformAPI.get(`/insights/${id}/summary`);
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getFormResponses = async (id: string) => {
  try {
    const res = await typeformAPI.get(`/forms/${id}/responses`);
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    throw error;
  }
};
