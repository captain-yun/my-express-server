import express from 'express';
import { users } from '../users.js';
import { resolveIndexByUserId } from '../middleware/resolveIndexByUserId.js';
import { validateUsersQuery } from '../middleware/validationHandler.js';

const router = express.Router();

router.get('/', validateUsersQuery, (req, res) => {

    let { query : {filter, value, sortBy, order, page, limit} } = req;
    page = page || 1;
    limit = limit || 10;

    let filteredUsers = users;

    if (filter && value) {      
      filteredUsers = users.filter(user => user[filter] == value)      
      if (filteredUsers.length == 0) {
        return res.status(204).send();
      }      
    }

    if (sortBy) {
      filteredUsers.sort((a, b) => {        
        if (a[sortBy] < b[sortBy]) return order == 'desc' ? 1 : -1;
        if (a[sortBy] > b[sortBy]) return order == 'desc' ? -1 : 1;
        return 0;
      })
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number(limit);

    filteredUsers = filteredUsers.slice(startIndex, endIndex);
    
    return res.send(filteredUsers);
})

router.get('/:id', resolveIndexByUserId,  (req, res) => {  
  res.status(200).json(users[req.findUserIndex]);
})

router.post('/', (req, res) => {
  const { body } = req;
  const newUser = { id : users[users.length - 1].id + 1, ...body };  
  users.push(newUser);
  return res.status(201).send(newUser);
})

router.put('/:id', resolveIndexByUserId, (req, res) => {   
  const { body, params : { id } } = req;
  users[req.findUserIndex] = { "id" : id, ...body };
  return res.status(200).send();
})

router.patch('/:id', resolveIndexByUserId, (req, res) => {
  const { body } = req;
  users[req.findUserIndex] = { ...users[req.findUserIndex], ...body };
  return res.status(200).send(users[req.findUserIndex]); 
});

router.delete('/:id', resolveIndexByUserId, (req, res) => {   
  users.splice(req.findUserIndex, 1);
  return res.sendStatus(200)
})

export default router;