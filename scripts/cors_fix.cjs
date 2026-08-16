const { Storage } = require('@google-cloud/storage');

async function setupStorage() {
  const projectId = 'saienterprises-90c6b';
  const bucketName = 'saienterprises-90c6b.firebasestorage.app';

  const storage = new Storage({
    projectId: projectId,
    keyFilename: 'service-account.json',
  });

  const corsConfiguration = [
    {
      maxAgeSeconds: 3600,
      method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      origin: ['*'],
      responseHeader: ['Content-Type', 'Authorization', 'x-goog-resumable'],
    },
  ];

  try {
    console.log(`Checking if bucket ${bucketName} exists...`);
    const bucket = storage.bucket(bucketName);
    const [exists] = await bucket.exists();

    if (!exists) {
      console.log(`Bucket ${bucketName} does not exist. Creating it...`);
      await storage.createBucket(bucketName, {
        location: 'us-central1',
        cors: corsConfiguration,
      });
      console.log(`✅ Bucket ${bucketName} created successfully!`);
    } else {
      console.log(`Bucket ${bucketName} exists. Updating CORS...`);
      await bucket.setCorsConfiguration(corsConfiguration);
      console.log(`✅ CORS updated successfully!`);
    }
  } catch (error) {
    console.error(`❌ Error setting up storage:`, error);
  }
}

setupStorage();

