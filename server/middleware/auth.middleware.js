const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.header.authorization.split(' '[1])
        if (!token) {
            return res.status(401).json({message: 'Auth error'})
        }
        const decoded = jwt.verify(token, config.get('secretKey'))
        req.user = decoded
        next()  // Чтобы вызвать по цепочке след. middleware
    } catch (e) {
        return res.status(401).json({message: 'Auth error'})
    }
}
