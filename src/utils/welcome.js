/**
 *
 * @param {object} req
 * @param {object} res
 * @returns {object}
 */

const Welcome = (req, res) => {
    return res.status(200).json({
      message: req.i18n.__('Welcome')
    });
  }

export default Welcome;
