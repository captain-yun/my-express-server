import express from 'express';
const router = express.Router();

router.get('/set-cookie', (req, res) => {
    // 쿠키 생성 -> 클라이언트에 응답
    res.cookie('myCookie', 'Hello, World!!!', { maxAge: 10000 });
    res.send(`Cookie created`);
})
  
router.get('/get-cookie', (req, res) => {  
    res.send(`쿠키값 : ${req.cookies?.myCookie}`);
})

router.get('/delete-cookie', (req, res) => {
    res.clearCookie('myCookie');
    res.send('Cookie deleted');
})

export default router;