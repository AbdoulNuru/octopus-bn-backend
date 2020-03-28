import express from 'express';
import checkUser from 'middlewares/checkUser';
import isTravelAdministrator from 'middlewares/isTravelAdministrator';
import isProfileUpdated from 'middlewares/isProfileUpdated';
import validateParams from 'middlewares/paramsValidator';
import accommodationController from '../../controllers/accommodation';
import accommodationValidator from '../../middlewares/accommodationValidator';
import roomsValidator from '../../middlewares/roomsValidator';
import validateAccommodationAndRoom from '../../middlewares/validateAccommodationAndRoom';
import {
  isAccomendationExist, isRoomExist, isTripExist,
  checkInAndCheckoutValidator, isRoomAlreadyBooked,
  areYouTripOwner
} from '../../middlewares/validateBooking';
import validateId from '../../middlewares/idValidator';
import validateRating from '../../middlewares/validateRating';
import feedbackValidator from '../../middlewares/validateFeedback';
import checkIfAccomodationExist from '../../middlewares/isAccomodation';

const router = express.Router();

/**
 * @swagger
 *
 * /api/v1/accommodations:
 *   post:
 *     security: []
 *     summary: add accommodations
 *     description: add accommodations
 *     tags:
 *       - Accommodations
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
 *               name:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               around:
 *                 type: array
 *                 items:
 *                   type: string
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               amenities:
 *                 type: array
 *               around:
 *                 type: array
 *     responses:
 *       201:
 *         description: Accommodation Created successfully
 */
router.post('/', [checkUser, isProfileUpdated, isTravelAdministrator, accommodationValidator], accommodationController.create);
/**
 * @swagger
 *
 * /api/v1/accommodations/room:
 *   post:
 *     security: []
 *     summary: add accommodations
 *     description: add accommodations
 *     tags:
 *       - Accommodations
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
 *               accommodationsID:
 *                 type: string
 *               roomNumber:
 *                 type: string
 *               cost:
 *                 type: number
 *               currency:
 *                 type: string
 *               type:
 *                 type: string
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accommodationsID:
 *                 type: string
 *               roomNumber:
 *                 type: string
 *               cost:
 *                 type: string
 *               currency:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Room added successfully
 */
router.post('/room', [checkUser, isProfileUpdated, isTravelAdministrator, roomsValidator, validateAccommodationAndRoom], accommodationController.addRoom);

/**
 * @swagger
 *
 * /api/v1/accommodations?page={page}&limit={limit}&id={id}:
 *   get:
 *     security: []
 *     summary: Accommodation per destination
 *     description: show all available accommodation on your destination
 *     tags:
 *       - Accommodations
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
 *       - name: x-access-token
 *         description: Access token.
 *         in: header
 *         required: true
 *         type: string
 *       - name: page
 *         description: page number.
 *         in: path
 *         required: false
 *         default: 1
 *         type: string
 *       - name: limit
 *         description: Requests per page.
 *         in: path
 *         required: false
 *         default: 5
 *         type: string
 *       - name: id
 *         description: request id.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: These are the available accomodations on your destination
 *  */
router.get('/', [checkUser, isProfileUpdated, validateParams], accommodationController.getAccommodationPerDestination);

/**
 * @swagger
 *
 * /api/v1/accommodations/book:
 *   post:
 *     security: []
 *     summary: Book accommodation
 *     description: Users can be able to book accommodations
 *     tags:
 *       - Accommodations
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
 *               accommodationId:
 *                 type: string
 *               roomId:
 *                 type: string
 *               tripId:
 *                 type: string
 *               checkIn:
 *                 type: string
 *               checkOut:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: You have successfully booked your accommodation
 */
router.post('/book', [checkUser, isProfileUpdated,
  isAccomendationExist, isRoomExist, isTripExist,
  checkInAndCheckoutValidator, areYouTripOwner,
  isRoomAlreadyBooked],
accommodationController.bookAccommodation);

/**
 * @swagger
 *
 *  /api/v1/accommodations/feedback?accommodationId={accommodationId}:
 *   post:
 *     security: []
 *     summary: add a to accommodations
 *     description: add a comment to accommodations
 *     tags:
 *       - Accommodations
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               feedback:
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
 *       - name: x-access-token
 *         description: Access token.
 *         in: header
 *         required: true
 *         type: string
 *       - name: accommodationId
 *         description: accommodationId.
 *         in: path
 *         required: true
 *         default: id
 *         type: Thanks you for the feedback
 *     responses:
 *       200:
 *         description: Requests retrieved successfully
 *  */
router.post('/feedback', checkUser, validateId, feedbackValidator, accommodationController.feedback);

/**
 * @swagger
 *
 * /api/v1/accommodations/rating:
 *   post:
 *     security: []
 *     summary: rate accommodations
 *     description: rate accommodations
 *     tags:
 *       - Accommodations
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
 *               accommodationId:
 *                 type: string
 *               rating:
 *                 type: number
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Thank you for rating us
 */
