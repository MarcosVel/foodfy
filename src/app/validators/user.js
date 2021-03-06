const User = require('../models/User');

function checkAllFields(body) {
    const keys = Object.keys(body);

    for (let key of keys) {
        if (body[key] == '') {
            return {
                user: body,
                error: 'Por favor, preencha todos os campos!'
            };
        }
    }
}

async function post(req, res, next) {
    try {
        // check if has all fields //
        const fillAllFields = checkAllFields(req.body);
        if (fillAllFields) return res.render('users/register', fillAllFields);

        // check if user alread exists //
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user) return res.render('users/register', {
            user: req.body,
            error: 'Este usuário já está cadastrado!'
        });

        // check email format //
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!email.match(mailFormat)) return res.render('users/register', {
            user: req.body,
            error: 'Formato de email inválido!'
        });

        next();
    } catch (error) {
        console.error(error)
    }
}

async function edit(req, res, next) {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });

    if (!user) return res.render('users/register', {
        error: 'Usuário não encontrado!'
    });

    req.user = user;

    next();
}

function update(req, res, next) {
    const fillAllFields = checkAllFields(req.body);
    if(fillAllFields) return res.render('users/edit', fillAllFields);

    next();
}

module.exports = {
    post,
    edit,
    update
};