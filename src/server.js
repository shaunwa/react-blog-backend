import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

app.get('/hello', (req, res) => res.send('Hello!'));

app.post('/hello', (req, res) => res.send(`Hello ${req.body.name}!`));

app.listen(8000, () => console.log('Server is listening on port 8000'));