const express = require('express');
const app = express();
const crypto = require("crypto");
const db = require('./config').db;
const mongoose = require('mongoose');
const Short = require('./models/shorter');

const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
const regex = new RegExp(expression);

mongoose.connect(db, function (e) {
    console.log('連線成功')
})

app.get('/', function (req, res, next) {
    res.send({
        msg: "利厚"
    });
})

app.get('/new/:url', function (req, res, next) {
    const url = req.params.url;
    if(!url.match(regex)) {
        res.send({msg:'not valid'});
    } else {

        Short.findOne({
            url: url
        }, function (e, exsitingData) {
            if (e) return res.send({ msg: 'error' })
            if (exsitingData) {
                res.send({
                    origin_url: exsitingData.url,
                    short: exsitingData.short
                });
            } else {
                const id = crypto.randomBytes(5).toString('hex');
                const short = new Short({
                    url: url,
                    short: id
                });
                short.save(function (e, data) {
                    if (e) return res.send({
                        msg: 'error'
                    });
                    console.log(data);
                })
                res.send({
                    origin_url: url,
                    short_url: id
                })
            }
        });
    }
});

app.get('/short/:url', function (req, res, next) {
    const short = req.params.url;
    Short.findOne({
        short: short
    }, function (e, data) {
        if (e) return res.send({ msg: 'error' });
        if (data){
            res.redirect('http://' + data.url);
        } else {
            res.send({msg:'not found'});
        }
    });
});

app.listen(3000, function () {
    console.log('3000 is ok');
});