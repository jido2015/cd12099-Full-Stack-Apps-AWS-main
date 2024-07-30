import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

// Endpoint to filter an image from a public URL
app.get('/filteredimage', async (req, res) => {
  const { image_url } = req.query;

  console.log("Received image URL:", image_url); // Log the URL

  if (!image_url) {
    return res.status(400).send({ message: 'image_url is required' });
  }

  try {
    const filteredPath = await filterImageFromURL(image_url);

    res.sendFile(filteredPath, (err) => {
      if (err) {
        return res.status(500).send({ message: 'Error sending the file' });
      }

      deleteLocalFiles([filteredPath]);
    });
  } catch (error) {
    console.error("Error processing image:", error); // Log the error
    res.status(500).send({ message: 'Error processing the image' });
  }
});

app.get('/', (req, res) => {
  res.send('try GET /filteredimage?image_url={{}}');
});

app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});