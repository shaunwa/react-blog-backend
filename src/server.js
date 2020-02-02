import express from 'express';
import bodyParser from 'body-parser';

const articlesInfo = {
    'learn-react': { upvotes: 0 },
    'learn-node': { upvotes: 0 },
    'my-thoughts-on-resumes': { upvotes: 0 },
};

const app = express();

app.use(bodyParser.json());

app.get('/hello', (req, res) => res.send('Hello!'));
app.post('/hello', (req, res) => res.send(`Hello ${req.body.name}!`));
app.get('/hello/:name', (req, res) => res.send(`Hello ${req.params.name}!`));

app.post('/api/articles/:name/upvote', (req, res) => {
    const articleName = req.params.name;
    articlesInfo[articleName].upvotes += 1;
    res.status(200).send('Success! ' + articleName + ' now has ' + articlesInfo[articleName].upvotes + ' upvotes!');
});

app.listen(8000, () => console.log('Server is listening on port 8000'));