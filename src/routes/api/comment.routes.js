import express from 'express';
import checkUser from 'middlewares/checkUser';
import commentsController from '../../controllers/commentsController';
import commentValidator from '../../validation/commentValidator';
import idValidator from '../../validation/validateId';

const router = express.Router();
const comments = new commentsController();


/**
 * @swagger
 *
 *  /api/v1/requests/comments?requestId={requestId}:
 *   post:
 *     security: []
 *     summary: add a comment
 *     description: add a comment
 *     tags:
 *       - Trips
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
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
 *       - name: requestId
 *         description: requestId.
 *         in: path
 *         required: true
 *         default: please add a request id here
 *         type: string
 *     responses:
 *       200:
 *         description: Requests retrieved successfully
 *  */
router.post('/', checkUser, idValidator, commentValidator, comments.addComment);
/**
 * @swagger
 *
 *  /api/v1/requests/comments?commentId={commentId}:
 *   delete:
 *     security: []
 *     summary: delete a comment
 *     description: delete a comment
 *     tags:
 *       - Trips
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
 *       - name: commentId
 *         description: commentId.
 *         in: path
 *         required: true
 *         default: please add a comment id here
 *         type: string
 *     responses:
 *       200:
 *         description: comment deleted
 *  */
router.delete('/', checkUser, comments.deleteComment);
export default router;
