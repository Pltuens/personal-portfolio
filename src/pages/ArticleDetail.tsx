import { Link, useParams } from 'react-router-dom'
import { Blocks } from '../components/Blocks'
import { Arrow, DemoBadge, Label, useMeta } from '../components/ui'
import { articles, getArticle } from '../data/articles'
import { contact } from '../data/profile'
import NotFound from './NotFound'

export default function ArticleDetail() {
  const { slug } = useParams()
  const article = getArticle(slug)
  useMeta(article ? `${article.title} — Pan Wangkun` : '笔记未找到', article?.summary)

  if (!article) return <NotFound />

  const others = articles.filter((a) => a.slug !== article.slug).slice(0, 2)

  return (
    <article>
      <header className="border-b border-line pt-10 pb-10 md:pt-14">
        <div className="container-page max-w-3xl">
          <Link
            to="/writing"
            className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
          >
            <Arrow className="h-3.5 w-3.5 rotate-180" />
            全部笔记
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Label>{article.kicker}</Label>
            <DemoBadge />
          </div>
          <h1 className="mt-5 font-display text-[clamp(1.75rem,4.2vw,2.9rem)] leading-[1.16]">
            {article.title}
          </h1>
          <p className="mt-6 max-w-[62ch] text-[15px] leading-[1.9] text-ink-soft">
            {article.summary}
          </p>
          <div className="mt-8 flex flex-wrap gap-6 border-t border-line pt-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
            <span>{article.date}</span>
            <span>{article.readTime}</span>
            <span>{article.category}</span>
          </div>
        </div>
      </header>

      <div className="container-page max-w-3xl py-12 md:py-16">
        <Blocks blocks={article.blocks} />

        <div className="mt-16 border-t border-line pt-6">
          <p className="text-[12.5px] leading-[1.9] text-muted">
            这篇笔记是示例内容，用于展示文章页的排版与结构。想继续聊其中某一点，可以
            {contact.email ? (
              <a href={`mailto:${contact.email}`} className="link-underline mx-1 text-ink">
                发邮件给我
              </a>
            ) : (
              <Link to="/contact" className="link-underline mx-1 text-ink">
                通过联系页
              </Link>
            )}
            找我。
          </p>
        </div>
      </div>

      <div className="container-page max-w-3xl">
        <div className="grid gap-4 border-t border-ink/70 pt-8 sm:grid-cols-2">
          {others.map((a) => (
            <Link
              key={a.slug}
              to={`/writing/${a.slug}`}
              className="group border-b border-line pb-5"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {a.kicker}
              </span>
              <p className="mt-2 font-display text-[16.5px] leading-snug transition-colors group-hover:text-accent">
                {a.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </article>
  )
}
