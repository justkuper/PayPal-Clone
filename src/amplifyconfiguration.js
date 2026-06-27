// Replace the values below with your real Amplify project outputs
// Run `npx ampx sandbox` or `amplify push` to generate amplify_outputs.json
// then import and pass it to Amplify.configure()

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: "YOUR_USER_POOL_ID",
      userPoolClientId: "YOUR_USER_POOL_CLIENT_ID",
      identityPoolId: "YOUR_IDENTITY_POOL_ID",
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: { required: true },
        name: { required: true },
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: false,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: "YOUR_GRAPHQL_ENDPOINT",
      region: "us-east-1",
      defaultAuthMode: "userPool",
    },
  },
};

export default amplifyConfig;
