import axios from 'axios';
import { Client } from '@notionhq/client';
// const { Octokit } = require("@octokit/rest");

import dotenv from 'dotenv';
dotenv.config();

class NotionService {
    constructor(){
        this.baseUrl = process.env.JIRA_BASE_URL
        this.email = process.env.JIRA_EMAIL;
        this.notionApiToken = process.env.NOTION_API_KEY;
        // console.log("the jira api token is: ", this.apiToken);
    }


    async createNotionData(databaseId) {
        const notion = new Client({ auth: this.notionApiToken });
        const response = await notion.databases.query({ database_id: databaseId });
    
        // Extract and format the data for the console
        const tableData = response.results.map((page) => ({
          TaskName: page.properties.Name?.title[0]?.text?.content || 'No Name',
          Priority: page.properties.Priority?.select?.name || 'No Priority',
          Status: page.properties.Status?.select?.name || 'No Status',
        }));
    
        // Log the data in a table format
        // console.table(tableData);
        return tableData
        // let outputDataObject = {}

        //  let gitHubData = await getGitHubData();
        //  let gptData = await getGptData();
        //  let jiraData = await getJiraData();
        //  let makeData = await processGithubScenarios();
    
        //  outputDataObject["gitHubData"] = gitHubData
        //  outputDataObject["gptData"] = gptData
        //  outputDataObject["jiraData"] = jiraData
        //  console.log("the outputDataObject is: ")
        //  console.log(outputDataObject)
    
        //  return outputDataObject;
      }
}

export default NotionService;