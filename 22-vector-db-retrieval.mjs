import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI();
const dbClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const query = 'How many guitars John has?';

async function main() {
  const docs = await retrieveSimilarDocs(query);
  const context = combineDocuments(docs);
  const propmt = createPrompt(context, query);

  const aiResponse = await openai.responses.create({
    model: 'gpt-4',
    input: propmt,
  });

  console.log(aiResponse);
}

async function retrieveSimilarDocs(query) {
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });
  const embedding = embeddingResponse.data[0].embedding;

  const { data, error } = await dbClient.rpc('match_documents', {
    query_embedding: embedding,
    match_count: 5,
  });

  return data;
}

function createPrompt(contextString, question) {
  return `You are a helpful assistant. Answer the user's question based ONLY on the provided context. If the context doesn't contain the answer, inform the user.

Context:
---
${contextString}
---

Question: ${question}
Answer:`;
}

function combineDocuments(docs) {
  return docs.map((doc) => doc.content).join('\n\n---\n\n');
}

main();
