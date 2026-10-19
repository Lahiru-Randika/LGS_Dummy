export function HeroMedia() {
  const heroVideo = import.meta.env.VITE_LGS_HERO_VIDEO_URL as
    | string
    | undefined

  const heroImage = '/lgs-media/golden-hour-valley-town-aerial.png'

  return (
    <div
      className="absolute inset-0 h-full w-full overflow-hidden"
      aria-hidden="true"
    >
      {heroVideo ? (
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroImage}
          src={heroVideo}
        />
      ) : (
        <img
          src={heroImage}
          alt=""
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
      )}

      {/* Dark left-side overlay for hero text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#061522]/95 via-[#061522]/62 to-[#061522]/20" />

      {/* Slight bottom depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#061522]/35 via-transparent to-black/10" />

    </div>
  )
}