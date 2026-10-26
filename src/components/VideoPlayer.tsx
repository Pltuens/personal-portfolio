import { useState } from 'react'
import { Arrow } from './ui'

/**
 * 站内视频窗口
 * ------------------------------------------------------------------
 * 传了 src 就用原生 <video> 直接播（mp4 放 public/videos/ 下即可）；
 * 没传、或文件还没放进来的，就渲染成同一个外框的占位态，
 * 保证版式不塌、页面上不会出现裂图。
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

  return (
    <div className="hud-frame relative overflow-hidden border border-line bg-paper-deep">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">
        <span className="text-accent/75">Demo Reel / {title}</span>
        <span className="text-muted">{playable ? 'MP4' : 'Pending'}</span>
      </div>

      <div className="aspect-[4/3] w-full sm:aspect-video">
        {playable ? (
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
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-accent/30">
              <span className="absolute inset-0 animate-ping rounded-full border border-accent/15" />
              <svg viewBox="0 0 24 24" className="ml-1 h-5 w-5 fill-accent/80" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <div>
              <p className="font-display text-[17px] text-ink">{title}正在整理</p>
              <p className="mt-2 max-w-[42ch] text-[12.5px] leading-[1.8] text-muted">
                {note ?? '成片还没放上来，需要看的话可以直接找我要原始素材。'}
              </p>
            </div>
            {externalHref && (
              <a
                href={externalHref}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-2 border border-accent/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent hover:text-[#04121a]"
              >
                {externalLabel}
                <Arrow className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
