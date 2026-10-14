import type { CSSProperties } from 'react'
import { LockIcon, SyncIcon } from './CalendarMonth'
import { cx } from '../lib/cx'
import { TaskTag } from './ui'

export interface TaskView {
  title: string
  time: string
  done: boolean
  tag?: { label: string; color: string }
  /** task của người khác: chỉ xem, hiện tên chủ task */
  owner?: { name: string; color: string }
  locked?: boolean
  pendingSync?: boolean
}

export function TaskRow({ task, onToggle }: { task: TaskView; onToggle?: () => void }) {
  const readOnly = task.locked || !!task.owner
  return (
    <div className="flex items-center gap-2.5 border-t-[1.5px] border-dashed border-line py-[9px] first:border-t-0">
      <button
        type="button"
        role="checkbox"
        aria-checked={task.done}
        aria-label={task.title}
        disabled={readOnly}
        onClick={onToggle}
        className={cx(
          'relative h-5 w-5 shrink-0 rounded-md border-2 transition',
          task.owner ? 'border-(--owner)' : 'border-ink',
          task.done && (task.owner ? 'bg-(--owner)' : 'bg-ink'),
          readOnly && !task.done && 'opacity-50',
        )}
        style={task.owner ? ({ '--owner': task.owner.color } as CSSProperties) : undefined}
      >
        {task.done && (
          <span className="absolute top-px left-[5px] h-2.5 w-[5px] rotate-40 border-r-[2.5px] border-b-[2.5px] border-butter" />
        )}
      </button>
      <div className={cx('min-w-0 flex-1 text-body font-medium', task.done && 'text-soft line-through')}>
        <div className="break-words">{task.title}</div>
        <div className="flex flex-wrap items-center gap-1.5 text-micro text-soft no-underline">
          <span>{task.time}</span>
          {task.owner && (
            <span className="font-bold" style={{ color: task.owner.color }}>
              · {task.owner.name}
            </span>
          )}
        </div>
      </div>
      {task.tag && <TaskTag color={task.tag.color}>{task.tag.label}</TaskTag>}
      {task.pendingSync && (
        <span className="grid h-5 w-5 place-items-center rounded-full bg-butter text-navy" title="Chờ đồng bộ">
          <SyncIcon size={11} />
        </span>
      )}
      {task.locked && (
        <span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-paper" title="Đã khóa">
          <LockIcon size={10} />
        </span>
      )}
    </div>
  )
}
