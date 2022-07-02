import axios, { AxiosInstance } from "axios";
import csv from "csvtojson";
import { FeedDataType } from "./types/utils.type";
import { axiosInstance, createAuthAxiosInstance } from "./utils/axiosConfig";
import { validateFeedData } from "./utils/validateFeedData";

const importFeedData = async () => {
  try {
    const csvData: FeedDataType[] = await csv().fromFile(`feedData.csv`);

    if (csvData.length < 1) {
      throw new Error("No data provided!");
    }

    if (!validateFeedData(csvData)) {
      throw new Error("Invalid feed data!");
    }
    return csvData;
  } catch (error) {
    throw error;
  }
};

const loginUser = async ({
  clientId,
  username,
  password,
}: {
  clientId: string;
  username: string;
  password: string;
}) => {
  try {
    return axiosInstance.post("auth", { clientId, username, password });
  } catch (error) {
    console.log(error);
  }
};

const initiateProcess = async () => {
  try {
    let authAxiosInstance: AxiosInstance = null;
    // Imports data from CSV
    console.info("Importing data......");
    const feedInData: FeedDataType[] = await importFeedData();
    console.info("Success!");

    // Logins the user
    for (let i = 0; i < feedInData.length; i++) {
      console.info("Logging the user in......");
      const {
        clientId,
        username,
        password,
        appliedKitta,
        companyShareId,
        crnNumber,
        transactionPIN,
      } = feedInData[i];

      console.log("Logging the user in.....");
      const { headers, status } = await loginUser({
        clientId,
        username,
        password,
      });
      if (status === 200) {
        authAxiosInstance = createAuthAxiosInstance(headers["authorization"]);
        console.info("Success!");
      }
      console.info("Getting own details......");
      const { data: ownDetail } =
        authAxiosInstance && (await authAxiosInstance.get("ownDetail"));
      const { boid, demat, name } = ownDetail;
      console.info("Success!");

      console.info("Getting bank list....");
      const { data: banks } =
        ownDetail && (await authAxiosInstance.get("bank"));
      console.info("Success!");

      console.info("Getting bank details....");
      const { data: bankDetails } =
        banks && (await authAxiosInstance.get(`bank/${banks[0].id}`));
      const {
        accountBranchId,
        accountNumber,
        bankId,
        id: customerId,
      } = bankDetails;
      console.info("Success!");

      console.info(`Applying IPO for ${name}....`);
      const { data: appliedResponse } =
        bankDetails &&
        (await authAxiosInstance.post(`applicantForm/share/apply`, {
          accountBranchId,
          accountNumber,
          appliedKitta,
          bankId,
          boid,
          companyShareId,
          crnNumber,
          customerId,
          demat,
          transactionPIN,
        }));
      console.log(appliedResponse);
      console.info("Success!");
    }
  } catch (error) {
    console.error(
      error.response.data.message || error.request.data.message || error
    );
  }
};

initiateProcess();
