const mongoose = require('mongoose');
const softDelete = require('../helpers/softDelete');
const dbFields = require('../helpers/dbFields');
const mongooseHistory = require('../helpers/mongooseHistory');
const user = require('./user');

const { Schema } = mongoose;

const schema = Schema(
    {
        description: {
            type: String,
            maxlength: 128,
            trim: true
        },
        amount: {
            type: Number,
            get: v => (v / 100).toFixed(2),
            set: v => v * 100
        },
        insertDate: {
            type: Date
        },
        user: {
            _id: false,
            email: {
              type: String,
              match: /^\S+@\S+\.\S+$/,
              trim: true,
              lowercase: true,
              index: true
            }
          },
    }
);
schema.plugin(softDelete);
schema.plugin(dbFields, {
    fields: {
      public: ['_id', 'description', 'amount', 'user', 'insertDate'],
      listing: ['_id', 'description', 'amount', 'user', 'insertDate'],
      profile: ['_id', 'description', 'amount', 'user', 'insertDate'],
      cp: ['_id', 'description', 'amount', 'user', 'insertDate']
    }
  });

schema.plugin(
    mongooseHistory({
        mongoose,
        modelName: 'diary_h',
        diaryCollection: 'Diary',
        accountCollection: 'User',
        diaryFieldName: 'diary',
        accountFieldName: 'user',
        noDiffSaveOnMethods: []
    })
);

module.exports = mongoose.models.Diary || mongoose.model('Diary', schema);
