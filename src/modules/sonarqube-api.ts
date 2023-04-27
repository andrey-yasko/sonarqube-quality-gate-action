import axios from "axios";
import { QualityGate } from "./models";
import { trimTrailingSlash } from "./utils";

export const fetchQualityGate = async (
  url: string,
  projectKey: string,
  token: string,
  pullRequestNumber?: number | null
): Promise<QualityGate> => {
  const queryString = pullRequestNumber != null ? `?projectKey=${projectKey}&pullRequest=${pullRequestNumber}` : `?projectKey=${projectKey}`;
  const targetUrl = `${trimTrailingSlash(url)}/api/qualitygates/project_status${queryString}`;
  console.log(`Target URL: ${targetUrl}`);
  const response = await axios.get<QualityGate>(
    targetUrl,
    {
      auth: {
        username: token,
        password: "",
      },
    }
  );

  return response.data;
};