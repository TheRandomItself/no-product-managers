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
    }


    async createNotionData(databaseId) {
        const notion = new Client({ auth: this.notionApiToken });
        const response = await notion.databases.query({ database_id: databaseId });
    
        // Extract and format the data for the console
        response.results.forEach(page => {
          console.log('the page is: ')
          console.log(page)
        })
        const tableData = response.results.map((page) => (
          {
            TaskNameReal: page.properties['Task name'].title[0]?.plain_text,
            Priority: page.properties.Priority?.select || 'No Priority',
            Status: page.properties.Status.status || 'No Status',
            Summary: page.properties.Summary.rich_text[0]?.plain_text || 'No Summary',
            Due: page.properties.Due.date || 'No Due',
            Assignee: page.properties.Assignee.people[0]?.name || 'No Assignee',
            Tags: page.properties.Tags.multi_select[0]?.name || 'No Tags',

        }));
    

        return tableData
      }
}

export default NotionService;