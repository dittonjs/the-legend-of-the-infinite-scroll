import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import './App.css'
import Paragraph from './Paragraph.jsx'
import paragraphs from './paragraphs.js'

// How many paragraphs to keep rendered past the top and bottom edges of the screen.
const BUFFER = 10

// Maps a rendered paragraph's id back to its position in the full list.
const indexById = new Map(paragraphs.map((paragraph, index) => [paragraph.id, index]))

function App() {
  const listRef = useRef(null)
  const [range, setRange] = useState({ start: 0, end: BUFFER * 2 })

  useEffect(() => {
    function updateRange() {
      const rendered = [...listRef.current.children]

      // The rendered paragraphs that are at least partly on screen.
      const visible = rendered.filter((element) => {
        const rect = element.getBoundingClientRect()
        return rect.bottom > 0 && rect.top < window.innerHeight
      })
      if (visible.length === 0) return

      const firstVisible = indexById.get(visible[0].id)
      const lastVisible = indexById.get(visible[visible.length - 1].id)
      const start = Math.max(0, firstVisible - BUFFER)
      const end = Math.min(paragraphs.length, lastVisible + 1 + BUFFER)

      // Nothing to add or remove if that's already what's rendered.
      const renderedStart = indexById.get(rendered[0].id)
      const renderedEnd = indexById.get(rendered[rendered.length - 1].id) + 1
      if (start === renderedStart && end === renderedEnd) return

      // Remember the first visible paragraph and how far its top is from the top of the
      // screen (negative once it has scrolled past the top).
      const anchor = visible[0]
      const offset = anchor.getBoundingClientRect().top

      // Remove and add paragraphs now, instead of on React's next render.
      flushSync(() => setRange({ start, end }))

      // Put that paragraph's id in the URL and jump to it, which lines its top up with
      // the top of the screen...
      window.history.replaceState(null, '', `#${anchor.id}`)
      anchor.scrollIntoView()

      // ...then scroll by the saved offset so we're looking at exactly the same spot.
      window.scrollBy(0, -offset)
    }

    window.addEventListener('scroll', updateRange, { passive: true })
    window.addEventListener('resize', updateRange)
    return () => {
      window.removeEventListener('scroll', updateRange)
      window.removeEventListener('resize', updateRange)
    }
  }, [])

  return (
    <>
      <div className="paragraph-list" ref={listRef}>
        {paragraphs.slice(range.start, range.end).map((paragraph) => (
          <Paragraph key={paragraph.id} id={paragraph.id} text={paragraph.text} />
        ))}
      </div>
    </>
  )
}

export default App
