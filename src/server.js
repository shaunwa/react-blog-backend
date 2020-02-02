import express from 'express';
import bodyParser from 'body-parser';

const articlesInfo = {
    'learn-react': { upvotes: 0, comments: [] },
    'learn-node': { upvotes: 0, comments: [] },
    'my-thoughts-on-resumes': { upvotes: 0, comments: [] },
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
app.post('/api/articles/:name/add-comment', (req, res) => {
    const articleName = req.params.name;
    const newComment = req.body.comment;

    articlesInfo[articleName].comments.push(newComment);

    res.status(200).send(articlesInfo[articleName]);
});

app.listen(8000, () => console.log('Server is listening on port 8000'));