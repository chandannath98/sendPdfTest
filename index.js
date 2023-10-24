const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Secret key for JWT token (replace with your own secret key)
const secretKey = 'your_secret_key';

// Sample PDF file paths (replace with your PDF files)
const pdfFiles = {
  1: './sample.pdf',
  2: './d.pdf',
};

// Middleware to verify Bearer token
function verifyToken(req, res, next) {
  const token = req.headers.authorization;
    console.log("+++++++++",token)
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token.replace('Bearer ', ''), secretKey, (err, user) => {
    // if (err) {
    //   return res.status(403).json({ message: 'Forbidden' });
    // }
    // req.user = user;
    next();
  });
}


// POST endpoint to create a JWT token
app.post('/createToken', (req, res) => {
    const { username, password } = req.body;
  
    // Replace with your authentication logic (e.g., verify username and password)
    if (username === 'your_username' && password === 'your_password') {
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  });

  app.get('/downloadNewPdf/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
    console.log("------",id)

  if (!pdfFiles[id]) {
    return res.status(404).json({ message: 'PDF not found' });
  }

  // Set the response headers for PDF download
  res.setHeader('Content-Disposition', `attachment; filename="downloaded.pdf"`);
  res.setHeader('Content-Type', 'application/pdf');

  // Stream the PDF file to the response
  const fileStream = fs.createReadStream(pdfFiles[id]);
  fileStream.pipe(res);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// POST endpoint to download PDF based on 'id' parameter
app.post('/downloadPdf', verifyToken, (req, res) => {
    const id = req.body.id;
    console.log("------",id)

  if (!pdfFiles[id]) {
    return res.status(404).json({ message: 'PDF not found' });
  }

  // Set the response headers for PDF download
  res.setHeader('Content-Disposition', `attachment; filename="downloaded.pdf"`);
  res.setHeader('Content-Type', 'application/pdf');

  // Stream the PDF file to the response
  const fileStream = fs.createReadStream(pdfFiles[id]);
  fileStream.pipe(res);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
