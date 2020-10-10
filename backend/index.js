const express = require('express');
const multer = require('multer');

const app = express();

const fileFilter = function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Wrong file type");
        error.code = "LIMIT_FILE_TYPES";
        return cb(error, false);
    }
    cb(null, true);
}

// 100 KB
const MAX_SIZE = 100000

const upload = multer({
    dest: './uploads/',
    fileFilter,
    limits: {
        fileSize: MAX_SIZE
    }
})

const pureUpload = multer({
    dest: './uploads/'
})
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ file: req.file })
})
app.post('/multiple', upload.array('files'), (req, res) => {
    res.json({ files: req.files })
})
app.post('/dropzone', pureUpload.single('file'), (req, res) => {
    res.json({ file: req.file })
})

app.use(function (err, req, res, next) {
    console.log(err.code)
    if (err.code === "LIMIT_FILE_TYPES") {
        res.status(422).json({ error: 'Only images are allowed' })
        return;
    }
    if (err.code === "LIMIT_FILE_SIZE") {
        res.status(422).json({ error: `File too large. Max size is ${MAX_SIZE / 1000}kb ` })
        return;
    }
})

app.listen(3333, () => console.log("Running..."));
