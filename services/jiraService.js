// const https = require('https');
// const axios = require('axios');
import { Octokit } from "@octokit/rest";
import axios from 'axios';
// const { Octokit } = require("@octokit/rest");

import dotenv from 'dotenv';
dotenv.config();

class JiraService {
constructor(){
    this.baseUrl = process.env.JIRA_BASE_URL
    this.email = process.env.JIRA_EMAIL;
    this.apiToken = process.env.JIRA_API_TOKEN;
    console.log("the jira api token is: ", this.apiToken);
}
// Function to fetch issues
async getIssues() {
    console.log("entered getIssues in jiraService")
    const url = `${this.baseUrl}/rest/api/3/search`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${this.email}:${this.apiToken}`).toString('base64')}`,
                'Content-Type': 'application/json'
            }
        });

        // console.log('Issues:', response.data.issues);
        return response.data

    } catch (error) {
        console.error('Error fetching issues:', error.response ? error.response.data : error.message);
    }
};

getCommitsForIssue = async (issueId) => {
  try {
      const response = await axios.get(
          `${baseUrl}/rest/dev-status/1.0/issue/detail`,
          {
              params: {
                  issueId: issueId,
                  applicationType: 'bitbucket',
                  dataType: 'repository',
              },
              auth: {
                  username: this.email,
                  password: this.apiToken,
              },
              headers: {
                  'Accept': 'application/json',
              },
          }
      );

      const details = response.data.detail || [];
      for (const detail of details) {
          const repositories = detail.repositories || [];
          for (const repo of repositories) {
              console.log(`Repository: ${repo.name}`);
              for (const commit of repo.commits) {
                  console.log(`Commit ID: ${commit.id}`);
                  console.log(`Message: ${commit.message}`);
                  console.log(`Author: ${commit.author.name}`);
                  console.log(`commit branch: ${commit.branch}`);
              }
          }
      }
  } catch (error) {
      console.error('Error fetching commits:', error.response?.data || error.message);
  }
};

getCommitsAndBranchesForIssue = async (issueId) => {
  try {
      const response = await axios.get(
          `${baseUrl}/rest/dev-status/1.0/issue/detail`,
          {
              params: {
                  issueId: issueId,
                  applicationType: 'bitbucket',
                  dataType: 'repository',
              },
              auth: {
                  username: this.email,
                  password: this.apiToken,
              },
              headers: {
                  'Accept': 'application/json',
              },
          }
      );

      const details = response.data.detail || [];
      for (const detail of details) {
          const repositories = detail.repositories || [];
          for (const repo of repositories) {
              console.log(`Repository: ${repo.name}`);

              // Display branch details
              if (repo.branches && repo.branches.length > 0) {
                  console.log('Branches:');
                  for (const branch of repo.branches) {
                      console.log(`  - Branch Name: ${branch.name}`);
                      console.log(`    Last Commit ID: ${branch.lastCommit || 'N/A'}`);
                  }
              }

              // Display commit details
              if (repo.commits && repo.commits.length > 0) {
                  console.log('Commits:');
                  for (const commit of repo.commits) {
                      console.log(`  - Commit ID: ${commit.id}`);
                      console.log(`    Message: ${commit.message}`);
                      console.log(`    Author: ${commit.author.name}`);
                  }
              }
          }
      }
  } catch (error) {
      console.error('Error fetching commits and branches:', error.response?.data || error.message);
  }
};
// async getCommitList(owner, repo, branch = "master", perPage = 10) {
async processIssues() {
  try {
      const data = await this.getIssues(); // Fetch the data
      const issues = data.issues;

      // Process the issues
      console.log(`Found ${issues.length} issues.`);

    issues.forEach(async (issue, index) => {
        console.log(`the issue summary is: ${issue.fields.summary} - id is: ${issue.id} key is: ${issue.key} the assignee is: ${issue.fields.assignee}`);
        console.log()
          console.log(`${index + 1}: ${issue.key} - ${issue.fields.summary} - ${issue.fields.status.name}`);
      });

    return issues.map(issue => {
        return ` issue summary: ${issue.fields.summary} - id is: ${issue.id} key is: ${issue.key} the assignee is: ${issue.fields.assignee? issue.fields.assignee.displayName : "issue has no assignee"} the creator: ${issue.fields.creator.displayName}`
    })

  } catch (error) {
      console.error('Error processing issues:', error.message);
  }
}

// Function to get commits for a specific issue


// Call the function
// processIssues();

}
export default JiraService;