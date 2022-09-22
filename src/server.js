import express, { application, json } from 'express';
import { db, connectToDb } from './db.js' //create your db file and connect to your mongo server.


const app = express();
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/api/articles/:name', async (req,res) => {
    const { name } = req.params;

    const article = await db.collection('articles').findOne({ name })

    if (article) {
        res.json(article)
    } else {
        res.sendStatus(404).send('article not found')
    }
})

app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;
    
    await db.collection('articles').updateOne({ name }, {
        $inc: { upvotes : 1}
    })

    const article = await db.collection('articles').findOne({ name })

    if (article) {
        res.send(`The ${name} article now has ${article.upvotes} upvotes!!!`);
    } else {
        res.send('That article doesn\'t exist');
    }
});

app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;
    const { postedBy, text } = req.body;

    await db.collection('articles').updateOne({ name }, {
        $push : { comments : {postedBy, text} },
    })

    const article = await db.collection('articles').findOne({ name })
    

    if (article) {

        res.send(article.comments);
    } else {
        res.send('That article doesn\'t exist!');
    }
});

connectToDb(() => {
    app.listen(8000, () => {
        console.log('Server is listening on port 8000');
    });
})
