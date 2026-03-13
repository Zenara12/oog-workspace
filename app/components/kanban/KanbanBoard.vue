<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useKanbanStore } from '~/stores/kanban'

const store = useKanbanStore()
const { columns, cards } = storeToRefs(store)

function onMoveCard(payload: { cardId: string; from: string; to: string; index: number }) {
  store.moveCard(payload.cardId, payload.from, payload.to, payload.index)
}

function onRenameColumn(payload: { id: string; title: string }) {
  store.renameColumn(payload.id, payload.title)
}

function onDeleteColumn(columnId: string) {
  store.deleteColumn(columnId)
}
</script>

<template>
  <div class="grid gap-4 md:grid-cols-3">
    <KanbanColumn
      v-for="column in columns"
      :key="column.id"
      :column="column"
      :cards="column.cardIds.map((id) => cards[id])"
      @move-card="onMoveCard"
      @rename-column="onRenameColumn"
      @delete-column="onDeleteColumn"
    />
  </div>
</template>
