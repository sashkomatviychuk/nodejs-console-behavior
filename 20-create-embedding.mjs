import OpenAI from 'openai';

const openai = new OpenAI();

const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: 'This code has been writtern in JavaScript',
  encoding_format: 'float',
});

console.log(embedding.data);
