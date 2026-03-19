import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

ProjectSchema.index({ title: "text", description: "text" });

export type ProjectDocument = InferSchemaType<typeof ProjectSchema> & {
  _id: string;
};

export const Project: Model<ProjectDocument> = models.Project || model("Project", ProjectSchema);
