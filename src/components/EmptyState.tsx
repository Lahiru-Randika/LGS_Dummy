import { Inbox } from 'lucide-react'

export function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="empty-state"><span><Inbox size={24} /></span><h3>{title}</h3><p>{body}</p></div>
}
