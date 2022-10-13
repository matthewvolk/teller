import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const sandboxConfig = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const PlaidService = {
  sandboxClient: new PlaidApi(sandboxConfig),
};

export {
  AccountsGetRequest,
  AccountsGetResponse,
  CountryCode,
  InstitutionsGetByIdRequest,
  ItemGetRequest,
  ItemPublicTokenExchangeRequest,
  LinkTokenCreateRequest,
  Products,
  SandboxPublicTokenCreateRequest,
} from 'plaid';

export default PlaidService;
