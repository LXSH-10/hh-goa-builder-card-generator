'use client'

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, Camera, Check, Clipboard, Download, ImagePlus, RotateCcw, Shuffle, Sparkles, Upload } from 'lucide-react'

const titles = ['Frontend Alchemist', 'Pixel Architect', 'Ship It Specialist', 'Interface Tinkerer', 'Code Cartographer', 'Product Pathfinder']
const stacks = ['Web + product', 'Design systems', 'AI experiments', 'Open source']

function getBuilderTitle(name: string, offset = 0) {
  const total = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return titles[(total + offset) % titles.length]
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
  const [handle, setHandle] = useState('')
  const [title, setTitle] = useState('')
  const [stack, setStack] = useState(stacks[0])
  const [roll, setRoll] = useState(0)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null)
  const [uploadError, setUploadError] = useState('')
  const [status, setStatus] = useState<'idle' | 'downloaded' | 'shared'>('idle')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const displayTitle = useMemo(() => title.trim() || (name.trim() ? getBuilderTitle(name.trim(), roll) : 'Your Builder Title'), [name, title, roll])
  const hasDetails = Boolean(name.trim() && imageElement)
  const shareText = `Filed from Goa: ${name.trim() || 'a builder'} — ${displayTitle}. See you at HH Goa 2026. #FrameInGoa`

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
    ctx.fillStyle = '#f4eddf'
    ctx.fillRect(0, 0, 720, 960)
    ctx.fillStyle = '#143d8d'
    ctx.fillRect(0, 0, 720, 112)
    ctx.fillStyle = '#f26b4f'
    ctx.fillRect(0, 112, 720, 16)
    ctx.fillStyle = '#101820'
    ctx.font = '700 20px Arial'
    ctx.fillText('HH GOA / BUILDER FIELD NOTES', 36, 52)
    ctx.fillStyle = '#f4eddf'
    ctx.font = '900 56px Arial'
    ctx.fillText('LEAVE A TRACE.', 36, 94)
    ctx.fillStyle = '#101820'
    ctx.fillRect(36, 156, 648, 442)
    drawCoverImage(ctx, image, 48, 168, 624, 418)
    ctx.fillStyle = '#d5f1e6'
    ctx.fillRect(36, 630, 648, 110)
    ctx.fillStyle = '#101820'
    ctx.font = '900 42px Arial'
    ctx.fillText(name.trim().toUpperCase().slice(0, 20) || 'YOUR NAME', 54, 682)
    ctx.fillStyle = '#143d8d'
    ctx.font = '700 20px Arial'
    ctx.fillText((handle.trim() ? `@${handle.trim().replace(/^@/, '')}` : 'YOUR HANDLE').toUpperCase().slice(0, 28), 54, 718)
    ctx.fillStyle = '#f26b4f'
    ctx.font = '900 27px Arial'
    ctx.fillText(displayTitle.toUpperCase().slice(0, 28), 36, 790)
    ctx.fillStyle = '#101820'
    ctx.font = '700 18px Arial'
    ctx.fillText(`STACK / ${stack.toUpperCase()}`, 36, 835)
    ctx.strokeStyle = '#101820'
    ctx.lineWidth = 2
    ctx.strokeRect(500, 774, 184, 88)
    ctx.font = '700 14px Arial'
    ctx.fillText('FIELD NOTE', 516, 800)
    ctx.font = '900 25px Arial'
    ctx.fillText('GOA 26', 516, 835)
    ctx.fillStyle = '#143d8d'
    ctx.font = '700 16px Arial'
    ctx.fillText('BUILD LOUD / SHIP OFTEN / #FRAMEINGOA', 36, 918)
  }, [imageElement, name, handle, displayTitle, stack])

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose a JPG, PNG, or WEBP image.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('That image is over 10MB. Try a smaller one.')
      return
    }
    setUploadError('')
    setImageUrl(URL.createObjectURL(file))
    setStatus('idle')
  }

  function reset() {
    setName(''); setHandle(''); setTitle(''); setStack(stacks[0]); setRoll(0); setImageElement(null); setImageUrl(null); setUploadError(''); setStatus('idle')
  }

  function downloadCard() {
    const canvas = canvasRef.current
    if (!canvas || !hasDetails) return
    const link = document.createElement('a')
    link.download = `hh-goa-2026-${name.trim().toLowerCase().replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    setStatus('downloaded')
  }

  async function shareToX() {
    await navigator.clipboard?.writeText(shareText)
    setStatus('shared')
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer')
  }

  async function copyText() {
    await navigator.clipboard?.writeText(shareText)
    setStatus('shared')
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10">
        <div className="flex items-center gap-3"><span className="grid size-9 place-items-center bg-primary text-primary-foreground"><Sparkles aria-hidden="true" className="size-5" /></span><span className="font-mono text-xs font-bold tracking-[0.2em]">HACKER HOUSE / FIELD NOTES</span></div>
        <button type="button" onClick={reset} className="flex min-h-10 items-center gap-2 font-mono text-xs font-bold tracking-wider text-muted-foreground transition-colors hover:text-foreground"><RotateCcw aria-hidden="true" className="size-4" /> RESET</button>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-8 md:grid-cols-[0.8fr_1.2fr] md:items-start md:px-10 md:pb-24 md:pt-14">
        <div className="max-w-xl"><div className="mb-6 inline-flex items-center gap-2 border border-border bg-card px-3 py-2 font-mono text-[11px] font-bold tracking-[0.16em] text-muted-foreground"><span className="size-2 rounded-full bg-primary" /> EDITION 01 / GOA, INDIA</div><h1 className="text-balance text-5xl font-black leading-[0.9] tracking-[-0.06em] md:text-7xl">LEAVE A<br /><span className="text-primary">TRACE.</span></h1><p className="mt-6 max-w-md text-pretty text-base leading-7 text-muted-foreground md:text-lg">A field note for the people who turn rough ideas into real things. Make yours, take it to Goa.</p><div className="mt-8 flex items-center gap-3 font-mono text-xs font-bold tracking-wider text-muted-foreground"><ArrowDown aria-hidden="true" className="size-4 text-primary" /> THREE MARKS TO FILE</div><div className="mt-10 grid max-w-sm grid-cols-3 border-y border-border py-4 font-mono text-[10px] font-bold tracking-wider text-muted-foreground"><span><b className="block text-lg text-foreground">01</b>NAME</span><span><b className="block text-lg text-foreground">02</b>PHOTO</span><span><b className="block text-lg text-foreground">03</b>SHIP</span></div></div>

        <div className="grid gap-8 lg:grid-cols-[minmax(260px,340px)_1fr] lg:items-start">
          <div className="order-2 flex justify-center lg:order-1"><div className="relative w-full max-w-[340px] rotate-[-2deg] bg-foreground p-3 shadow-[10px_10px_0_var(--primary)] transition-transform hover:rotate-0"><div className="absolute -right-3 -top-4 z-10 grid size-20 rotate-12 place-items-center rounded-full border-2 border-primary bg-accent text-center font-mono text-[10px] font-black leading-3 text-accent-foreground">FIELD<br />NOTE<br />26</div><div className="aspect-[3/4] overflow-hidden bg-primary">{imageUrl ? <img src={imageUrl} alt="Your uploaded builder portrait" className="size-full object-cover" /> : <div className="flex size-full flex-col items-center justify-center gap-4 border-2 border-dashed border-foreground/30 px-8 text-center"><div className="grid size-16 place-items-center bg-accent text-accent-foreground"><Camera aria-hidden="true" className="size-8" /></div><p className="font-mono text-xs font-bold leading-5 text-foreground">YOUR PHOTO<br />GOES HERE</p></div>}</div><div className="bg-accent p-4"><p className="truncate text-xl font-black tracking-tight">{name.trim() || 'YOUR NAME'}</p><p className="truncate font-mono text-[10px] font-bold tracking-wide text-primary">{handle.trim() ? `@${handle.trim().replace(/^@/, '')}` : 'YOUR HANDLE'} / {stack}</p></div><div className="flex justify-between bg-foreground px-1 pt-3 font-mono text-[9px] font-bold tracking-widest text-primary"><span>{displayTitle.toUpperCase()}</span><span>HH/26</span></div></div></div>

          <div className="order-1 flex flex-col gap-5 lg:order-2"><div className="border border-border bg-card p-5 md:p-6"><div className="mb-6 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center bg-primary font-mono text-sm font-bold text-primary-foreground">01</span><h2 className="font-mono text-xs font-bold tracking-[0.18em]">FILE YOUR DETAILS</h2></div><span className="font-mono text-[10px] font-bold text-muted-foreground">LOCAL ONLY</span></div><div className="flex flex-col gap-5"><label className="flex flex-col gap-2"><span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground">YOUR NAME</span><input value={name} onChange={(event) => setName(event.target.value)} maxLength={24} placeholder="e.g. Alex Builder" className="h-12 border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20" /></label><div className="grid gap-5 sm:grid-cols-2"><label className="flex flex-col gap-2"><span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground">HANDLE</span><input value={handle} onChange={(event) => setHandle(event.target.value)} maxLength={20} placeholder="alexbuilds" className="h-12 border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20" /></label><label className="flex flex-col gap-2"><span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground">STACK</span><select value={stack} onChange={(event) => setStack(event.target.value)} className="h-12 border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">{stacks.map((item) => <option key={item}>{item}</option>)}</select></label></div><div className="flex flex-col gap-2"><div className="flex items-center justify-between gap-2"><span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground">BUILDER TITLE</span><button type="button" onClick={() => setRoll((value) => value + 1)} className="flex min-h-9 items-center gap-2 font-mono text-[10px] font-bold text-primary"><Shuffle aria-hidden="true" className="size-3" /> ROLL TITLE</button></div><input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={29} placeholder={name.trim() ? getBuilderTitle(name.trim(), roll) : 'e.g. Interface Tinkerer'} className="h-12 border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20" /></div><label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-border bg-background px-4 text-center transition-colors hover:border-primary hover:bg-primary/5"><Upload aria-hidden="true" className="size-5 text-primary" /><span className="text-sm font-bold">{imageUrl ? 'Replace your photo' : 'Add your photo'}</span><span className="font-mono text-[10px] text-muted-foreground">JPG, PNG, WEBP · MAX 10MB · CAMERA READY</span><input type="file" accept="image/png,image/jpeg,image/webp" capture="user" onChange={handleUpload} className="sr-only" /></label>{uploadError && <p role="alert" className="text-xs font-bold text-destructive">{uploadError}</p>}</div></div><div className="flex items-start gap-3 bg-accent p-4 text-accent-foreground"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" /><p className="text-xs font-medium leading-5">Your photo stays in your browser. Nothing is uploaded to a server.</p></div><div className="flex flex-col gap-3 sm:flex-row"><button type="button" onClick={downloadCard} disabled={!hasDetails} className="flex h-12 flex-1 items-center justify-center gap-2 bg-primary px-5 text-sm font-black text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"><Download aria-hidden="true" className="size-4" /> {status === 'downloaded' ? 'CARD FILED' : 'DOWNLOAD CARD'}</button><button type="button" onClick={shareToX} disabled={!hasDetails} className="flex h-12 items-center justify-center gap-2 border border-foreground bg-card px-5 text-sm font-black transition-colors hover:bg-foreground hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"><ArrowRight aria-hidden="true" className="size-4" /> {status === 'shared' ? 'SIGNAL SENT' : 'SHARE TO X'}</button></div>{status === 'shared' && <div className="flex items-center justify-between gap-3 border border-primary/30 bg-primary/5 p-3 text-xs"><span className="font-medium">Share text copied. Your signal is ready.</span><button type="button" onClick={copyText} className="flex items-center gap-2 font-mono text-[10px] font-bold text-primary"><Clipboard aria-hidden="true" className="size-3" /> COPY AGAIN</button></div>}</div>
        </div>
      </section>
      <footer className="border-t border-border px-5 py-5 md:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-3 font-mono text-[10px] font-bold tracking-[0.16em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>MADE FOR BUILDERS WHO SHOW UP.</span><span className="flex items-center gap-2"><ImagePlus aria-hidden="true" className="size-3" /> #FRAMEINGOA</span></div></footer><canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </main>
  )
}
