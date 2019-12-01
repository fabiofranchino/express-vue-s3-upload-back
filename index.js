const express = require('express')
const path = require('path')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3131

require('dotenv').config()

var origins = {
  origin: ['http://localhost:8080'],
  optionsSuccessStatus: 200,
  credentials: false
}
app.use(cors(origins))

const aws = require('aws-sdk')
aws.config.region = 'eu-west-3'
const S3_BUCKET = process.env.S3_BUCKET_NAME

app.get('/s3', (req, res) => {
  const fileName = req.query.filename
  const fileType = req.query.filetype
  const ext = path.extname(fileName)

  const pathName = path.join('myfoldertest', 'myuploadedfile' + ext)

  const s3 = new aws.S3()

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: pathName,
    Expires: 60 * 15,
    ContentType: fileType,
    ACL: 'public-read'
  }

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      return res.status(500).json(err)
    }

    const returnData = {
      signedRequest: data,
      url: `${pathName}`
    }

    res.status(200).json(returnData)
  })
})

app.listen(port, () => console.log('Server is running on port: ' + port))
