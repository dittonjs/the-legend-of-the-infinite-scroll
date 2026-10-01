import { useEffect, useRef, useState } from 'react'
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
      // The rendered paragraphs that are at least partly on screen.
      const visible = [...listRef.current.children].filter((element) => {
        const rect = element.getBoundingClientRect()
        return rect.bottom > 0 && rect.top < window.innerHeight
      })
      if (visible.length === 0) return

      const firstVisible = indexById.get(visible[0].id)
      const lastVisible = indexById.get(visible[visible.length - 1].id)
      const start = Math.max(0, firstVisible - BUFFER)
      const end = Math.min(paragraphs.length, lastVisible + 1 + BUFFER)

      setRange((prev) => (prev.start === start && prev.end === end ? prev : { start, end }))
    }

    updateRange()
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
