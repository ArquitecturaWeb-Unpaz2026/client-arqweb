<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as membersApi from '../api'
import { roleLabel } from '@/shared/auth/roleLabels'
import type { Member } from '../types'

const members = ref<Member[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    members.value = await membersApi.listMembers()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'No se pudieron cargar los miembros'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="ui-page ui-page--wide ui-stack members">
    <p v-if="loading" class="ui-text-muted">Cargando miembros…</p>
    <p v-else-if="error" class="ui-text-error">{{ error }}</p>

    <div v-else class="ui-table-wrap">
      <table class="ui-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo electrónico</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in members" :key="member.id">
            <td>{{ member.name }}</td>
            <td>{{ member.email }}</td>
            <td>{{ roleLabel(member.role) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
