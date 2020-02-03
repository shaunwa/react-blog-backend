import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.json());

const withDB = async operations => {
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db('react-blog-db');

        await operations(db);

        client.close();
    } catch (err) {
        res.status(500).send({ message: 'Database Error', err });
    }
}

app.get('/hello', (req, res) => res.send('Hello!'));
app.post('/hello', (req, res) => res.send(`Hello ${req.body.name}!`));
app.get('/hello/:name', (req, res) => res.send(`Hello ${req.params.name}!`));

app.get('/api/articles/:name', async (req, res) => {
    const articleName = req.params.name;
    await withDB(async db => {
        const articleInfo = await db.collection('articles').findOne({ name: articleName });
        res.status(200).json(articleInfo);
    });
});
app.post('/api/articles/:name/upvote', async (req, res) => {
    const articleName = req.params.name;

    await withDB(async db => {
        const articleInfo = await db.collection('articles').findOne({ name: articleName });
        await db.collection('articles').updateOne({ name: articleName }, { '$set': {
            upvotes: articleInfo.upvotes + 1,
        }});
        const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName });
        res.status(200).json(updatedArticleInfo);
    });
});
app.post('/api/articles/:name/add-comment', async (req, res) => {
    const articleName = req.params.name;
    const newComment = req.body.comment;

    await withDB(async (db) => {
        const articleInfo = await db.collection('articles').findOne({ name: articleName });
        await db.collection('articles').updateOne({ name: articleName }, { '$set': {
            comments: articleInfo.comments.concat(newComment),
        }});
        const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName });
        res.status(200).json(updatedArticleInfo);
    });
});

app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.listen(8000, () => console.log('Server is listening on port 8000'));