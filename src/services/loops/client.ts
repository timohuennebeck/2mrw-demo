"use server";

import { emailConfig } from "@/config/emailConfig";
import axios from "axios";

export const loopsClient = axios.create({
    baseURL: emailConfig.baseUrl,
    headers: {
        Accept: "application/json",
        Authorization: `Bearer ${emailConfig.apiKey}`,
        "Content-Type": "application/json",
    },
});
