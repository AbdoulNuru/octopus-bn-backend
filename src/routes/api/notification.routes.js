import express from 'express';
import checkUser from 'middlewares/checkUser';
import validation from 'validation/user.validation';
import haveUnread from 'middlewares/unreadNotifications';
import notificationController from '../../controllers/notification';

const {
  notifyByEmail,
  validateResult,
} = validation;

const router = express.Router();

/**
 * @swagger
 *
 * /api/v1/notifications/preferences:
 *   put:
 *     security: []
 *     summary: Update User preferences on notifications
 *     description: Update User preferences on notifications
 *     tags:
 *       - Notifications
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
 *               notifyByEmail:
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
 *         description: Update User preferences on notifications
 *  */
router.put('/preferences', [checkUser, notifyByEmail, validateResult], notificationController.changePreferrence);
/**
 * @swagger
 *
 * /api/v1/notifications/:
 *   get:
 *     security: []
 *     summary: Get all notifications
 *     description: Get all notifications
 *     tags:
 *       - Notifications
 *     parameters:
 *       - name: x-access-token
 *         description: Access token.
 *         in: header
 *         required: true
 *         type: string
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
 *         description: Get all notifications
 *  */
router.get('/', checkUser, notificationController.getAllNotifications);
/**
 * @swagger
 *
 * /api/v1/notifications/unread:
 *   get:
 *     security: []
 *     summary: get unread notifications
 *     description: get unread notifications
 *     tags:
 *       - Notifications
 *     parameters:
 *       - name: x-access-token
 *         description: Access token.
 *         in: header
 *         required: true
 *         type: string
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
 *         description: get unread notifications
 *  */
router.get('/unread', checkUser, notificationController.unReadNotifications);

/**
 * @swagger
 *
 * /api/v1/notifications/readAll:
 *   put:
 *     security: []
 *     summary: mark all notifications as read
 *     description: Users can mark all unread notifications as read
 *     tags:
 *       - Notifications
 *     parameters:
 *       - name: x-access-token
 *         description: Access token.
 *         in: header
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: all your unread notifications was marked as read
 *  */
router.put('/readAll', [checkUser, haveUnread], notificationController.markAllNotificationAsRead);

export default router;
