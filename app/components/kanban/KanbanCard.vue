<script setup lang="ts">
import type { KanbanCard as Card } from '~/stores/kanban'

const props = defineProps<{
  card: Card
  columnId: string
}>()

function onDragStart(e: DragEvent) {
  const payload = JSON.stringify({ cardId: props.card.id, from: props.columnId })
  e.dataTransfer?.setData('text/plain', payload)
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}
</script>

<template>
  <div
    class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-3 shadow-sm cursor-grab active:cursor-grabbing"
    draggable="true"
    @dragstart="onDragStart"
  >
    <div class="text-sm font-medium text-gray-900 dark:text-slate-50">{{ card.title }}</div>
    <div class="mt-2 flex flex-wrap gap-2">
      <UBadge v-for="tag in card.tags || []" :key="tag" color="gray" variant="soft">
        {{ tag }}
      </UBadge>
      <UBadge v-if="card.assignee" color="primary" variant="soft">
        {{ card.assignee }}
      </UBadge>
    </div>
  </div>
</template>
