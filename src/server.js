require("dotenv").config();
const app = require("./app");
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

