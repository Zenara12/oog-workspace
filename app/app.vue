<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

function toggleColorMode() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
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
          <UButton color="gray" variant="soft">Filter</UButton>
          <UButton>New Card</UButton>
        </div>
      </div>

      <KanbanBoard />
    </div>
  </div>
</template>
