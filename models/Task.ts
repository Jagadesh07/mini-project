import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const TaskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Completed"],
      default: "Todo",
      index: true
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
      index: true
    },
    deadline: { type: Date, required: true, index: true }
  },
  { timestamps: true }
);

TaskSchema.index({ title: "text", description: "text" });

export type TaskDocument = InferSchemaType<typeof TaskSchema> & {
  _id: string;
};

export const Task: Model<TaskDocument> = models.Task || model("Task", TaskSchema);
