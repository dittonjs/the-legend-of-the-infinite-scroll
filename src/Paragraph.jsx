import './Paragraph.css'

function Paragraph({ id, text }) {

  return (
    <article id={id} className="paragraph">
      <a className="paragraph-anchor" href={`#${id}`} hidden>
        #{id}
      </a>
      <p>{text}</p>
    </article>
  )
}

export default Paragraph
