import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const NotificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ["assignment", "status_change", "deadline", "project_update", "system"],
    default: "system",
    index: true
  },
  title: { type: String, default: "Notification", trim: true },
  details: { type: String, default: "", trim: true },
  message: { type: String, required: true, trim: true },
  read: { type: Boolean, default: false, index: true },
  relatedTask: { type: Schema.Types.ObjectId, ref: "Task", default: null },
  createdAt: { type: Date, default: Date.now, index: true }
});

export type NotificationDocument = InferSchemaType<typeof NotificationSchema> & {
  _id: string;
};

export const Notification: Model<NotificationDocument> =
  models.Notification || model("Notification", NotificationSchema);
