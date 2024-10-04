const { google } = require('googleapis');
const { Readable } = require('stream');
const { private_key, client_email } = require('../routes/credentials.json');

// Configure OAuth2 Client
const oauth2Client = new google.auth.JWT(
  client_email, 
  null, 
  private_key, 
  ['https://www.googleapis.com/auth/drive']
);

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Helper function to convert buffer to stream
const bufferToStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

// Function to upload file to Google Drive
const uploadToDrive = async (fileBuffer, fileName, mimeType, folderId) => {
  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType,
    body: bufferToStream(fileBuffer),
  };

  const driveResponse = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });

  // Make file publicly accessible
  await drive.permissions.create({
    fileId: driveResponse.data.id,
    requestBody: { role: 'reader', type: 'anyone' },
  });

  // Return the publicly accessible link
  return `https://drive.google.com/uc?id=${driveResponse.data.id}&export=download`;
};

module.exports = { uploadToDrive };
