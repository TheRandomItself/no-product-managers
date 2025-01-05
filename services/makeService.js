import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Make.com API Key
const makeApiKey =  process.env.MAKE_API_TOKEN;

// Make.com API Base URL
const makeApiBaseUrl = 'https://eu2.make.com/api/v2/';

function getNextGithubApiKey() {
    const key = process.env.GITHUB_API_TOKEN
    return key;
  }

export async function getMakeScenarios(){
    // const response = await axios.post(`${makeApiBaseUrl}scenarios`)
    try {
        const response = await axios.post(`${makeApiBaseUrl}scenarios?organizationId=2632083`, {
          headers: {
            Authorization: `Bearer ${process.env.MAKE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
    
        console.log(`got scenario: ${response.data}`);
        return response.data;
      } catch (error) {
        console.error('Error creating scenario:', error.message);
        throw error;
      }
}

export async function createMakeScenario(name, githubApiKey) {
    const scenarioData = {
      name: name,
      modules: [
        {
          module: 'github',
          action: 'ListRepositories',
          params: {
            apiKey: githubApiKey,
          },
        },
      ],
    };
  
    try {
      const response = await axios.post(`${makeApiBaseUrl}scenarios`, scenarioData, {
        headers: {
          Authorization: `Bearer ${process.env.MAKE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log(`Scenario Created: ${response.data.id}`);
      return response.data;
    } catch (error) {
      console.error('Error creating scenario:', error.message);
      throw error;
    }
  }

  export async function executeMakeScenario(scenarioId) {
    try {
      const response = await axios.post(`${makeApiBaseUrl}scenarios/${scenarioId}/executions`, {}, {
        headers: {
          Authorization: `Bearer ${process.env.MAKE_API_TOKEN}`,
        },
      });
  
      console.log('Scenario Executed:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error executing scenario:', error.message);
      throw error;
    }
  }


//   (async () => {
//     for (let i = 0; i < githubApiKeys.length; i++) {
//       const apiKey = getNextGithubApiKey();
  
//       console.log(`Using GitHub API Key: ${apiKey}`);
  
//       // Create a new scenario
//       const scenario = await createMakeScenario(`Fetch GitHub Data ${i + 1}`, apiKey);
  
//       // Execute the scenario
//       const execution = await executeMakeScenario(scenario.id);
  
//       console.log(`Scenario ${i + 1} Execution Result:`, execution);
  
//       // Optional: Pause between executions to avoid rate limits
//       await new Promise(resolve => setTimeout(resolve, 5000));
//     }
//   })();

  export async function processGithubScenarios(pauseDuration = 5000) {
    console.log('entered processGithubScenarios')
    const apiKey = getNextGithubApiKey();

    await getMakeScenarios()
    console.log(`Using GitHub API Key: ${apiKey}`);

    // const getScenatio = await getMakeScenatio()
    // Create a new scenario
    const scenario = await createMakeScenario(`Fetch GitHub Data`, apiKey);

    // Execute the scenario
    const execution = await executeMakeScenario(scenario.id);

    console.log(`Scenario ${i + 1} Execution Result:`, execution);

    // Optional: Pause between executions to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, pauseDuration));
}