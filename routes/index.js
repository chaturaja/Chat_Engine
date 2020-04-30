const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

/* GET home page. */
router.get('/', function (req, res, next) {
    fetch('https://hasura-test-surya.herokuapp.com/v1/graphql', {
        method: 'POST', body: JSON.stringify({
            query: 'mutation MyMutation {\n' +
                '  insert_chatroom(objects: {}) {\n' +
                '    affected_rows\n' +
                '    returning {\n' +
                '      id\n' +
                '    }\n' +
                '  }\n' +
                '}',
            variables: {}
        })
    })
        .then(res => res.json()) // expecting a json response
        .then(json => {
            // console.log(json);
            res.json(json);
        })
        .catch(e => {
            // console.log(e);
            res.json(e);
        });

});

module.exports = router;
