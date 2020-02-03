import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';

const app = express();

app.use(bodyParser.json());

app.get('/hello', (req, res) => res.send('Hello!'));
app.post('/hello', (req, res) => res.send(`Hello ${req.body.name}!`));
app.get('/hello/:name', (req, res) => res.send(`Hello ${req.params.name}!`));

app.get('/api/articles/:name', async (req, res) => {
    const articleName = req.params.name;

    try {
        const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db('react-blog-db');

        const articleInfo = await db.collection('articles').findOne({ name: articleName });
        res.status(200).json(articleInfo);

        client.close();
    } catch (err) {
        res.status(500).send({ message: 'Database Error', err });
    }
});
app.post('/api/articles/:name/upvote', async (req, res) => {
    const articleName = req.params.name;

    try {
        const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db('react-blog-db');

        const articleInfo = await db.collection('articles').findOne({ name: articleName });
        await db.collection('articles').updateOne({ name: articleName }, { '$set': {
            upvotes: articleInfo.upvotes + 1,
        }});
        const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName });
        res.status(200).json(updatedArticleInfo);

        client.close();
    } catch (err) {
        res.status(500).send({ message: 'Database Error', err });
    }
});
app.post('/api/articles/:name/add-comment', (req, res) => {
    const articleName = req.params.name;
    const newComment = req.body.comment;

    articlesInfo[articleName].comments.push(newComment);

    res.status(200).send(articlesInfo[articleName]);
});

app.listen(8000, () => console.log('Server is listening on port 8000'));