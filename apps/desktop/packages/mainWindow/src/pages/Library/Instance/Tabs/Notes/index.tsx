import { createSignal, onMount, Show, createEffect } from "solid-js"
import { Button, TextArea, Badge, EmptyState, Separator } from "@gd/ui"
import { Trans, useTransContext } from "@gd/i18n"
import { useParams } from "@solidjs/router"

interface Note {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

const Notes = () => {
  const params = useParams()
  const [t] = useTransContext()
  const [notes, setNotes] = createSignal<Note[]>([])
  const [activeNote, setActiveNote] = createSignal<Note | null>(null)
  const [isEditing, setIsEditing] = createSignal(false)
  const [editContent, setEditContent] = createSignal("")
  const [isLoading, setIsLoading] = createSignal(true)
  const [isSaving, setIsSaving] = createSignal(false)

  onMount(() => {
    // Load notes from local storage or create default
    setTimeout(() => {
      const savedNotes = localStorage.getItem(`instance-notes-${params.id}`)
      if (savedNotes) {
        try {
          const parsed = JSON.parse(savedNotes)
          setNotes(parsed.map((n: any) => ({
            ...n,
            createdAt: new Date(n.createdAt),
            updatedAt: new Date(n.updatedAt),
          })))
        } catch {
          createDefaultNote()
        }
      } else {
        createDefaultNote()
      }
      setIsLoading(false)
    }, 300)
  })

  const createDefaultNote = () => {
    const defaultNote: Note = {
      id: Date.now().toString(),
      content: "# Instance Notes\n\nWrite your notes here...\n\n## TODO\n- [ ] Add mods\n- [ ] Configure settings\n\n## Changelog\n- Initial setup",
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    }
    setNotes([defaultNote])
    setActiveNote(defaultNote)
  }

  const saveNotes = (notesToSave: Note[]) => {
    localStorage.setItem(`instance-notes-${params.id}`, JSON.stringify(notesToSave))
  }

  const handleSave = async () => {
    if (!activeNote()) return
    setIsSaving(true)

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const updatedNote: Note = {
      ...activeNote()!,
      content: editContent(),
      updatedAt: new Date(),
    }

    const updatedNotes = notes().map(n =>
      n.id === updatedNote.id ? updatedNote : n
    )

    setNotes(updatedNotes)
    setActiveNote(updatedNote)
    saveNotes(updatedNotes)
    setIsEditing(false)
    setIsSaving(false)
  }

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    }
    const updatedNotes = [newNote, ...notes()]
    setNotes(updatedNotes)
    setActiveNote(newNote)
    setEditContent("")
    setIsEditing(true)
    saveNotes(updatedNotes)
  }

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes().filter(n => n.id !== noteId)
    setNotes(updatedNotes)
    if (activeNote()?.id === noteId) {
      setActiveNote(updatedNotes[0] || null)
    }
    saveNotes(updatedNotes)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getWordCount = (content: string) => {
    return content.trim().split(/\s+/).filter(Boolean).length
  }

  const getCharCount = (content: string) => {
    return content.length
  }

  return (
    <div class="h-full flex">
      {/* Notes Sidebar */}
      <div class="w-64 border-r border-darkSlate-700 flex flex-col bg-darkSlate-800/50">
        <div class="p-3 border-b border-darkSlate-700 flex items-center justify-between">
          <h3 class="text-sm font-medium text-lightSlate-300">
            <Trans key="ui:_trn_notes" />
          </h3>
          <Button
            type="secondary"
            size="small"
            onClick={handleCreateNote}
          >
            <div class="i-hugeicons:plus-sign w-4 h-4" />
          </Button>
        </div>

        <div class="flex-1 overflow-y-auto">
          <Show when={!isLoading()} fallback={
            <div class="flex items-center justify-center h-24">
              <div class="i-hugeicons:loading-03 w-5 h-5 animate-spin text-primary-500" />
            </div>
          }>
            <Show when={notes().length > 0} fallback={
              <EmptyState
                icon="i-hugeicons:note-01"
                title="No notes yet"
                description="Create your first note to get started"
                size="sm"
              />
            }>
              <div class="p-2 space-y-1">
                {notes().map(note => (
                  <button
                    class={`w-full text-left p-2 rounded-lg transition-colors ${
                      activeNote()?.id === note.id
                        ? "bg-primary-500/20 border border-primary-500/30"
                        : "hover:bg-darkSlate-700/50 border border-transparent"
                    }`}
                    onClick={() => {
                      setActiveNote(note)
                      setIsEditing(false)
                    }}
                  >
                    <div class="text-sm text-lightSlate-200 truncate">
                      {note.content.split("\n")[0].replace(/^#+ /, "") || "Untitled Note"}
                    </div>
                    <div class="text-xs text-lightSlate-500 mt-1">
                      {formatDate(note.updatedAt)}
                    </div>
                  </button>
                ))}
              </div>
            </Show>
          </Show>
        </div>
      </div>

      {/* Note Content */}
      <div class="flex-1 flex flex-col">
        <Show when={activeNote()} fallback={
          <div class="flex-1 flex items-center justify-center">
            <EmptyState
              icon="i-hugeicons:note-add"
              title="Select or create a note"
              description="Choose a note from the sidebar or create a new one"
              action={{
                label: "Create Note",
                onClick: handleCreateNote,
              }}
            />
          </div>
        }>
          {/* Note Header */}
          <div class="p-3 border-b border-darkSlate-700 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Badge type="primary" size="small">
                {getWordCount(activeNote()?.content || "")} words
              </Badge>
              <span class="text-xs text-lightSlate-500">
                Last edited: {formatDate(activeNote()?.updatedAt || new Date())}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <Show when={!isEditing()}>
                <Button
                  type="secondary"
                  size="small"
                  onClick={() => {
                    setEditContent(activeNote()?.content || "")
                    setIsEditing(true)
                  }}
                >
                  <div class="i-hugeicons:pencil-edit-02 w-4 h-4 mr-2" />
                  <Trans key="ui:_trn_edit" />
                </Button>
              </Show>
              <Show when={notes().length > 1}>
                <Button
                  type="secondary"
                  size="small"
                  variant="destructive"
                  onClick={() => handleDeleteNote(activeNote()!.id)}
                >
                  <div class="i-hugeicons:delete-02 w-4 h-4" />
                </Button>
              </Show>
            </div>
          </div>

          {/* Note Content */}
          <div class="flex-1 overflow-y-auto p-4">
            <Show when={!isEditing()} fallback={
              <div class="h-full flex flex-col">
                <TextArea
                  value={editContent()}
                  onInput={(e) => setEditContent(e.target.value)}
                  placeholder="Write your notes here... (Markdown supported)"
                  class="flex-1 font-mono text-sm resize-none"
                />
                <div class="flex items-center justify-between mt-3 pt-3 border-t border-darkSlate-700">
                  <span class="text-xs text-lightSlate-500">
                    {getCharCount(editContent())} characters
                  </span>
                  <div class="flex gap-2">
                    <Button
                      type="secondary"
                      size="small"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      onClick={handleSave}
                      disabled={isSaving()}
                    >
                      <Show when={isSaving()} fallback={
                        <>
                          <div class="i-hugeicons:save-01 w-4 h-4 mr-2" />
                          <Trans key="ui:_trn_save" />
                        </>
                      }>
                        <div class="i-hugeicons:loading-03 w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </Show>
                    </Button>
                  </div>
                </div>
              </div>
            }>
              <div class="prose prose-invert prose-sm max-w-none">
                <MarkdownContent content={activeNote()?.content || ""} />
              </div>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  )
}

// Simple markdown renderer component
function MarkdownContent(props: { content: string }) {
  const renderMarkdown = (content: string) => {
    return content
      // Headers
      .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-lightSlate-200 mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-lightSlate-100 mt-4 mb-2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-lightSlate-50 mt-4 mb-3">$1</h1>')
      // Bold and Italic
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Checkboxes
      .replace(/^- \[x\] (.+)$/gm, '<div class="flex items-center gap-2"><div class="i-hugeicons:tick-02 w-4 h-4 text-green-500" /><span class="text-lightSlate-400 line-through">$1</span></div>')
      .replace(/^- \[ \] (.+)$/gm, '<div class="flex items-center gap-2"><div class="i-hugeicons:circle w-4 h-4 text-lightSlate-600" /><span class="text-lightSlate-300">$1</span></div>')
      // Lists
      .replace(/^- (.+)$/gm, '<div class="flex items-start gap-2"><div class="i-hugeicons:bullet w-4 h-4 text-lightSlate-500 mt-1" /><span class="text-lightSlate-300">$1</span></div>')
      // Code blocks
      .replace(/`([^`]+)`/g, '<code class="bg-darkSlate-700 px-1.5 py-0.5 rounded text-xs text-primary-400 font-mono">$1</code>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="text-lightSlate-300 mb-3">')
  }

  return (
    <div
      class="markdown-content"
      innerHTML={renderMarkdown(props.content)}
    />
  )
}

export default Notes
