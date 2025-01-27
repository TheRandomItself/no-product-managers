import { get } from 'http';
import express from 'express';
import GitHubService from './services/gitHubService.js'; // Adjust the path accordingly
import GptDataService from './services/gptDataService.js';
import JiraService from './services/jiraService.js';
import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createMakeScenario, executeMakeScenario, processGithubScenarios } from './services/makeService.js';

dotenv.config();
async function getGitHubData() {
    // Create an instance of GitHubService
    const gitHubService = new GitHubService();
  
    // Define the repository details

    let wantedBranch = process.env.GITHUB_WANTED_BRANCH

    const owner = process.env.GITHUB_OWNER; // Replace with the GitHub repository owner
    const repo = process.env.GITHUB_REPO;        // Replace with the repository name
    const email = process.env.GITHUB_EMAIL
    const branch = wantedBranch;                // Replace with the branch name if needed (default: 'main')
  
    try {
      // Call the getLastCommit function

      let commitListData = await gitHubService.getAllCommitsData(owner, repo);
      let commitListDataByUser = await gitHubService.getAllUserCommitsDataBetweenTimes(owner, repo, email)
      console.log('the commitListDataByUser is: ')
      console.log(commitListDataByUser)
      // console.log("the commitListData is: ");
      // console.log(commitListData)

      // const commitData = await gitHubService.getLastCommit(owner, repo, branch);
      // console.log("the commitData is: ")
      // console.log(commitData)
  
      // const commitChanges = await gitHubService.getCommitChanges(owner, repo, commitData)
      // console.log("the commitChanges are: ")
      // console.log(commitChanges)
      // return commitListData
      return commitListDataByUser

    } catch (error) {
      console.error('Error fetching the last commit:', error);
    }
  }

  async function getGptData() {
    // Create an instance of gptDataService
    const gptDataService = new GptDataService();
  
    try {
      const lastGptFileData = await gptDataService.getLatestFile();
      // console.log("the lastGprtFiileData is: ")
      // console.log(lastGptFileData)
      // Call the getLastCommit function
      return lastGptFileData

    } catch (error) {
      console.error('Error fetching the last gpt file extenstion data:', error);
    }
  }

  async function getJiraData() {
    // console.log("entered getJiraData function")
    // Create an instance of gptDataService
    const jiraService = new JiraService();
  
    try {
      const issuesData = await jiraService.processIssues();
      // console.log("the issuesData is: ")
      // console.log(issuesData)
      // Call the getLastCommit function
      return issuesData

    } catch (error) {
      console.error('Error fetching the jira issues data:', error);
    }
  }
  
  async function createGptData() {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const databaseId = '155cdf31bd9a8024a3aecd4b294660c6';
    const response = await notion.databases.query({ database_id: databaseId });

    // Extract and format the data for the console
    const tableData = response.results.map((page) => ({
      TaskName: page.properties.Name?.title[0]?.text?.content || 'No Name',
      Priority: page.properties.Priority?.select?.name || 'No Priority',
      Status: page.properties.Status?.select?.name || 'No Status',
    }));

    // Log the data in a table format
    console.table(tableData);
    let outputDataObject = {}
    //  let gitHubData = await getGitHubData();
    //  let gptData = await getGptData();
    //  let jiraData = await getJiraData();
    //  let makeData = await processGithubScenarios();

    //  outputDataObject["gitHubData"] = gitHubData
    //  outputDataObject["gptData"] = gptData
    //  outputDataObject["jiraData"] = jiraData
    //  console.log("the outputDataObject is: ")
    //  console.log(outputDataObject)

     return outputDataObject;
  }
  // Run the main function
  createGptData()

const app = express();
const port = process.env.PORT || 3000;
const gptDataOutputPath = process.env.MODEL_DATA_OUTPUT

app.get('/api/createGptData', async (req, res) => {
    try {
        const responseData = await createGptData();

        // Save the response to a file
        const filePath = path.join(gptDataOutputPath, `gptData_${Date.now()}.json`);
        // console.log("the filePath is: ", filePath)
        fs.writeFileSync(filePath, JSON.stringify(responseData, null, 2), 'utf8');

        res.json(responseData);
    } catch (error) {
        console.error("Error in createGptData:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


// (async () => {
//   const githubApiKeys = ["key1", "key2", "key3"]; // Replace with actual keys
//   const getNextGithubApiKey = () => githubApiKeys.shift(); // Example implementation

//   await processGithubScenarios();
// })();
 