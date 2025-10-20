import * as z from 'zod';
import { ChatOpenAI } from '@langchain/openai';
import { createAgent, tool } from 'langchain';

const fetchWeather = async (location) => {
  return {
    location,
    temp: '20C',
    wind: 12,
  };
};

const model = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
});

const weatherTool = tool(
  async ({ location }) => {
    const data = await fetchWeather(location);
    return `The temparature in ${data.location} is ${data.temp}. Wind speed is ${data.wind} m/s`;
  },
  {
    name: 'get_weather',
    description: 'Get current weather for a given city using OpenWeatherMap API',
    schema: z.object({
      location: z.string().describe('City name (optionally with country code)'),
    }),
  }
);

const agent = createAgent({
  model,
  tools: [weatherTool],
});

const { messages } = await agent.invoke({
  messages: [{ role: 'user', content: "What's the weather in Tokyo?" }],
});

console.log(messages[messages.length - 1].content);
