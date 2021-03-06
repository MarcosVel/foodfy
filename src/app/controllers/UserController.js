const User = require('../models/User');
const crypto = require('crypto');
const mailer = require('../../lib/mailer');
const { emailTemplate } = require('../../lib/utils');

module.exports = {
    registerForm(req, res) {
        return res.render('users/register');
    },
    async post(req, res) {
        try {
            const password = crypto.randomBytes(3).toString('hex');
            const welcomeEmail = `
                <h2 style="font-size: 24px; font-weight: normal;">Olá <strong>${req.body.name}</strong>,</h2>
                <p>Seja muito bem-vindo(a) ao <strong>Foodfy</strong> :)</p>
                <p>Seu cadastro foi realizado com sucesso! Confira seus dados:</p>
                <p>Login: ${req.body.email}</p>
                <p>Senha: ${password}</p>
                <br>
                <h3>Como eu acesso minha Conta?</h3>
                <p>
                    Bem simples, você só precisa clicar no botão abaixo e entrar com seu email e senha informados acima.
				</p>
				<p style="text-align: center;">
                    <a
                        style="display: block; margin: 32px auto; padding: 16px; width:150px; color: #fff;
                        background-color: #6558C3; text-decoration: none; border-radius: 4px;"
                        href="http:localhost:5000/admin/users/login" target="_blank"
                    >Acessar</a> 
				</p>
                <p style="padding-top:16px; border-top: 2px solid #ccc">Te esperamos lá!</p>
                <p>Equipe Foodfy.</p>
            `;

            await mailer.sendMail({
                to: req.body.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Bem-vindo ao Foodfy',
                html: emailTemplate(welcomeEmail)
            });

            const data = { ...req.body, password };
            const userId = await User.create(data);

            return res.redirect(`/admin/users/${userId}/edit`);
        } catch (err) {
            console.error(err);
        }
    },
    async edit(req, res) {
        try {
            const { user } = req;
            user.is_admin = user.is_admin.toString();

            return res.render('users/edit', { user });
        } catch (err) {
            console.error(err);
        }
    },
    async update(req, res) {
        try {
            await User.update(req.body);
            return res.render('users/edit', {
                user: req.body,
                success: 'Usuário atualizado com sucesso!'
            });
        } catch (err) {
            console.error(err);
            return res.render('users/edit', {
                user: req.body,
                error: 'Ops, algum erro aconteceu!'
            });
        }
    },
    async delete(req, res) {
        try {
            await User.delete(req.body.id);
            return res.redirect('users/register');
        } catch (err) {
            console.error(err);
            res.render('users/edit', {
                user: req.body,
                error: 'Ops, algum erro aconteceu!'
            })
        }
    }
}