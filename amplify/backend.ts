import { defineBackend } from "@aws-amplify/backend";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";

const backend = defineBackend({
  auth,
  data,
});

const bedrockDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
  "bedrockDS",
  "https://bedrock-runtime.us-west-2.amazonaws.com",
  {
    authorizationConfig: {
      signingRegion: "us-west-2",
      signingServiceName: "bedrock",
    },
  }
);

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    resources: [
      "arn:aws:bedrock:us-west-2::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
    ],
    actions: ["bedrock:InvokeModel"],
  })
);
