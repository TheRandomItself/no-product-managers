# Running the project:
First run:
num install

create .env in the root directory with the following content:
########################################################################
PORT=3008
JIRA_API_TOKEN='[your jira api token]'
JIRA_EMAIL='[jira email]'
JIRA_BASE_URL='[your jira base url for example: https://yourcompany.atlassian.net]'

GITHUB_API_TOKEN='[your github api token]'
GITHUB_OWNER='[your github username]'
GITHUB_WANTED_BRANCH='[the branch you want to check for example: master]'
GITHUB_REPO='[name of the github repository]'

GPT_DATA_FOLDER='[the folder of the chatgpt extension files]'
MODEL_DATA_OUTPUT='[the folder you want to put the output files of the data manager for example: C:/Users/user/gptDataoutput]'
########################################################################

and finally run:
npm start


like, subscribe and hit that bell