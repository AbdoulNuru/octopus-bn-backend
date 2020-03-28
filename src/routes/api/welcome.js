import { Router } from 'express';
import Welcome from '../../utils/welcome';

const router = Router();

/**
 * @swagger
 *
 * /api/v1:
 *  get:
 *   description: Welcome message for users
 *   tags:
 *     - Default
 *   responses:
 *     '200':
 *       description: 'Welcome to Barefoot Nomad'
 */
router.get('/', Welcome);


export default router;
