const { Schema, model } = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const { dataBaseEnum } = require('../constants');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    avatar: {
        type: String,
    },

    avatars: [{ type: String }],

    email: {
        type: String,
        unique: true,
        required: true
    },

    age: {
        type: Number,
        default: 15
    },

    password: {
        type: String,
        required: true
    },

    activate_token: {
        type: String
    },

    activate_status: {
        type: String,
        required: true
    },

    forgot_token: {
        type: String
    },

}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });

userSchema.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true
});

module.exports = model(dataBaseEnum.USER, userSchema);
