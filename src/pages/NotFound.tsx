import { Link } from 'react-router-dom'
import { Arrow, Label, useMeta } from '../components/ui'

export default function NotFound() {
  useMeta('页面不存在 — Pan Wangkun')

  return (
    <section className="container-page flex min-h-[60vh] flex-col justify-center py-20">
      <Label>Error 404</Label>
      <h1 className="display-xl mt-5">这一页没找到。</h1>
      <p className="mt-5 max-w-[46ch] text-[14.5px] leading-[1.9] text-ink-soft">
        链接可能已经改过，或者地址拼错了。回首页或作品列表都能继续看。
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-transparent hover:text-ink"
        >
          返回首页
          <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          to="/works"
          className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          作品列表
        </Link>
      </div>
    </section>
  )
}
