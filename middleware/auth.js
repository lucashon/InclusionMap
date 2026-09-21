function requireAdmin(request, response, next) {
    if (request.session && request.session.userType === 'admin') return next()
    return response.status(403).render('home', {
        loginMessage: 'Acesso restrito ao administrador da prefeitura.'
    })
}

module.exports = { requireAdmin }