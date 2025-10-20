const fetchVideo = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve('content data for #id ' + id), 100);
  });
};

async function* fetchVideoStream(ids) {
  for (const id of ids) {
    const video = await fetchVideo(id);
    yield { id, video };
  }
}

async function processVideosSequentially(ids, processVideo) {
  for (const id of ids) {
    try {
      const video = await fetchVideo(id);
      await saveToDisk({ id, video });
    } catch {
      console.log('error during processing the video');
    }
  }
}

async function saveToDisk({ id, video }) {
  console.log(`processed ${id}: ${video}`);
}

const ids = [101, 102, 103];

// processVideosSequentially(ids, saveToDisk)
//   .then(() => console.log('all done'))
//   .catch(console.error);

for await (const { id, video } of fetchVideoStream(ids)) {
  await saveToDisk({ id, video });
}

// https://blog.stackademic.com/beyond-async-await-10-advanced-js-ts-techniques-senior-engineers-use-e9e687940f4d
