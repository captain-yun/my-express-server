export default {
    // 로그인 확인 미들웨어
  checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
  }
}