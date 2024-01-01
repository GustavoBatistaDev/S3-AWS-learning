require('dotenv').config();

const express = require('express');
const multer = require('./multer');
const aws = require('aws-sdk');

const endpoint = new aws.Endpoint(process.env.BUCKET_ENDPOINT);

const s3 = new aws.S3({
    endpoint,
    credentials: {
        accessKeyId: process.env.KEY_ID,
        secretAccessKey: process.env.APLICATION_KEY
    }
});

const app = express();

app.use(express.json());

app.get('/', multer.single('photo'), async (req, res) => {

    const { file } = req;

    try {
        const upLoadfile = await s3.upload({
            Bucket: process.env.BACKBLAZE_BUCKET,
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype

        }).promise();

        return res.json(upLoadfile);
    } catch (error) {

        console.log(error);

        return res.status(500).json({ message: 'erro interno do servidor'});
    }
});

app.get('/files', async (req, res) => {
    try {
        
        const files = await s3.listObjects({
            Bucket: process.env.BACKBLAZE_BUCKET
        }).promise();
        

        return res.json(files);
    } catch (error) {
         return res.status(500).json({ message: 'erro interno do servidor'});
    }
});


app.listen(process.env.PORT, () => {
    console.log('servidor rodando na porta:', process.env.PORT);
});