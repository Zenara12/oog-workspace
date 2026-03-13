<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const kanban = useKanbanStore()

const showAddModal = ref(false)
const newColumnTitle = ref('')

watch(showAddModal, (open) => {
  if (!open) newColumnTitle.value = ''
})

function toggleColorMode() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

function addColumn() {
  const title = newColumnTitle.value.trim()
  if (!title) return
  kanban.addColumn(title)
  showAddModal.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 p-6">
    <NuxtRouteAnnouncer />
    <div class="mx-auto flex max-w-6xl flex-col gap-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold">Kanban Dashboard</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">Nuxt UI + Pinia example board</p>
        </div>
        <div class="flex items-center gap-2">
          <UButton color="gray" variant="soft" @click="toggleColorMode">
            {{ isDark ? 'Light Mode' : 'Dark Mode' }}
          </UButton>
          <UButton color="gray" variant="soft" @click="showAddModal = true">Add column</UButton>
          <UButton color="gray" variant="soft">Filter</UButton>
          <UButton>New Card</UButton>
        </div>
      </div>

      <KanbanBoard />
    </div>

    <UModal v-model="showAddModal">
      <UCard>
        <template #header>
          <div class="font-semibold">Add column</div>
        </template>

        <div class="grid gap-3">
          <UInput
            v-model="newColumnTitle"
            placeholder="e.g. Backlog"
            @keyup.enter="addColumn"
          />
          <div class="flex items-center justify-end gap-2">
            <UButton color="gray" variant="soft" @click="showAddModal = false">
              Cancel
            </UButton>
            <UButton :disabled="!newColumnTitle.trim()" @click="addColumn">
              Add column
            </UButton>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>
