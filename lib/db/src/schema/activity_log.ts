import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { projectsTable } from "./projects";
import { tasksTable } from "./tasks";

export const activityLogTable = pgTable("activity_log", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  type: text("type", {
    enum: [
      "task_created",
      "task_updated",
      "task_completed",
      "member_added",
      "project_created",
    ],
  }).notNull(),
  description: text("description").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  projectId: integer("project_id").references(() => projectsTable.id, {
    onDelete: "cascade",
  }),
  taskId: integer("task_id").references(() => tasksTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ActivityLog = typeof activityLogTable.$inferSelect;
