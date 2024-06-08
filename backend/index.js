const express = require("express");
const cors = require('cors');
const config = require('./config');
const PORT = config.PORT;
const root_router = require('./routes/index');
const app = express();


app.use(cors());
app.use(express.json());
app.use('/api/v1', root_router);

app.listen(PORT | 3000, () => console.log('server is live!'));