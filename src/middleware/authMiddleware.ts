const authRepository = require("../repositories/authRepository")
module.exports = async (req, res, next) => {
  try {
    if (!req.cookies['sessionId']) {
      next();
    }
    const user = await authRepository.getUserBySessionId(req.db, req.cookies['sessionId']);
    if (!user) {
      return res.status(401).json({message: 'Недопустимая сессия'});
    }
    req.user = user;
    req.sessionId = req.cookies['sessionId'];
    next();
  } catch (error) {
    // Обработка ошибки при работе с базой данных
    console.error('Ошибка при поиске пользователя по сессии:', error);
    next(error); // Передача ошибки в обработчик ошибок Express
  }
}
