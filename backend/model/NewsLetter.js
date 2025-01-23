import mongoose, {Schema} from 'mongoose'

const newsletterSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('subscriber', newsletterSchema);
