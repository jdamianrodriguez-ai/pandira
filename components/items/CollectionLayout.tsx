interface Props {
  background?: string
  children: React.ReactNode
}

export default function CollectionLayout({ background, children }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Fondo textura */}
      {background && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 scale-110"
          style={{ backgroundImage: `url(${background})` }}
        />
      )}

      {/* Overlay suave */}
      <div className="absolute inset-0 bg-black/75" />

      {/* Contenido */}
      <div className="relative z-10">
        {children}
      </div>

    </div>
  )
}