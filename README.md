## Meroshare automate

<hr>

### This is a simple script to automate the IPO applying process without any hiccups.

## Pre-requisites

1. Setup your account credentials in `feedData.csv` file which is located at root directory of this project.

   - `clientId,username,password,crnNumber,transactionPIN`, these all are straight forward.
   - `appliedKitta`, the number of kitta you want to apply for.
   - `companyShareId`, id of the company you are applying for. This is something you get in URL when you visit the company details in meroshare (My ASBA -> Apply for Issue -> Click on the company).

2. Clone & run the project.

```
npm install
npm run start
```

3. Whola! With all these things in place, IPO should be applied from all the accounts you provided. You can see in the log itself.

<b>Note:</b> There are a whole lot of things to improve. Feel free to open a PR.
