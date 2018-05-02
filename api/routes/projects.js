const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const authControl = require('../../helpers/authControl');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        cb(null, false); // true will store file , false will not
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 //5 MB limit
    },
    fileFilter: fileFilter
});
const Project = require('../models/project');

router.get('/', (req, res, next) => {
    Project.find()
        .select('title type _id projectImage images') // it choose which fields should be selected and return
        .exec()
        .then( docs => {
            const response = {
                count: docs.length,
                projects: docs.map(doc => {
                    return {
                        title: doc.title,
                        type: doc.type,
                        _id: doc._id,
                        projectImage: doc.projectImage,
                        images: doc.images,
                        request: {
                            type: 'GET',
                            url: `/project/${doc._id}`
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.get("/:projectId", (req, res, next) => {
    const id = req.params.projectId;
    Project.findById(id)
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.patch('/:projectId', authControl, upload.single('images'), (req, res, next) => {
    const id = req.params.projectId;
    const project = {
        images: req.file.path
    };
    Project.update({_id: id}, { $push: project})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.delete('/:productId', authControl, (req, res, next) => {
    const id = req.params.productId;
    Project.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.post('/', upload.single('projectImage'),  (req, res, next) => {
    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        type: req.body.type,
        projectImage: req.file.path
    });
    console.log('project:', req.file)
    project
        .save()
        .then( result => {
            console.log(result);
            res.status(201).json({
                message: 'Created succesfully',
                project: {
                        title: project.title,
                        type: project.type
                }
            })
        })
        .catch( err => {
            console.log(err)
        });
});

router.post('/:projectId', upload.single('image'),  (req, res, next) => {
    console.log(req.params.image)
    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        type: req.body.type,
        projectImage: req.file.path
    });
    console.log('projest:', req.file)
    project
        .save()
        .then( result => {
            console.log(result);
            res.status(201).json({
                message: 'Created succesfully',
                project: {
                    title: project.title,
                    type: project.type
                }
            })
        })
        .catch( err => {
            console.log(err)
        });
});

module.exports = router;