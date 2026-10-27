import { onMounted, ref } from 'vue'
import * as tasksApi from '../api'
import type { Task, TaskInput } from '../types'

export function useTasks() {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      tasks.value = await tasksApi.listTasks()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'No se pudieron cargar las tareas'
    } finally {
      loading.value = false
    }
  }

  async function create(input: TaskInput) {
    const created = await tasksApi.createTask(input)
    tasks.value = [created, ...tasks.value]
    return created
  }

  async function remove(id: string) {
    await tasksApi.deleteTask(id)
    tasks.value = tasks.value.filter((task) => task.id !== id)
  }

  onMounted(load)

  return { tasks, loading, error, load, create, remove }
}
