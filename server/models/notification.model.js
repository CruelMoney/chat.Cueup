import mongoose from 'mongoose';

/**
 * Notification Schema
 */
const NotificationSchema = new mongoose.Schema({
  userId:{
    type: String,
    required: true
  },
  content:{
    type: String,
    required: true
  },
  read:{
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * - pre-post-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
NotificationSchema.method({});

/**
 * Statics
 */
NotificationSchema.statics = {
  
  /**
   * List notifications.
   * @returns {Promise<Notification[]>}
   */
  list() {
    return this.find()
      .exec();
  },

  /**
   * List notifications in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of notifications to be skipped.
   * @param {number} limit - Limit number of notifications to be returned.
   * @returns {Promise<Notification[]>}
   */
  listLazy({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }
};

/**
 * @typedef Notification
 */
export default mongoose.model('Notification', NotificationSchema);
