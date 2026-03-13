<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useKanbanStore } from '~/stores/kanban'

const store = useKanbanStore()
const { columns, cards } = storeToRefs(store)

const newColumnTitle = ref('')
const scrollEl = ref<HTMLElement | null>(null)
const isPanning = ref(false)
let panStartX = 0
let panStartLeft = 0

function onMoveCard(payload: { cardId: string; from: string; to: string; index: number }) {
  store.moveCard(payload.cardId, payload.from, payload.to, payload.index)
}

function onRenameColumn(payload: { id: string; title: string }) {
  store.renameColumn(payload.id, payload.title)
}

function onDeleteColumn(columnId: string) {
  store.deleteColumn(columnId)
}

function addColumn() {
  const title = newColumnTitle.value.trim()
  if (!title) return
  store.addColumn(title)
}

function onPointerDown(e: PointerEvent) {
  if (e.button !== 0) return
  const target = e.target as HTMLElement | null
  if (target?.closest('[draggable="true"]')) return

  const el = scrollEl.value
  if (!el) return

  isPanning.value = true
  panStartX = e.clientX
  panStartLeft = el.scrollLeft
  el.setPointerCapture?.(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!isPanning.value) return
  const el = scrollEl.value
  if (!el) return

  const dx = e.clientX - panStartX
  el.scrollLeft = panStartLeft - dx
}

function onPointerUp(e: PointerEvent) {
  if (!isPanning.value) return
  isPanning.value = false
  const el = scrollEl.value
  if (el?.hasPointerCapture?.(e.pointerId)) {
    el.releasePointerCapture(e.pointerId)
  }
}
</script>

<template>
  <div class="mb-4 flex justify-end">
    <UModal title="Modal with title">
      <UButton label="Add column" color="neutral" variant="subtle" />
      <template #body>
        <UCard>
          <div class="grid gap-3">
            <UInput v-model="newColumnTitle" placeholder="e.g. Backlog" @keyup.enter="addColumn" />
            <div class="flex items-center justify-end gap-2">
              <UButton color="neutral" variant="soft" @click="showAddModal = false">
                Cancel
              </UButton>
              <UButton :disabled="!newColumnTitle.trim()" @click="addColumn">
                Add column
              </UButton>
            </div>
          </div>
        </UCard>
      </template>
    </UModal>
  </div>

  <div
    ref="scrollEl"
    class="flex gap-4 overflow-x-auto py-2 h-full select-none cursor-grab active:cursor-grabbing"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @pointerleave="onPointerUp"
  >
    <div
      v-for="column in columns"
      :key="column.id"
      class="min-w-[280px] max-w-[320px] flex-shrink-0 min-h-20"
    >
      <KanbanColumn
        :column="column"
        :cards="column.cardIds.map((id) => cards[id])"
        @move-card="onMoveCard"
        @rename-column="onRenameColumn"
        @delete-column="onDeleteColumn"
      />
    </div>
  </div>
</template>
