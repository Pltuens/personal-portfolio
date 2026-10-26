import { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Intro, { INTRO_KEY } from './components/Intro'
import Layout from './components/Layout'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProjectDetail from './pages/ProjectDetail'
import Works from './pages/Works'

/** 白光褪去的时长，要和 index.css 里 .intro-curtain 的过渡保持一致 */
const CURTAIN_MS = 480

/** 路由切换时回到顶部；带 hash 时滚动到锚点 */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return null
}

export default function App() {
  // 一次会话只放一次入场页；页脚的重看入口会重新挂载它
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return !sessionStorage.getItem(INTRO_KEY)
    } catch {
      return true
    }
  })

  /**
   * 接棒用的白光层。
   * ------------------------------------------------------------------
   * 入场页是青绿底，站点是深蓝黑底，直接淡出会看到一次底色跳变。
   * 所以退场不是"淡出"，而是"穿过一片光"：
   * intro 被白光完全盖住之后才卸载，白光层在同一次渲染里以不透明接管，
   * 再慢慢褪去，主界面就像从光里浮现出来。
   */
  const [curtain, setCurtain] = useState<'idle' | 'hold' | 'fade'>('idle')

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1')
    } catch {
      /* 隐私模式下不可用，忽略 */
    }
    setShowIntro(false)
    // 与卸载发生在同一次渲染里，中间不会露出空档
    setCurtain('hold')
  }, [])

  // 等浏览器真的把不透明的白光画出来，再开始褪
  useEffect(() => {
    if (curtain !== 'hold') return
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setCurtain('fade'))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [curtain])

  // 白光褪去的同时，主内容从略近的位置回落到原位
  useEffect(() => {
    if (curtain !== 'fade') return
    document.body.classList.add('is-revealing')
    const t = window.setTimeout(() => {
      setCurtain('idle')
      document.body.classList.remove('is-revealing')
    }, CURTAIN_MS)
    return () => {
      window.clearTimeout(t)
      document.body.classList.remove('is-revealing')
    }
  }, [curtain])

  // 页脚的"重看开场"：把状态彻底复位，避免残留白光
  const replayRef = useRef(() => {})
  replayRef.current = () => {
    document.body.classList.remove('is-revealing')
    setCurtain('idle')
    setShowIntro(true)
  }

  useEffect(() => {
    const handler = () => replayRef.current()
    window.addEventListener('pluents:replay-intro', handler)
    return () => window.removeEventListener('pluents:replay-intro', handler)
  }, [])

  return (
    <BrowserRouter>
      {showIntro && <Intro onDone={finishIntro} />}
      {curtain !== 'idle' && (
        <div
          className={`intro-curtain ${curtain === 'fade' ? 'is-fading' : ''}`}
          aria-hidden="true"
        />
      )}
      <ScrollManager />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="works" element={<Works />} />
          <Route path="works/:slug" element={<ProjectDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
