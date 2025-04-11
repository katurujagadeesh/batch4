const express = require('express');
const app = express();
const PORT = 3001;
 
app.get('/', (req, res) => {
  res.send('Hello batch 4 from Node.js with Express!');
});
 
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});