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

router.post('/getChatRooms', function (req, res, next) {
    fetch('https://hasura-test-surya.herokuapp.com/v1/graphql', {
        method: 'POST',
        body: JSON.stringify({
            query: `query getChatRoom($user_id:uuid!) {
              user(where: {id: {_eq: $user_id}}) {
                chatroom_user_maps {
                  chatroom {
                    id
                    chatroom_user_maps {
                      user {
                        name
                        id
                      }
                    }
                  }
                }
              }
            }`,
            variables: {
                "user_id": req.body.user_id
            }
        }),
        headers: {
            "x-hasura-admin-secret": "ABC123"
        }
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

router.post('/createChatRoom', function (req, res, next) {
    fetch('https://hasura-test-surya.herokuapp.com/v1/graphql', {
        method: 'POST',
        body: JSON.stringify({
            query: `mutation MyMutation {
              insert_chatroom(objects: {}) {
                affected_rows
                returning {
                  id
                }
              }
            }`,
            variables: {}
        }),
        headers: {
            "x-hasura-admin-secret": "ABC123"
        }
    })
        .then(res => res.json()) // expecting a json response
        .then(json => {
            // console.log(json);
            let q_objs = [{
                "chatroom_id": json.data.insert_chatroom.returning[0].id,
                "user_id": req.body.user_id
            }];
            req.body.users.forEach(item => {
                q_objs.push({
                    "chatroom_id": json.data.insert_chatroom.returning[0].id,
                    "user_id": item
                })
            });
            fetch('https://hasura-test-surya.herokuapp.com/v1/graphql', {
                method: 'POST',
                body: JSON.stringify({
                    query: `mutation MyMutation {
                          insert_chatroom_user_map(objects: ` + JSON.stringify(q_objs).replace(/\"([^(\")"]+)\":/g,"$1:") + `) {
                            affected_rows
                          }
                        }`,
                    variables: {}
                }),
                headers: {
                    "x-hasura-admin-secret": "ABC123"
                }
            })
                .then(res => res.json()) // expecting a json response
                .then(json => {
                    console.log(json);
                    res.json(json);
                })
                .catch(e => {
                    console.log(e);
                    res.json(e);
                });
        })
        .catch(e => {
            console.log(e);
            res.json(e);
        });
});


module.exports = router;
