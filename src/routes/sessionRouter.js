import express from 'express';
const router = express.Router();

// 세션 설정
router.get('/set-session', (req, res) => {
    req.session.username = 'JohnDoe';
    res.send('Session has been set');
});

// 세션 읽기
router.get('/get-session', (req, res) => {
    const username = req.session.username;
    res.send(`Session value: ${username}`);
});

// 세션 삭제
router.get('/destroy-session', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error destroying session');
        }
        res.send('Session destroyed');
    });
});

export default router;