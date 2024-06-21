import { Metadata } from "next"
import { z } from "zod"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { taskSchema } from "./data/schema"
import tasksData from "./data/tasks.json"

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
}

const tasks = z.array(taskSchema).parse(tasksData)

export default function TaskPage() {
  return (
    <>
        <DataTable data={tasks} columns={columns} />
    </>
  )
}