router.post('/rating', [checkUser, validateRating], accommodationController.addRatings);
/**
 * @swagger
 *
 * /api/v1/accommodations/likes/{accommodationId}:
 *   get:
 *     security: []
 *     summary: Get likes per accomodation
 *     description: Get likes per accomodation
 *     tags:
 *       - Accommodations
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
 *       - name: x-access-token
 *         description: Access token.
 *         in: header
 *         required: true
 *         type: string
 *       - name: accommodationId
 *         description: Get likes per accomodation
 *         in: path
 *         requiered: true
 *         type: string
 *     responses:
 *       200:
 *         description: Get likes per accomodation
 *  */
router.get('/likes/:accommodationId', [checkUser, isProfileUpdated, checkIfAccomodationExist], accommodationController.getAccommodationLikes);
/**
 * @swagger
 *
 * /api/v1/accommodations/like-unlike/{accommodationId}:
 *   post:
 *     security: []
 *     summary: Like or unlike accommodation
 *     description:  Like or unlike accommodation
 *     tags:
 *       - Accommodations
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
 *       - name: x-access-token
 *         description: Access token.
 *         in: header
 *         required: true
 *         type: string
 *       - name: accommodationId
 *         description:  Like or unlike accommodation
 *         in: path
 *         requiered: true
 *         type: string
 *     responses:
 *       201:
 *         description:  Like accommodation
 *       200:
 *         description:  Unlike accommodation
 *  */
router.post('/like-unlike/:accommodationId', [checkUser, isProfileUpdated, checkIfAccomodationExist], accommodationController.LikeOrUnlike);
/**
 * @swagger
 * /api/v1/accommodations/most-traveled-centres?page={page}&limit={limit}:
 *   get:
 *     security: []
 *     summary: Get most traveled destinations
 *     description: Returns infos about most traveled centres
 *     tags:
 *       - Accommodations
 *     data:
 *       type: array
 *     parameters:
 *       - name: x-access-token
 *         description: Access token.
 *         in: header
 *         required: true
 *         type: string
 *       - name: page
 *         description: page number.
 *         in: path
 *         required: false
 *         default: 1
 *         type: string
 *       - name: limit
 *         description: limited items.
 *         in: path
 *         required: false
 *         default: 2
 *         type: string
 *     responses:
 *       200:
 *         description: Trending centres are retrieved successfully
 *  */
router.get('/most-traveled-centres', [checkUser, isProfileUpdated],
  accommodationController.getMostTravelledCentres);

/**
 * @swagger
 *
 * /api/v1/accommodations/all-accommodations?page={page}&limit={limit}:
 *   get:
 *     security: []
 *     summary: All accommodations on barefoot nomad
 *     description: show all available accommodation on barefoot nomad
 *     tags:
 *       - Accommodations
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
 *     parameters:
 *       - name: x-access-token
 *         description: Access token.
 *         in: header
 *         required: true
 *         type: string
 *       - name: page
 *         description: page number.
 *         in: path
 *         required: false
 *         default: 1
 *         type: string
 *       - name: limit
 *         description: results per page.
 *         in: path
 *         required: false
 *         default: 5
 *         type: string
 *     responses:
 *       200:
 *         description: All accommodations on barefoot nomad
 *  */
router.get('/all-accommodations', [checkUser, isProfileUpdated, validateParams], accommodationController.getAllAccommodations);

/**
 * @swagger
 *
 * /api/v1/accommodations/search?page={page}&limit={limit}&searchKey={searchKey}:
 *   get:
 *     security: []
 *     summary: Search accommodations, you can search by accommodation name or city
 *     description: Search accommodations
 *     tags:
 *       - Accommodations
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
 *     parameters:
 *       - name: x-access-token
 *         description: Access token.
 *         in: header
 *         required: true
 *         type: string
 *       - name: page
 *         description: page number.
 *         in: path
 *         required: false
 *         default: 1
 *         type: string
 *       - name: limit
 *         description: limit items.
 *         in: path
 *         required: false
 *         default: 5
 *         type: string
 *       - name: searchKey
 *         description: key to search.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Requests retrieved successfully
 *  */
router.get('/search', [checkUser, isProfileUpdated, validateParams], accommodationController.searchAccommodations);

/**
 * @swagger
 *
 * /api/v1/accommodations/{id}:
 *   get:
 *     security: []
 *     summary: view one accommodation
 *     description: view one accommodation
 *     tags:
 *       - Accommodations
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
 *     parameters:
 *       - name: x-access-token
 *         description: Access token.
 *         in: header
 *         required: true
 *         type: string
 *       - name: id
 *         description: accommodation id.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Accommodation retrieved successfully
 *  */
router.get('/:id', [checkUser, isProfileUpdated], accommodationController.getOneAccommodation);

export default router;
