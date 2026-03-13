import { defineStore } from 'pinia'

export type KanbanCard = {
  id: string
  title: string
  assignee?: string
  tags?: string[]
}

export type KanbanColumn = {
  id: string
  title: string
  cardIds: string[]
}

export const useKanbanStore = defineStore('kanban', {
  state: () => ({
    cards: {
      c1: { id: 'c1', title: 'Draft dashboard layout', assignee: 'Alex', tags: ['design'] },
      c2: { id: 'c2', title: 'Wire kanban store', assignee: 'Sam', tags: ['pinia'] },
      c3: { id: 'c3', title: 'Implement drag & drop', assignee: 'Lee', tags: ['ux'] },
      c4: { id: 'c4', title: 'Connect Nuxt UI components', assignee: 'Rae', tags: ['ui'] }
    } as Record<string, KanbanCard>,
    columns: [
      { id: 'todo', title: 'To Do', cardIds: ['c1', 'c2'] },
      { id: 'doing', title: 'In Progress', cardIds: ['c3'] },
      { id: 'done', title: 'Done', cardIds: ['c4'] }
    ] as KanbanColumn[]
  }),
  actions: {
    addColumn(title: string) {
      const cleanTitle = title.trim()
      if (!cleanTitle) return

      const id = `col_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
      this.columns.push({ id, title: cleanTitle, cardIds: [] })
    },
    renameColumn(columnId: string, title: string) {
      const cleanTitle = title.trim()
      if (!cleanTitle) return

      const column = this.columns.find((c) => c.id === columnId)
      if (!column) return

      column.title = cleanTitle
    },
    deleteColumn(columnId: string) {
      const column = this.columns.find((c) => c.id === columnId)
      if (!column) return

      const remaining = this.columns.filter((c) => c.id !== columnId)
      const remainingCardIds = new Set(remaining.flatMap((c) => c.cardIds))

      for (const cardId of column.cardIds) {
        if (!remainingCardIds.has(cardId)) {
          delete this.cards[cardId]
        }
      }

      this.columns = remaining
    },
    moveCard(cardId: string, fromColumnId: string, toColumnId: string, toIndex: number) {
      const from = this.columns.find((c) => c.id === fromColumnId)
      const to = this.columns.find((c) => c.id === toColumnId)
      if (!from || !to) return

      if (!from.cardIds.includes(cardId)) return

      from.cardIds = from.cardIds.filter((id) => id !== cardId)
      const index = Math.max(0, Math.min(toIndex, to.cardIds.length))
      to.cardIds.splice(index, 0, cardId)
    }
  }
})
