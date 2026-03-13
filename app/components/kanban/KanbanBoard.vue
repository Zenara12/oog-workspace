<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useKanbanStore } from '~/stores/kanban'

const store = useKanbanStore()
const { columns, cards } = storeToRefs(store)

const showAddModal = ref(false)
const newColumnTitle = ref('')

watch(showAddModal, (open) => {
  if (!open) newColumnTitle.value = '';
})

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
  showAddModal.value = false
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

  <div class="grid gap-4 md:grid-cols-3">
    <KanbanColumn
      v-for="column in columns"
      :key="column.id"
      :column="column"
      :cards="column.cardIds.map((id:number) => cards[id])"
      @move-card="onMoveCard"
      @rename-column="onRenameColumn"
      @delete-column="onDeleteColumn"
    />
  </div>

  
</template>
