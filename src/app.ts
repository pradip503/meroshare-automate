import csv from "csvtojson";
import { FeedDataType } from "./types/utils.type";
import { axiosInstance, setAuthorization } from "./utils/axiosConfig";
import { validateFeedData } from "./utils/validateFeedData";

const importFeedData = async () => {

    try {
        const csvData: FeedDataType[] = await csv()
            .fromFile(`feedData.csv`);

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

const loginUser = async ({ clientId, username, password }: {
    clientId: string,
    username: string,
    password: string
}) => {
    return axiosInstance.post('auth', { clientId, username, password });
};

const initiateProcess = async () => {
    try {

        // Imports data from CSV
        console.info("Importing data......");
        const feedInData: FeedDataType[] = await importFeedData();
        console.info("Success!");

        // Logins the user
        for (let i = 0; i < feedInData.length; i++) {

            console.info("Logging the user in......");
            const { clientId, username, password, appliedKitta, companyShareId, crnNumber, transactionPIN } = feedInData[i];
            const { headers, status, data } = await loginUser({ clientId, username, password });
            if (status === 200) {
                await setAuthorization(headers["authorization"]);
                console.info("Success!");
            }

            console.info("Getting own details......");
            const { data: ownDetail } = await axiosInstance.get('ownDetail');
            const { boid, demat, name } = ownDetail;
            console.info("Success!")

            console.info("Getting bank list....")
            const { data: banks } = await axiosInstance.get('bank')
            console.info("Success!")

            console.info("Getting bank details....")
            const { data: bankDetails } = await axiosInstance.get(`bank/${banks[0].id}`);
            const { accountBranchId, accountNumber, bankId, id: customerId } = bankDetails;
            console.info("Success!")

            console.info(`Applying IPO for ${name}....`)
            const { data: appliedResponse } = await axiosInstance.post(`applicantForm/share/apply`, {
                accountBranchId, accountNumber, appliedKitta, bankId, boid, companyShareId, crnNumber, customerId, demat, transactionPIN
            });
            console.log(appliedResponse);
            console.info("Success!")
        }

    } catch (error) {
        console.error(error.response.data.message || error.request.data.message || error);
    }
};


initiateProcess();