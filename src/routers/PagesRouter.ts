import express from 'express';
import DBConn from '../core/database/DatabaseConnection';
import * as consts from '../core/Constants';
const router = express.Router();

router.get('/', (req, res) => {
  const { user } = req.session;
  return res.render('index',{user});
});
router.get('/ranking', (req, res) => {
  const { user } = req.session;
  const jobs = consts.getConstant('jobs');
  return res.render('pages/ranking', { user, jobs });
});
router.get('/login', (req, res) => {
  const { user } = req.session;
  if (user) res.redirect('dashboard');
  return res.render('pages/dashboardLogin');
});
router.get('/register', (req, res) => {
  const { user } = req.session;
  if (user) res.redirect('dashboard');
  return res.render('pages/register');
});
router.get('/play', async (req, res) => {
  const { user } = req.session;
  const data = await DBConn.instance.getDownloads();
  res.render('pages/play', { user, downloads: data });
});
router.get('/download', (req, res) => {
  const { user } = req.session;
  return res.render('pages/play', { user });
});
router.get('/status', (req, res) => {
  const { user } = req.session;
  return res.render('pages/status', { user });
});
router.get('/vote', async (req, res) => {
  const { user } = req.session;
  const data = await DBConn.instance.getVotes();
  res.render('pages/vote', { user, votes: data });
});
export default router;
