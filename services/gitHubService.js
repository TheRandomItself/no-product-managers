// const express = require('express');
// const https = require('https');
// const axios = require('axios');
import { Octokit } from "@octokit/rest";
import axios from 'axios';
// const { Octokit } = require("@octokit/rest");

import dotenv from 'dotenv';

class gitHubService {

constructor() {
    this.octokit = new Octokit({
        auth: process.env.GITHUB_API_TOKEN, // enter your gitHub token here
      });
    this.wantedBranch = 'branch_for_testing'
}

async getCommitChanges(owner, repo, commit) {
  const response = await this.octokit.rest.repos.getCommit({
    owner,
    repo,
    ref: commit.sha,
  });

  console.log(response.data.files); // List of changed files
  let message =  response.data.files.map(file => {
    return {"filename": file.filename, "file_patch": file.patch, "commit_message": commit.commit.message}
  })
  return message
}

async getLastCommit(owner, repo, branch = 'master') {
  try {
    // Get repository details to determine the default branch
    const { data: repoDetails } = await this.octokit.rest.repos.get({
      owner,
      repo,
    });

    // const defaultBranch = repoDetails.default_branch;
    const defaultBranch = branch

    // Fetch the latest commit on the default branch
    const { data: commits } = await this.octokit.rest.repos.listCommits({
      owner,
      repo,
      sha: defaultBranch,
      per_page: 1, // Limit to 1 commit
    });
    return commits[0]
  } catch (error) {
    console.error("Error fetching last commit:", error);
  }
}

async getCommitList(owner, repo, branch = "master", perPage = 10) {
  try {
    const { data: commits } = await this.octokit.rest.repos.listCommits({
      owner,
      repo,
      sha: branch, // Specify the branch (default is "main")
      per_page: perPage, // Number of commits to fetch per page
    });

    console.log("Commit List:");
    commits.forEach(commit => {
      console.log(`- ${commit.sha}: ${commit.commit.message}`);
    });

    return commits; // Return the list of commits
  } catch (error) {
    console.error("Error fetching commit list:", error);
  }
}

async getFileContent(owner, repo, filePath, branch = "master") {
  try {
    // Fetch file content from the repository
    const { data } = await this.octokit.rest.repos.getContent({
      owner,
      repo,
      path: filePath,  // The path to the file in the repo (e.g., 'src/app.js')
      ref: branch,     // The branch (default is 'main')
    });

    // Check if the file is base64 encoded
    const content = Buffer.from(data.content, 'base64').toString('utf-8');

    console.log("File Content:");
    console.log(content); // This will print the content of the file

    return content; // Return the file content
  } catch (error) {
    console.error("Error fetching file content:", error);
  }
}

async getLastCommitData(owner, repo, branch) {
  let lastCommit = getLastCommit(owner, repo, branch)
  let commitChanges = getCommitChanges(owner, repo, lastCommit)
  return commitChanges
}

 // change this to the branch you want to get the data from
}

export default gitHubService;