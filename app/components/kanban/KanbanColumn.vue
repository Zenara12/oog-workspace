<script setup lang="ts">
import { nextTick, ref } from 'vue'
import type { KanbanCard, KanbanColumn } from '~/stores/kanban'

const props = defineProps<{
  column: KanbanColumn
  cards: KanbanCard[]
}>()

const emit = defineEmits<{
  (e: 'move-card', payload: { cardId: string; from: string; to: string; index: number }): void
  (e: 'rename-column', payload: { id: string; title: string }): void
  (e: 'delete-column', columnId: string): void
}>()

const editing = ref(false)
const titleDraft = ref(props.column.title)
const inputRef = ref()

function onDrop(e: DragEvent) {
  const raw = e.dataTransfer?.getData('text/plain')
  if (!raw) return

  try {
    const data = JSON.parse(raw) as { cardId: string; from: string }
    emit('move-card', {
      cardId: data.cardId,
      from: data.from,
      to: props.column.id,
      index: props.cards.length
    })
  } catch {
    // Ignore invalid payloads.
  }
}

function startEdit() {
  editing.value = true
  titleDraft.value = props.column.title
  nextTick(() => {
    inputRef.value?.focus?.()
  })
}

function commitEdit() {
  const title = titleDraft.value.trim()
  if (title && title !== props.column.title) {
    emit('rename-column', { id: props.column.id, title })
  }
  editing.value = false
}

function cancelEdit() {
  editing.value = false
  titleDraft.value = props.column.title
}

function deleteColumn() {
  const ok = confirm(`Delete column "${props.column.title}" and its cards?`)
  if (!ok) return
  emit('delete-column', props.column.id)
}
</script>

<template>
  <UCard class="h-full">
    <template #header>
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1">
          <div v-if="!editing" class="font-semibold">{{ column.title }}</div>
          <UInput
            v-else
            ref="inputRef"
            v-model="titleDraft"
            size="sm"
            @keyup.enter="commitEdit"
            @keyup.esc="cancelEdit"
            @blur="commitEdit"
          />
          <div class="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {{ cards.length }} cards
          </div>
        </div>
        <div class="flex items-center gap-1">
          <UButton
            v-if="!editing"
            size="xs"
            color="gray"
            variant="ghost"
            @click="startEdit"
          >
            Rename
          </UButton>
          <UButton
            v-else
            size="xs"
            color="gray"
            variant="ghost"
            @click="cancelEdit"
          >
            Cancel
          </UButton>
          <UButton size="xs" color="red" variant="ghost" @click="deleteColumn">
            Delete
          </UButton>
        </div>
      </div>
    </template>

    <div
      class="grid gap-2 min-h-24 rounded-lg border border-dashed border-gray-200 dark:border-gray-800 p-2"
      @dragover.prevent
      @drop="onDrop"
    >
      <KanbanCard
        v-for="card in cards"
        :key="card.id"
        :card="card"
        :column-id="column.id"
      />
      <div v-if="!cards.length" class="text-xs text-gray-400 dark:text-gray-500 text-center py-2">
        Drop here
      </div>
    </div>
  </UCard>
</template>
