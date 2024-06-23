const Diary = require('../models/diary');
const { SendData, ServerError, NotFound, Unauthorized } = require('../helpers/response');
const { canGetUser, canDeleteUser, canUpdateUser } = require('../rbac/users');
const getter = require('../helpers/getter');
const { canGetCompany } = require('../rbac/companies');

const userQuery = ({ filter }) => {
  const query = {};

  if (filter) {
    query.fullname = new RegExp(filter, 'i');
  }

  return query;
};

module.exports.get = async (req, res, next) => {
  try {
    const query = userQuery(req.query);
    const data = await getter(Diary, query, req, res, [...Diary.getFields('listing'), 'diary']);

    return next(SendData(data));
  } catch (err) {
    return next(ServerError(err));
  }
};

module.exports.save = async ({ body }, res, next) => {
  try {
    const data = new Diary(body);
    data.save()
    return next(SendData(data));
  } catch (err) {
    return next(ServerError(err));
  }
};



exports.update = async ({ body }, res, next) => {
  try {
    const filter = { _id: body._id };
    const update = {
      "description": body.description,
      "amount": body.amount,
      "insertDate": body.insertDate
    };

    const diary = await Diary.findOneAndUpdate(filter, update, {
      new: true
    });
    if (diary == null)
      return next(next(NotFound()));
    return next(SendData(diary));
  } catch (err) {
    return next(ServerError(err));
  }
};

module.exports.delete = async ({ params: { id } }, res, next) => {
  try {
    const filter = { _id: id };
    const diary = await Diary.findOneAndDelete(filter)
    if (!diary)
      return next(next(NotFound()));
    return next(SendData({ message: 'Diary entry deleted successfully' }));
  } catch (err) {
    return next(ServerError(err));
  }
};