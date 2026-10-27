import { useState } from 'react'
import { Arrow } from './ui'

/**
 * 站内视频窗口
 * ------------------------------------------------------------------
 * 传了 src 就用原生 <video> 直接播（mp4 放 public/videos/ 下即可）；
 * 没传、或文件还没放进来的，就收成一条窄面板（说明 + 外部链接），
 * 而不是撑一个 16:9 的空框 —— 空框只会告诉来访者「这里什么都没有」。
 */

type Props = {
  src?: string
  poster?: string
  title?: string
  note?: string
  /** 视频还在整理时的外部观看地址 */
  externalHref?: string
  externalLabel?: string
}

export default function VideoPlayer({
  src,
  poster,
  title = '演示视频',
  note,
  externalHref,
  externalLabel = '外部观看',
}: Props) {
  const [broken, setBroken] = useState(false)
  const playable = Boolean(src) && !broken

  if (!playable) {
    return (
      <div className="hud-frame flex flex-col gap-4 border border-line bg-paper-deep px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5">
        <div className="flex items-start gap-3.5">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/25">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-3.5 w-3.5 fill-accent/70" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent/75">
              Demo Reel / <span className="text-muted">Pending</span>
            </p>
            <p className="mt-1.5 max-w-[54ch] text-[12.5px] leading-[1.75] text-muted">
              {note ?? `${title}成片还在整理，需要看的话可以直接找我要原始素材。`}
            </p>
          </div>
        </div>
        {externalHref && (
          <a
            href={externalHref}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex shrink-0 items-center gap-2 self-start border border-accent/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent hover:text-[#04121a] sm:self-auto"
          >
            {externalLabel}
            <Arrow className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="hud-frame relative overflow-hidden border border-line bg-paper-deep">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">
        <span className="text-accent/75">Demo Reel / {title}</span>
        <span className="text-muted">MP4</span>
      </div>

      <div className="aspect-[4/3] w-full sm:aspect-video">
        <video
          className="h-full w-full bg-black object-contain"
          src={src}
          poster={poster}
          controls
          playsInline
          preload="metadata"
          onError={() => setBroken(true)}
        >
          你的浏览器不支持视频播放。
        </video>
      </div>
    </div>
  )
}
