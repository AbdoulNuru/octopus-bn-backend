/* eslint-disable require-jsdoc */
import uuid from 'uuid/v4';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail, sendNotificationEmail, sendPasswordResetLink } from 'utils/emailHelper';
import { successResponse, errorResponse } from 'utils/responses';
import { encode, decode } from 'utils/jwtTokenizer';
import Models from '../database/models';
import setLanguage from '../utils/international';

/**
 * @description This class contains all the methods relating to the user
 * @class userController
 */
class userController {
  static async socialLogin(req, res) {
    try {
      const { Users } = Models;
      const password = 'null';
      const { id } = req.user;
      const {
        email, firstName, lastName, method
      } = req.user;
      await Users.findOrCreate({
        where: { email },
        defaults: {
          id,
          firstName,
          lastName,
          method,
          email,
          password,
          isVerified: true,
          isUpdated: false
        }
      });
      const Token = encode({
        email, firstName, lastName, method
      });
      
      return res.status(200).json({
        status: 200,
        message: req.i18n.__('loginSuccessfully'),
        data: {
          email, id, firstName, lastName, method
        },
        Token
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        errors: {
          error
        }
      });
    }
  }

  /**
     * @description user signUp method
     * @param {object} req
     * @param {object} res
     * @returns {object} newUser
     * @memberof userController
     */
  static async signUp(req, res) {
    const { prefLocale } = req.i18n;
    try {
      const {
        firstName, lastName, email, password
      } = req.body;
      const hash = await bcrypt.hash(password, 10);
      const newUser = await Models.Users.create({
        id: uuid(), method: 'local', firstName, lastName, email, password: hash, isVerified: false, isUpdated: false
      });
      const data = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        isVerified: newUser.isVerified,
        preferedLang: prefLocale
      };
      const token = encode(data);
      const verificationData = {
        name: newUser.firstName, email: newUser.email, token
      };

      

      sendVerificationEmail(verificationData);

      return res.status(201).json({
        status: 201,
        message: setLanguage(prefLocale).__('signUpSuccess'),
        data,
        token
      });
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  /**
     * @description account verification
     * @param {object} req
     * @param {object} res
     * @returns {object} json
     * @memberof userController
     */
  static async verifyAccount(req, res) {
    // eslint-disable-next-line prefer-destructuring
    const token = req.params.token;
    const payload = decode(token);
    const { prefLocale } = req.i18n;
    const emailExist = await Models.Users.findOne({ where: { email: payload.email } });

    if (!emailExist) {
      return res.status(404).json({
        status: 404,
        error: setLanguage(prefLocale).__('onVerifyFailure')
      });
    }

    if (emailExist.isVerified !== true) {
      await Models.Users.update(
        { isVerified: true }, { where: { email: payload.email } }
      );

      return res.status(200).json({
        status: 200,
        message: setLanguage(prefLocale).__('onVerifySuccess'),
        token
      });
    }

    return res.status(200).json({
      status: 200,
      message: setLanguage(prefLocale).__('onVerifySuccess')
    });
  }

  /**
     * @description update user roles
     * @param {object} req
     * @param {object} res
     * @returns {object} json
     * @memberof userController
     */
  static async assignRole(req, res) {
    const { role, preferedLang } = req.user;
    const userRole = req.body.role;
    const userExist = await Models.Users.findOne({ where: { email: req.body.email } });

    if (!userExist) {
      return errorResponse(res, 404, setLanguage(preferedLang).__('userDon\'tExist'));
    }

    if (role !== 'super_administrator') {
      return errorResponse(res, 401, setLanguage(preferedLang).__('notSuperAdmin'));
    }

    await Models.Users.update({ role: req.body.role },
      {
        where: { email: req.body.email }
      });

    sendNotificationEmail(userExist.firstName, userExist.email, userRole);

    return successResponse(res, 200, `${setLanguage(preferedLang).__('roleUpgrade')} ${req.body.role}`);
  }


  static async signin(req, res) {
    try {
      const { email, password } = req.body,
        { Users } = Models,
        registered = await Users.findOne({
          where: {
            email,
          },
        });

      if (!registered) {
        return res.status(401).json({
          status: 401,
          error: req.i18n.__('IncorrectEmailPassword'),
        });
      }
      if (!registered.isUpdated) {
        return res.status(403).json({
          status: 403,
          error: 'Please update your profile information to continue'
        });
      }

      const { method } = registered;
      if (method !== 'local') {
        return res.status(422).json({
          status: 422,
          error: `Please use ${registered.method} to sign in`
        });
      }

      const truePassword = await bcrypt.compareSync(password, registered.password);

      if (!truePassword) {
        return res.status(401).json({
          status: 401,
          error: req.i18n.__('IncorrectEmailPassword'),
        });
      }
      const token = encode({
        email,
        preferedLang: registered.preferedLang
      });
      
      return res.status(200).json({
        status: 200,
        message: setLanguage(registered.preferedLang).__('loginSuccessfully'),
        token
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: req.i18n.__('internalServerError')
      });
    }
  }

  /**
       * @description forgot password
       * @param {object} req
       * @param {object} res
       * @returns {object} json
       * @memberof userController
       */

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body,
        { Users } = Models,
        registered = await Users.findOne({
          where: {
            email,
          },
        });

      if (!registered) {
        return res.status(404).json({
          status: 404,
          error: req.i18n.__('onVerifyFailure')
        });
      }

      const token = encode({ email });
      const user = {
        name: registered.firstName,
        email: registered.email,
        token,
        preferedLang: registered.preferedLang
      };

      sendPasswordResetLink(user, req.headers.host);
      return res.status(200).json({
        status: 200,
        message: req.i18n.__('emailSent')
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: req.i18n.__('internalServerError')
      });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { password, confirmPassword } = req.body,
        { token } = req.params,
        payload = decode(token),
        registered = await Models.Users.findOne({ where: { email: payload.email } });

      if (!registered) {
        return res.status(404).json({
          status: 404,
          error: req.i18n.__('onVerifyFailure')
        });
      }

      if (password !== confirmPassword) {
        return res.status(422).json({
          status: 422,
          error: req.i18n.__('passwordsDontMatch')
        });
      }
      const hash = await bcrypt.hash(password, 10);

      await Models.Users.update(
        { password: hash }, { where: { email: payload.email } }
      );

      return res.status(200).json({
        status: 200,
        message: req.i18n.__('passwordReset')
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: req.i18n.__('internalServerError')
      });
    }
  }

  /**
     * @description profile settings method
     * @param {object} req
     * @param {object} res
     * @returns {object} updated record
     * @memberof userController
     */
  static async updateProfile(req, res) {
    const {
      body: {
        firstName,
        lastName,
        gender,
        birthDate,
        preferedLang,
        preferedCurrency,
        residence,
        department,
        managerEmail,
        imageUrl,
        bio,
        passportNumber
      },
      user: {
        id
      },
      body
    } = req;
    try {
      const user = await Models.Users.findOne({ where: { email: managerEmail } });

      if (!user || user.role !== 'manager') {
        return res.status(404).json({
          status: 404,
          error: setLanguage(preferedLang).__('managerEmailNotExist')
        });
      }

      await Models.Users.update(
        {
          firstName,
          lastName,
          gender,
          birthDate,
          preferedLang,
          preferedCurrency,
          residence,
          department,
          managerEmail,
          imageUrl,
          bio,
          passportNumber,
          isUpdated: true
        }, {
          where: { id },
          returning: true,
          plain: true
        }
      );

      return res.status(200).json({
        status: 200,
        message: setLanguage(preferedLang).__('ProfileUpdated'),
        data: body
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: setLanguage(preferedLang).__('internalServerError')
      });
    }
  }
}

export default userController;
