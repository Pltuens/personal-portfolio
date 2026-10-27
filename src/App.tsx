import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Intro, { INTRO_KEY } from './components/Intro'
import Layout from './components/Layout'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProjectDetail from './pages/ProjectDetail'
import Works from './pages/Works'

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

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1')
    } catch {
      /* 隐私模式下不可用，忽略 */
    }
    setShowIntro(false)
  }, [])

  useEffect(() => {
    const replay = () => setShowIntro(true)
    window.addEventListener('pluents:replay-intro', replay)
    return () => window.removeEventListener('pluents:replay-intro', replay)
  }, [])

  return (
    <BrowserRouter>
      {showIntro && <Intro onDone={finishIntro} />}
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
