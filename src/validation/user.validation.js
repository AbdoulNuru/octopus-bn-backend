import { body, validationResult } from 'express-validator';
import Models from '../database/models';
import setLanguage from '../utils/international';

const { Users } = Models;
const checkFirstName = [body('firstName')
  .not().isEmpty({ ignore_whitespace: true })
  .withMessage('FirstNameRequired')
  .bail()
  .isAlpha()
  .withMessage('FirstNameOnlyLetters')
];
const checkLastName = [body('lastName').not().isEmpty({ ignore_whitespace: true })
  .withMessage('LastNameRequired')
  .bail()
  .isAlpha()
  .withMessage('LastNameOnlyLetters')
];
const checkValidEmail = [body('email')
  .not().isEmpty({ ignore_whitespace: true })
  .withMessage('Emailrequired')
  .bail()
  .isEmail()
  .withMessage('EmailValid')];
const checkExistingEmail = [body('email', 'EmailTaken')
  .custom((value = '') => Users.findOne({
    where: {
      email: value
    }
  }).then((user) => {
    if (user !== null) {
      return Promise.reject();
    }
    return true;
  }))];

const checkRoles = [body('role')
  .not().isEmpty({ ignore_whitespace: true })
  .withMessage('The role is required')
  .matches('^travel_administrator$|^travel_team_member$|^manager$|^requester$|^accommodation_supplier$')
  .withMessage('The user role must be one of these roles: travel_administrator, travel_team_member, manager, requester, accommodation_supplier')];

  const checkPassword = [body('password')
  .not().isEmpty({ ignore_whitespace: true })
  .withMessage('Password is required')
  .isLength({ min: 8 })
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,)
  .withMessage('Please enter a password at least 8 character and contain At least one uppercase.At least one lower case.At least one special character.')];

const checkGender = [body('gender').not().isEmpty({ ignore_whitespace: true })
  .withMessage('GenderRequired')
  .bail()
  .isAlpha()
  .isIn(['male', 'female', 'other'])
  .withMessage('GenderInvalid')];
const checkDate = [body('birthDate').not().isEmpty({ ignore_whitespace: true })
  .withMessage('BirthDateRequired')
];
const checkCurrency = [body('preferedCurrency').not().isEmpty({ ignore_whitespace: true })
  .withMessage('CurrencyRequired')
  .bail()
  .isAlpha()];
const checkLocale = [body('preferedLang').not().isEmpty({ ignore_whitespace: true })
  .withMessage('LangRequired')
  .bail()
  .isAlpha()
  .isIn(['fr', 'en'])
  .withMessage('LangInvalid')];
const checkResidence = [body('residence').not().isEmpty({ ignore_whitespace: true })
  .withMessage(`${setLanguage().__('ResidenceRequired')}`)
  .bail()
  .isAlpha()];
const checkDepartment = [body('department').not().isEmpty({ ignore_whitespace: true })
  .withMessage('departmentRequired')
  .bail()
  .isAlpha()];
const checkMangerEmail = [body('managerEmail')
  .not().isEmpty({ ignore_whitespace: true })
  .withMessage('Emailrequired')
  .bail()
  .isEmail()
  .withMessage('EmailValid')];
const checkImageUrl = [body('imageUrl').not().isEmpty({ ignore_whitespace: true })
  .withMessage('ImageUrlRequired')
  .bail()];
const checkBio = [body('bio').not().isEmpty({ ignore_whitespace: true })
  .withMessage('BioRequired')
  .bail()];
const checkPassportNumber = [body('passportNumber').not().isEmpty({ ignore_whitespace: true })
  .withMessage('PassportRequired')
  .bail()
  .isLength({ min: 9 })
  .withMessage('PassportNun9Chars')
  .matches(/[a-zA-Z]{2}[0-9]{7}/)
  .withMessage('PassportNunInvalid')];

const checkConfirmPassword = [body('confirmPassword')
.not().isEmpty({ ignore_whitespace: true })
.withMessage('Password is required')
.isLength({ min: 8 })
.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,)
.withMessage('Please enter a password at least 8 character and contain At least one uppercase.At least one lower case.At least one special character.')];

const notifyByEmail = [body('notifyByEmail').not().isEmpty({ ignore_whitespace: true })
  .withMessage('notifyByEmail is required')
  .bail()
  .isBoolean()
  .withMessage('notifyByEmail can either be true or false')
];

/**
* @description this method validate user result
* @param {object} req
* @param {object} res
* @param {object} next
* @returns {object} res
* @memberof validateArray
*/
const validateResult = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }
  const { prefLocale } = req.i18n;
  const { errors } = result;
  const errorMessageArr = errors.map((el) => setLanguage(prefLocale).__(el.msg));

  if (errorMessageArr.includes(`${setLanguage(prefLocale).__('EmailExist')}`)) {
    return res.status(409).json({
      status: 409,
      message: setLanguage(prefLocale).__('EmailExist'),
    });
  }
  return res.status(422).json({
    status: 422,
    message: errorMessageArr,
  });
};

export default {
  checkFirstName,
  checkLastName,
  checkValidEmail,
  checkExistingEmail,
  checkPassword,
  checkGender,
  checkDate,
  checkCurrency,
  checkLocale,
  checkResidence,
  checkDepartment,
  checkMangerEmail,
  checkImageUrl,
  checkBio,
  checkPassportNumber,
  checkRoles,
  checkConfirmPassword,
  notifyByEmail,
  validateResult
};
