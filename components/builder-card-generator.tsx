'use client'

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDownToLine, ArrowRight, Camera, Check, Copy, Download, ImagePlus, RotateCcw, Share2, Sparkles, Upload } from 'lucide-react'

const titles = ['Frontend Alchemist', 'Pixel Architect', 'Ship It Specialist', 'Interface Tinkerer', 'Code Cartographer', 'Product Pathfinder']

function getBuilderTitle(name: string) {
  const total = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return titles[total % titles.length]
}

function drawCoverImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number) {
  const imageRatio = image.width / image.height
  const frameRatio = width / height
  let sourceWidth = image.width
  let sourceHeight = image.height
  let sourceX = 0
  let sourceY = 0

  if (imageRatio > frameRatio) {
    sourceWidth = image.height * frameRatio
    sourceX = (image.width - sourceWidth) / 2
  } else {
    sourceHeight = image.width / frameRatio
    sourceY = (image.height - sourceHeight) / 2
  }
  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height)
}

export function BuilderCardGenerator() {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null)
  const [downloaded, setDownloaded] = useState(false)
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const displayTitle = useMemo(() => title.trim() || (name.trim() ? getBuilderTitle(name.trim()) : 'Your Builder Title'), [name, title])
  const hasDetails = Boolean(name.trim() && imageElement)

  useEffect(() => {
    if (!imageUrl) return
    const image = new Image()
    image.onload = () => setImageElement(image)
    image.src = imageUrl
    return () => { image.onload = null }
  }, [imageUrl])

  useEffect(() => {
    const canvas = canvasRef.current
    const image = imageElement
    if (!canvas || !image) return
    const scale = 2
    canvas.width = 720 * scale
    canvas.height = 960 * scale
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(scale, scale)
    ctx.fillStyle = '#f3efe8'
    ctx.fillRect(0, 0, 720, 960)
    ctx.fillStyle = '#ff5a1f'
    ctx.fillRect(0, 0, 720, 142)
    ctx.fillStyle = '#171717'
    ctx.fillRect(0, 142, 720, 818)
    ctx.fillStyle = '#b9ef3a'
    ctx.fillRect(32, 32, 196, 42)
    ctx.fillStyle = '#171717'
    ctx.font = '700 20px Arial'
    ctx.fillText('HH GOA / 2026', 48, 60)
    ctx.fillStyle = '#fffdf8'
    ctx.font = '900 72px Arial'
    ctx.fillText('BUILDER', 32, 114)
    ctx.fillStyle = '#ff5a1f'
    ctx.fillRect(32, 174, 656, 484)
    drawCoverImage(ctx, image, 48, 190, 624, 452)
    ctx.fillStyle = '#b9ef3a'
    ctx.fillRect(32, 690, 656, 90)
    ctx.fillStyle = '#171717'
    ctx.font = '900 48px Arial'
    ctx.fillText(name.trim().toUpperCase().slice(0, 20), 52, 750)
    ctx.fillStyle = '#fffdf8'
    ctx.font = '700 25px Arial'
    ctx.fillText(displayTitle.toUpperCase().slice(0, 29), 32, 834)
    ctx.fillStyle = '#ff5a1f'
    ctx.font = '700 18px Arial'
    ctx.fillText('BUILD LOUD. SHIP OFTEN. STAY CURIOUS.', 32, 900)
    ctx.fillStyle = '#fffdf8'
    ctx.font = '700 16px Arial'
    ctx.fillText('FRAME IN GOA', 32, 932)
  }, [imageElement, name, displayTitle])

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    setImageUrl(URL.createObjectURL(file))
    setDownloaded(false)
  }

  function reset() {
    setName('')
    setTitle('')
    setImageElement(null)
    setImageUrl(null)
    setDownloaded(false)
    setCopied(false)
  }

  function downloadCard() {
    const canvas = canvasRef.current
    if (!canvas || !hasDetails) return
    const link = document.createElement('a')
    link.download = `hh-goa-2026-${name.trim().toLowerCase().replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    setDownloaded(true)
  }

  async function shareToX() {
    const text = `I am a ${displayTitle} heading to HH Goa 2026. Build loud. Ship often. #FrameInGoa`
    await navigator.clipboard?.writeText(text)
    setCopied(true)
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center bg-primary text-primary-foreground"><Sparkles aria-hidden="true" className="size-5" /></span>
          <span className="font-mono text-xs font-bold tracking-[0.2em]">HACKER HOUSE</span>
        </div>
        <button type="button" onClick={reset} className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-muted-foreground transition-colors hover:text-foreground">
          <RotateCcw aria-hidden="true" className="size-4" /> RESET
        </button>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-8 md:grid-cols-[0.85fr_1.15fr] md:items-center md:px-10 md:pb-24 md:pt-16">
        <div className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 border border-border bg-card px-3 py-2 font-mono text-[11px] font-bold tracking-[0.16em] text-muted-foreground"><span className="size-2 rounded-full bg-primary" /> HH GOA 2026</div>
          <h1 className="text-balance text-5xl font-black leading-[0.92] tracking-[-0.06em] md:text-7xl">BUILD YOUR<br /><span className="text-primary">BUILDER CARD.</span></h1>
          <p className="mt-6 max-w-md text-pretty text-base leading-7 text-muted-foreground md:text-lg">Bring your builder energy to Goa. Upload a photo, claim your title, and make a card worth sharing.</p>
          <div className="mt-8 flex items-center gap-3 font-mono text-xs font-bold tracking-wider text-muted-foreground"><ArrowDownToLine aria-hidden="true" className="size-4 text-primary" /> 2 MINUTE BUILD</div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(260px,340px)_1fr] lg:items-start">
          <div className="order-2 flex justify-center lg:order-1">
            <div className="relative w-full max-w-[340px] rotate-[-2deg] bg-foreground p-3 shadow-[10px_10px_0_var(--primary)] transition-transform hover:rotate-0">
              <div className="aspect-[3/4] overflow-hidden bg-primary">
                {imageUrl ? <img src={imageUrl} alt="Your uploaded builder portrait" className="size-full object-cover" /> : <div className="flex size-full flex-col items-center justify-center gap-4 border-2 border-dashed border-foreground/30 px-8 text-center"><div className="grid size-16 place-items-center bg-accent text-accent-foreground"><Camera aria-hidden="true" className="size-8" /></div><p className="font-mono text-xs font-bold leading-5 text-foreground">YOUR PHOTO<br />GOES HERE</p></div>}
              </div>
              <div className="flex items-end justify-between gap-3 bg-accent p-4"><div className="min-w-0"><p className="truncate text-xl font-black tracking-tight">{name.trim() || 'YOUR NAME'}</p><p className="truncate font-mono text-[10px] font-bold tracking-wide">{displayTitle.toUpperCase()}</p></div><span className="shrink-0 font-mono text-[10px] font-bold">HH/26</span></div>
              <div className="flex justify-between bg-foreground px-1 pt-3 font-mono text-[9px] font-bold tracking-widest text-primary"><span>BUILD LOUD.</span><span>FRAME IN GOA</span></div>
            </div>
          </div>

          <div className="order-1 flex flex-col gap-5 lg:order-2">
            <div className="border border-border bg-card p-5 md:p-6">
              <div className="mb-6 flex items-center gap-3"><span className="grid size-8 place-items-center bg-primary font-mono text-sm font-bold text-primary-foreground">01</span><h2 className="font-mono text-xs font-bold tracking-[0.18em]">ADD YOUR DETAILS</h2></div>
              <div className="flex flex-col gap-5">
                <label className="flex flex-col gap-2"><span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground">YOUR NAME</span><input value={name} onChange={(event) => setName(event.target.value)} maxLength={24} placeholder="e.g. Alex Builder" className="h-12 border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
                <label className="flex flex-col gap-2"><span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground">YOUR BUILDER TITLE <span className="font-normal">(OPTIONAL)</span></span><input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={29} placeholder={name.trim() ? getBuilderTitle(name.trim()) : 'e.g. Interface Tinkerer'} className="h-12 border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
                <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-border bg-background px-4 text-center transition-colors hover:border-primary hover:bg-primary/5"><Upload aria-hidden="true" className="size-5 text-primary" /><span className="text-sm font-bold">{imageUrl ? 'Swap your photo' : 'Upload your photo'}</span><span className="font-mono text-[10px] text-muted-foreground">JPG, PNG · MAX 10MB</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUpload} className="sr-only" /></label>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-accent p-4 text-accent-foreground"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" /><p className="text-xs font-medium leading-5">Your photo stays in your browser. Nothing is uploaded to a server.</p></div>
            <div className="flex flex-col gap-3 sm:flex-row"><button type="button" onClick={downloadCard} disabled={!hasDetails} className="flex h-12 flex-1 items-center justify-center gap-2 bg-primary px-5 text-sm font-black text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"><Download aria-hidden="true" className="size-4" /> {downloaded ? 'CARD DOWNLOADED' : 'DOWNLOAD CARD'}</button><button type="button" onClick={shareToX} disabled={!hasDetails} className="flex h-12 items-center justify-center gap-2 border border-foreground bg-card px-5 text-sm font-black transition-colors hover:bg-foreground hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"><Share2 aria-hidden="true" className="size-4" /> {copied ? 'COPIED + OPENED X' : 'SHARE TO X'}</button></div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-5 md:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-3 font-mono text-[10px] font-bold tracking-[0.16em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>MADE FOR BUILDERS WHO SHOW UP.</span><span className="flex items-center gap-2"><ImagePlus aria-hidden="true" className="size-3" /> #FRAMEINGOA</span></div></footer>
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </main>
  )
}
