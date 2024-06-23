const { intersection } = require('../helpers/utils');
const Diary = require('../models/diary');

const diaryRbac = async (caller, resourceId, { authorizedRoles = [] }) => {
  const diary = await Diary.findById(resourceId);
  if (!diary) return null;

  const { grants, diary: userDiary = {}, roles: globalRoles } = caller;
  const { roles: companyRoles = [] } = userDiary;
  const roles = Array.from(new Set([...companyRoles, ...globalRoles]));

  if (grants?.type === 'any' || roles.includes('superuser')) return diary;
  if (intersection(authorizedRoles, roles).length && userDiary?.id?.toString() === resourceId) return diary;

  return false;
};

module.exports.canGetDiary = (caller, resourceId) =>
  diaryRbac(caller, resourceId, { authorizedRoles: ['admin', 'user'] });

module.exports.canUpdateDiary = (caller, resourceId) =>
  diaryRbac(caller, resourceId, { authorizedRoles: ['admin', 'user'] });

module.exports.canDeleteDiary = (caller, resourceId) => diaryRbac(caller, resourceId, {});
