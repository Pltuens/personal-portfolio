import { Arrow, Label, PageHeader, useMeta } from '../components/ui'
import { contact } from '../data/profile'

const canShare = [
  '《鸣潮》声骸系统拆解案（飞书文档）',
  'Aura / Slash 原型演示视频',
  'GAS 战斗框架与状态机结构说明',
  '拆解案里的数值观察表',
]

export default function Contact() {
  useMeta('联系 — Pan Wangkun', '作品集联系方式：邮箱、GitHub 与可提供的补充材料。')

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            看完了，
            <br />
            就直接说。
          </>
        }
        lead="2028 届，目前在深圳腾娱互动武汉分公司做策划培训生。看作品、要完整拆解文档或演示视频、聊某个战斗机制怎么搭，都可以直接联系。"
      />

      <section className="container-page py-12 md:py-16">
        <div className="grid gap-px border border-line bg-line md:grid-cols-2">
          {/* 邮箱 */}
          <div className="bg-paper p-7 md:p-9">
            <div>
              <Label>Email</Label>
            </div>
            {contact.email ? (
              <a
                href={`mailto:${contact.email}`}
                className="link-underline mt-4 block font-display text-[clamp(1.3rem,3vw,2rem)] leading-tight"
              >
                {contact.email}
              </a>
            ) : (
              <div className="mt-4">
                <p className="font-display text-[clamp(1.3rem,3vw,2rem)] leading-tight text-muted">
                  邮箱待填写
                </p>
                <p className="mt-3 max-w-[40ch] text-[13px] leading-[1.85] text-muted">
                  联系方式尚未提供，所以这里不生成任何虚构邮箱。可先通过下方的 GitHub
                  找到我，或告诉我需要补充什么材料。
                </p>
              </div>
            )}
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              通常 1—2 天内回复
            </p>
          </div>

          {/* GitHub / 其他 */}
          <div className="bg-paper p-7 md:p-9">
            <Label>Elsewhere</Label>
            <ul className="mt-4 divide-y divide-line">
              <li>
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center justify-between py-3"
                >
                  <span>
                    <span className="block text-[14.5px]">GitHub</span>
                    <span className="font-mono text-[11px] text-muted">
                      {contact.githubLabel}
                    </span>
                  </span>
                  <Arrow className="h-4 w-4 -translate-x-1 opacity-50 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </a>
              </li>
              {contact.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-center justify-between py-3"
                  >
                    <span className="text-[14.5px]">{l.label}</span>
                    <Arrow className="h-4 w-4 -translate-x-1 opacity-50 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
              <li className="flex items-center justify-between py-3">
                <span>
                  <span className="block text-[14.5px]">简历</span>
                  <span className="font-mono text-[11px] text-muted">
                    {contact.resume ? 'PDF' : '邮件索取'}
                  </span>
                </span>
                {contact.resume ? (
                  <a
                    href={contact.resume}
                    className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent"
                    download
                  >
                    下载
                  </a>
                ) : (
                  <a
                    href={`mailto:${contact.email}?subject=简历索取`}
                    className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-accent"
                  >
                    邮件
                  </a>
                )}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 可提供材料 */}
      <section className="container-page pb-16">
        <div className="grid gap-10 border-t border-line pt-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <Label>Materials</Label>
            <h2 className="display-m mt-3">按需补充的材料</h2>
          </div>
          <ul className="grid gap-3 md:col-span-8 sm:grid-cols-2">
            {canShare.map((c, i) => (
              <li key={c} className="flex gap-3 text-[13.5px] leading-[1.85] text-ink-soft">
                <span className="mt-1 font-mono text-[11px] text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

    </>
  )
}
