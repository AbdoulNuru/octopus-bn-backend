import express from 'express';
import passport from 'passport';
import 'config/passport';
import userController from 'controllers/userController';
import validation from 'validation/user.validation';
import checkUser from 'middlewares/checkUser';

const router = express.Router();
const {
  checkFirstName, checkLastName, checkValidEmail, checkExistingEmail,
  checkPassword, checkGender, checkDate, checkCurrency,
  checkLocale, checkResidence, checkDepartment, checkMangerEmail, checkImageUrl, checkBio,
  checkPassportNumber, checkRoles,
  validateResult,
  checkConfirmPassword
} = validation;

router.use(passport.initialize());

/**
 * @swagger
 *
* /api/v1/auth/facebook:
*   get:
*     security: []
*     summary: Facebook sign in
*     description: Get infomation from facebook and use it to signin a user
*     tags:
*       - Users
*     produces:
*         application/json:
*           schema:
*             type: object
*             properties:
*               status:
*                 type: string
*               message:
*                 type: string
*               data:
*                 type: object
*                 properties:
*                   id:
*                     type: integer
*                   firstName:
*                     type: string
*                   lastName:
*                     type: string
*                   email:
*                     type: string
*                 Token:
*                   type: string
*     responses:
*       200:
*         description: User login successfully
*/
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email'],
  session: false
}));


router.get('/facebook/callback', passport.authenticate('facebook', {
  // failureRedirect: process.env.FRONT_END_FAIL_REDIRECT,
// successRedirect: process.env.FRONT_END_SUCCESS_REDIRECT,
}), userController.socialLogin);

/**
 * @swagger
 *
* /api/v1/auth/google:
*   get:
*     security: []
*     summary: Google sign in
*     description: Get infomation from Google and use it to signin a user
*     tags:
*       - Users
*     produces:
*         application/json:
*           schema:
*             type: object
*             properties:
*               status:
*                 type: string
*               message:
*                 type: string
*               data:
*                 type: object
*                 properties:
*                   id:
*                     type: integer
*                   firstName:
*                     type: string
*                   lastName:
*                     type: string
*                   email:
*                     type: string
*                 Token:
*                   type: string
*     responses:
*       200:
*         description: User login successfully
*/
router.get('/google', passport.authenticate('google', {
  session: false,
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
}));


router.get('/google/callback', passport.authenticate('google', {
}), userController.socialLogin);

/**
 * @swagger
 *
 * /api/v1/auth/signup:
 *   post:
 *     security: []
 *     summary: User registration
 *     description: Register new users and verify their account via email
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *               message:
 *                 type: string
 *               data:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *     responses:
 *       201:
 *         description: created
 */
router.post('/signup', checkFirstName, checkLastName, checkValidEmail, checkExistingEmail, checkPassword, validateResult, userController.signUp);
router.get('/verify/:token', userController.verifyAccount);

/**
 * @swagger
 *
 * /api/v1/auth/profile-settings:
 *   put:
 *     security: []
 *     summary: Profile settings
 *     description: User can be able to edit his/her profile
 *     tags:
 *       - Users
 *     parameters:
 *       - name: x-access-token
 *         description: Access token.
 *         in: header
 *         required: true
 *         type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: HAKORIMANA
 *               lastName:
 *                 type: string
 *                 example: Emmanuel
 *               gender:
 *                 type: string
 *                 example: M
 *               birthDate:
 *                 type: string
 *                 example: 2020-02-18T07:02:55.101Z
 *               preferedLang:
 *                 type: string
 *                 example: fr
 *               preferedCurrency:
 *                 type: string
 *                 example: US
 *               residence:
 *                 type: string
 *                 example: Kimihurura
 *               department:
 *                 type: string
 *                 example: IT
 *               managerEmail:
 *                 type: string
 *                 example: manager@barefoot.com
 *               imageUrl:
 *                 type: string
 *                 example: https://www.google.com/profile.gif
 *               bio:
 *                 type: string
 *                 example: I tackle software problems
 *               passportNumber:
 *                 type: string
 *                 example: RK0884756
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *               message:
 *                 type: string
 *               data:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   method:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   password:
 *                     type: object
 *                   isVerified:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *                   gender:
 *                     type: string
 *                   birthDate:
 *                     type: string
 *                   preferedLang:
 *                     type: string
 *                   preferedCurrency:
 *                     type: string
 *                   residence:
 *                     type: string
 *                   department:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *                   managerEmail:
 *                     type: string
 *                   bio:
 *                     type: string
 *                   passportNumber:
 *                     type: string
 *     responses:
 *       200:
 *         description: Your profile is updated successfully
 */
router.put('/profile-settings', [checkUser, checkFirstName, checkLastName,
  checkGender, checkDate, checkCurrency, checkLocale, checkResidence,
  checkDepartment, checkMangerEmail, checkImageUrl, checkBio, checkPassportNumber,
  validateResult], userController.updateProfile);

/**
 * @swagger
 *
 * /api/v1/auth/assign-roles:
 *   post:
 *     security: []
 *     summary: Assign roles
 *     description: Assign roles to users using their eamils
 *     tags:
 *       - Users
 *     parameters:
 *       - name: x-access-token
 *         description: Access token.
 *         in: header
 *         required: true
 *         type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Your role was upgraded
 */
router.post('/assign-roles', checkValidEmail, checkRoles, validateResult, checkUser, userController.assignRole);

/**
 * @swagger
 *
 * /api/v1/auth/signin:
 *   post:
 *     security: []
 *     summary: Login
 *     description: users can log into their accounts
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *               message:
 *                 type: string
 *               token: string
 *     responses:
 *       200:
 *         description: login successfully
 */
router.post('/signin', checkValidEmail, checkPassword, userController.signin);


/**
 * @swagger
 *
 * /api/v1/auth/forgot-password:
 *   post:
 *     security: []
 *     summary: forgot password
 *     description: users request to reset a password
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: We have sent you an email
 *  */
router.post('/forgot-password', checkValidEmail, validateResult, userController.forgotPassword);


/**
 * @swagger
 *
 * /api/v1/auth/reset-password/{token}:
 *   put:
 *     security: []
 *     summary: Reset password
 *     description: users request to reset a password
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *               message:
 *                 type: string
 *     parameters:
 *       - name: token
 *         description: Token sent through email.
 *         in: path
 *         requiered: true
 *         type: string
 *     responses:
 *       200:
 *         description: We have sent you an email
 *  */
router.put('/reset-password/:token', checkPassword, checkConfirmPassword, validateResult, userController.resetPassword);
export default router;
