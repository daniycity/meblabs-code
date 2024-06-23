const express = require('express');
const controller = require('../controllers/diary');
const { isAuth } = require('../middlewares/isAuth');
const rbac = require('../middlewares/rbac');
const { validator } = require('../middlewares/validator');

const router = express.Router();

router
  .route('/')
  .get(controller.get, isAuth);

router
  .route('/')
  .post(controller.save, isAuth);

router
  .route('/')
  .patch(controller.update, isAuth);

router
  .route('/:id')
  .delete(validator({ params: 'id' }), controller.delete, isAuth);
// router
//   .route('/:id')
//   .get(validator({ params: 'id' }), isAuth, rbac('companies', 'read'), controller.getById)
//   .patch(validator({ params: 'id', body: 'updateCompany' }), isAuth, rbac('companies', 'update'), controller.update)
//   .delete(validator({ params: 'id' }), isAuth, rbac('companies', 'delete'), controller.delete);

// router
//   .route('/:id/invite')
//   .post(validator({ body: 'invite', params: 'id' }), isAuth, rbac('users', 'invite'), controller.inviteUser);

// router.route('/:id/pic').get(validator({ params: 'id' }), controller.getPic);

module.exports = router;
