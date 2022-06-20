import { FeedDataType } from "../types/utils.type";

export const validateFeedData = (csvData: FeedDataType[]) => {
    return csvData.every((feedData: FeedDataType) => {
        return (feedData.clientId && feedData.password && feedData.username && feedData.appliedKitta && feedData.companyShareId && feedData.crnNumber && feedData.transactionPIN)
    });
}