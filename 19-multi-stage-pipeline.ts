type RawVideo = { id: string; data: string };
type DecodedVideo = { id: string; frames: number[] };
type ProcessedVideo = { id: string; summary: string };

const wait = async (ms: number) => await new Promise((r) => setTimeout(r, ms));

async function* fetchVideos(ids: string[]): AsyncGenerator<RawVideo> {
  for (const id of ids) {
    console.log(`Fetching ${id}`);

    await wait(500);

    yield { id, data: `raw-${id}` };
  }
}

async function* decodeVideos(source: AsyncIterable<RawVideo>): AsyncGenerator<DecodedVideo> {
  for await (const video of source) {
    console.log(`Decoding ${video.id}`);

    await wait(400);

    yield { id: video.id, frames: [1, 2, 3, 4] };
  }
}

async function* processVideos(source: AsyncIterable<DecodedVideo>): AsyncGenerator<ProcessedVideo> {
  for await (const decoded of source) {
    console.log(`Processing ${decoded.id}`);

    await wait(300);

    yield { id: decoded.id, summary: `Frames: ${decoded.frames.length}` };
  }
}

async function uploadResults(source: AsyncIterable<ProcessedVideo>): Promise<void> {
  for await (const processed of source) {
    console.log(`Uploading ${processed.id}: ${processed.summary}`);
    await wait(200);
  }
}

async function runPipeline(ids: string[]): Promise<void> {
  const rawStream = fetchVideos(ids);
  const decodedStream = decodeVideos(rawStream);
  const processedStream = processVideos(decodedStream);

  await uploadResults(processedStream);
}

(async () => {
  await runPipeline(['a', 'b', 'c']);
})();
