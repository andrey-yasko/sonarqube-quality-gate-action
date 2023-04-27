import axios from "axios";
import { QualityGate } from "./models";

export const fetchQualityGate = async (
  url: string,
  projectKey: string,
  token: string,
  pullRequestNumber?: number | null
): Promise<QualityGate> => {
  const params = {
    projectKey,
    ...(pullRequestNumber != null && { pullRequest: pullRequestNumber }),
  };
  const response = await axios.get<QualityGate>(
    `${url}/api/qualitygates/project_status`,
    {
      params,
      auth: {
        username: token,
        password: "",
      },
    }
  );

  return response.data;
};