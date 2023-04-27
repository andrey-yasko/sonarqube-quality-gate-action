import { Context } from "@actions/github/lib/context";
import { Condition, QualityGate } from "./models";
import {
  formatMetricKey,
  getStatusEmoji,
  getComparatorSymbol,
  trimTrailingSlash,
  formatStringNumber,
  getCurrentDateTime,
} from "./utils";

const buildRow = (condition: Condition) => {
  const rowValues = [
    formatMetricKey(condition.metricKey), // Metric
    getStatusEmoji(condition.status), // Status
    formatStringNumber(condition.actualValue), // Value
    `${getComparatorSymbol(condition.comparator)} ${condition.errorThreshold}`, // Error Threshold
  ];

  return "|" + rowValues.join("|") + "|";
};

export const buildReport = (
  result: QualityGate,
  hostURL: string,
  projectKey: string,
  context: Context,
  pullRequestNumber?: number | null
) => {
  const pullRequestString = pullRequestNumber != null ? `&pullRequest=${pullRequestNumber}` : '';
  const projectURL = `${trimTrailingSlash(hostURL)}/summary/new_code?id=${projectKey}${pullRequestString}`;
  const projectStatus = getStatusEmoji(result.projectStatus.status);

  const resultTable = result.projectStatus.conditions.map(buildRow).join("\n");

  const { value: updatedDate, offset: updatedOffset } = getCurrentDateTime();

  const reportHeader = `- **Result**: ${projectStatus}\n- Triggered by @${context.actor} on \`${context.eventName}\`${pullRequestNumber != null ? `\n- Pull request number: ${pullRequestNumber}` : ''}`;

  return `### Sonar Qube Quality Gate Result
${reportHeader}

| Metric | Status | Value | Error Threshold |
|:------:|:------:|:-----:|:---------------:|
${resultTable}

[View on SonarCloud](${projectURL})
###### _updated: ${updatedDate} (${updatedOffset})_`;
};