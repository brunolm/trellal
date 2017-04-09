import * as express from 'express';

import Trello from './services/trello';
import { wrap } from './wrap';

const router = express.Router();

router.get('/get-user', wrap(async (req, res) => {
  const trello = Trello(req.query.token);

  const data = await trello.getUser();

  res.json(data);
}));

router.get('/get-boards', wrap(async (req, res) => {
  const trello = Trello(req.query.token);

  const data = await trello.getBoards();

  res.json(data);
}));

router.get('/get-organizations', wrap(async (req, res) => {
  const trello = Trello(req.query.token);

  const data = await trello.getOrganizations();

  res.json(data);
}));

router.get('/get-organization-boards', wrap(async (req, res) => {
  const trello = Trello(req.query.token);

  const data = await trello.getOrganizationBoards(req.query.orgId);

  res.json(data);
}));

module.exports = router;
