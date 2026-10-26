import type { Block } from '../data/projects'
import { ProjectArt } from './ProjectArt'

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-7">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'p':
      return (
        <p className="max-w-[68ch] text-[15.5px] leading-[1.95] text-ink-soft">
          {block.text}
        </p>
      )

    case 'list':
      return block.ordered ? (
        <ol className="max-w-[68ch] space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-4 text-[15px] leading-[1.85] text-ink-soft">
              <span className="mt-[3px] shrink-0 font-mono text-[11px] text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="max-w-[68ch] space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-4 text-[15px] leading-[1.85] text-ink-soft">
              <span className="mt-[10px] h-[5px] w-[5px] shrink-0 bg-ink/50" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )

    case 'table':
      return (
        <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
          <table className="w-full min-w-[520px] border-collapse text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-ink/70">
                {block.head.map((h) => (
                  <th
                    key={h}
                    className="py-3 pr-6 font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-line align-top">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`py-3.5 pr-6 leading-[1.7] ${
                        j === 0 ? 'text-ink' : 'text-ink-soft'
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'callout':
      return (
        <aside className="max-w-[68ch] border-l-2 border-accent bg-surface px-5 py-4">
          {block.title && (
            <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent">
              {block.title}
            </p>
          )}
          <p className="text-[14.5px] leading-[1.85] text-ink-soft">{block.text}</p>
        </aside>
      )

    case 'quote':
      return (
        <blockquote className="max-w-[60ch] border-l border-line py-1 pl-6">
          <p className="font-display text-[clamp(1.15rem,2vw,1.45rem)] leading-[1.6] text-ink">
            {block.text}
          </p>
        </blockquote>
      )

    case 'steps':
      return (
        <ol className="divide-y divide-line border-y border-line">
          {block.items.map((s, i) => (
            <li key={i} className="grid gap-2 py-6 md:grid-cols-[auto_1fr] md:gap-8">
              <div className="flex items-baseline gap-3 md:w-28">
                <span className="font-mono text-[11px] text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-[16px]">{s.title}</span>
              </div>
              <p className="max-w-[60ch] text-[14.5px] leading-[1.9] text-ink-soft">
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      )

    case 'figure':
      return (
        <figure className="mt-2">
          <div className="border border-line bg-surface">
            <ProjectArt art={block.art} className="h-auto w-full" />
          </div>
          <figcaption className="mt-3 font-mono text-[10.5px] tracking-wide text-muted">
            {block.caption}
          </figcaption>
        </figure>
      )

    default:
      return null
  }
}
