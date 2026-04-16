'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Upload, X, Plus, Loader2, Ship } from 'lucide-react'
import Image from 'next/image'

const AMENITIES_OPTIONS = [
  'GPS Navigation', 'Radio VHF', 'Gilet de sauvetage', 'Ancre', 'Extincteur',
  'Glacière', 'Cuisine de bord', 'Douche', 'Toilette', 'Climatisation',
  'Équipement de plongée', 'Kayak inclus', 'Planche de surf', 'Bluetooth/Stéréo',
  'Génératrice', 'Panneaux solaires', 'Autopilote', 'Radar', 'Wi-Fi',
]

const COUNTRIES = ['Haiti', 'France', 'USA', 'Espagne', 'Italie', 'Grèce', 'Maroc', 'Mexique', 'Brésil', 'Thaïlande', 'Croatie', 'Portugal', 'Turquie', 'Maldives', 'Jamaïque', 'Cuba', 'Martinique', 'Guadeloupe']

const schema = z.object({
  title: z.string().min(5, 'Tit dwe gen omwen 5 karaktè'),
  description: z.string().min(20, 'Deskripsyon dwe gen omwen 20 karaktè'),
  type: z.string().min(1, 'Chwazi kalite bato'),
  capacity: z.number({ coerce: true }).int().min(1, 'Minimòm 1 moun'),
  length: z.number({ coerce: true }).positive('Longè obligatwa'),
  year: z.number({ coerce: true }).optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  pricePerDay: z.number({ coerce: true }).positive('Pri pa jou obligatwa'),
  pricePerHour: z.number({ coerce: true }).optional(),
  minDays: z.number({ coerce: true }).int().optional(),
  country: z.string().min(2, 'Peyi obligatwa'),
  region: z.string().min(2, 'Rejyon obligatwa'),
  city: z.string().min(2, 'Vil obligatwa'),
  marina: z.string().optional(),
  rules: z.string().optional(),
  cancellationPolicy: z.enum(['FLEXIBLE', 'MODERATE', 'STRICT']),
})

type FormData = z.infer<typeof schema>

export default function NewBoatPage() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState(1)

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { cancellationPolicy: 'FLEXIBLE', minDays: 1 },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (images.length + files.length > 10) {
      toast.error('Maksimòm 10 foto')
      return
    }
    setUploading(true)
    try {
      const uploaded = await Promise.all(files.map(async file => {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        return data.url as string
      }))
      setImages(prev => [...prev, ...uploaded])
      toast.success(`${uploaded.length} foto chaje`)
    } catch {
      toast.error('Erè pandan upload')
    } finally {
      setUploading(false)
    }
  }

  const toggleAmenity = (a: string) =>
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])

  const onSubmit = async (data: FormData) => {
    if (images.length === 0) {
      toast.error('Ajoute omwen yon foto')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/boats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, images, amenities }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      toast.success('Bato ajoute ak siksè! 🎉')
      router.push('/dashboard/my-boats')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const steps = ['Enfòmasyon', 'Lokasyon', 'Pri & Règ', 'Foto']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900">Ajoute Nouvo Bato</h1>
        <p className="text-gray-500 mt-1">Ranpli fòm lan pou mete bato ou sou mache</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => setStep(i + 1)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                step === i + 1 ? 'bg-ocean-700 text-white' : step > i + 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 text-xs font-bold">{i + 1}</span>
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < steps.length - 1 && <div className="w-6 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">

          {/* Step 1: Info */}
          {step === 1 && (
            <>
              <h2 className="font-display text-xl font-bold border-b border-gray-100 pb-3">Enfòmasyon Jeneral</h2>
              <div>
                <label className="label">Tit Lis <span className="text-red-500">*</span></label>
                <input {...register('title')} placeholder="Ex: Magnifik Vwayè 40 pye pou 8 moun" className="input-field" />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="label">Deskripsyon <span className="text-red-500">*</span></label>
                <textarea {...register('description')} rows={5} placeholder="Dekri bato ou a: karakteristik, eksperyans, sa ki espesyal ladan l..." className="input-field resize-none" />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Kalite Bato <span className="text-red-500">*</span></label>
                  <select {...register('type')} className="input-field">
                    <option value="">Chwazi...</option>
                    {[['SAILBOAT','⛵ Vwayè'],['MOTORBOAT','🚤 Moto Bato'],['YACHT','🛥️ Yacht'],['CATAMARAN','⛵ Katamaran'],['SPEEDBOAT','💨 Rapid'],['HOUSEBOAT','🏠 Kay Bato'],['KAYAK','🛶 Kayak'],['JETSKI','🏄 Jetski'],['PONTOON','🚢 Ponton'],['FISHING','🎣 Pèch']].map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                  {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
                </div>
                <div>
                  <label className="label">Kapasité Moun <span className="text-red-500">*</span></label>
                  <input type="number" {...register('capacity')} min={1} max={100} className="input-field" />
                  {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">Longè (pye) <span className="text-red-500">*</span></label>
                  <input type="number" {...register('length')} step="0.1" className="input-field" />
                </div>
                <div>
                  <label className="label">Mak (opsyonèl)</label>
                  <input {...register('make')} placeholder="Ex: Beneteau" className="input-field" />
                </div>
                <div>
                  <label className="label">Ane</label>
                  <input type="number" {...register('year')} min={1950} max={new Date().getFullYear()} className="input-field" />
                </div>
              </div>

              <div>
                <label className="label">Ekipman & Sèvis</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {AMENITIES_OPTIONS.map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAmenity(a)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        amenities.includes(a)
                          ? 'bg-ocean-700 text-white border-ocean-700'
                          : 'border-gray-200 text-gray-600 hover:border-ocean-300'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <>
              <h2 className="font-display text-xl font-bold border-b border-gray-100 pb-3">Lokasyon</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Peyi <span className="text-red-500">*</span></label>
                  <select {...register('country')} className="input-field">
                    <option value="">Chwazi peyi...</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                </div>
                <div>
                  <label className="label">Rejyon / Depatman <span className="text-red-500">*</span></label>
                  <input {...register('region')} placeholder="Ex: Côte d'Azur" className="input-field" />
                  {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Vil <span className="text-red-500">*</span></label>
                  <input {...register('city')} placeholder="Ex: Nice" className="input-field" />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="label">Marina (opsyonèl)</label>
                  <input {...register('marina')} placeholder="Ex: Port Vieux" className="input-field" />
                </div>
              </div>
            </>
          )}

          {/* Step 3: Pricing & Rules */}
          {step === 3 && (
            <>
              <h2 className="font-display text-xl font-bold border-b border-gray-100 pb-3">Pri & Règ</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Pri pa Jou ($) <span className="text-red-500">*</span></label>
                  <input type="number" {...register('pricePerDay')} step="1" min={1} className="input-field" />
                  {errors.pricePerDay && <p className="text-red-500 text-xs mt-1">{errors.pricePerDay.message}</p>}
                </div>
                <div>
                  <label className="label">Pri pa Zè ($) (opsyonèl)</label>
                  <input type="number" {...register('pricePerHour')} step="1" min={1} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Minimòm Jou</label>
                  <select {...register('minDays')} className="input-field">
                    {[1,2,3,5,7].map(d => <option key={d} value={d}>{d} jou</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Politik Anilasyon</label>
                  <select {...register('cancellationPolicy')} className="input-field">
                    <option value="FLEXIBLE">Fleksib (ranbousman 24h anvan)</option>
                    <option value="MODERATE">Modere (50% ranbousman 5j anvan)</option>
                    <option value="STRICT">Strict (pa gen ranbousman)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Règ pou Lokasyon (opsyonèl)</label>
                <textarea {...register('rules')} rows={4} placeholder="Ex: Pa gen fimen a bò, moun ki gen lisans sèlman, etc." className="input-field resize-none" />
              </div>
            </>
          )}

          {/* Step 4: Photos */}
          {step === 4 && (
            <>
              <h2 className="font-display text-xl font-bold border-b border-gray-100 pb-3">Foto Bato</h2>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-ocean-300 transition-colors">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <label htmlFor="images" className="cursor-pointer">
                  {uploading ? (
                    <Loader2 className="w-10 h-10 mx-auto mb-3 text-ocean-500 animate-spin" />
                  ) : (
                    <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                  )}
                  <div className="font-medium text-gray-700">Klike pou upload foto</div>
                  <div className="text-sm text-gray-500 mt-1">PNG, JPG • Maksimòm 10 foto • Min 1 obligatwa</div>
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative group aspect-square rounded-xl overflow-hidden">
                      <Image src={img} alt="" fill className="object-cover" />
                      {i === 0 && (
                        <div className="absolute bottom-1 left-1 bg-ocean-700 text-white text-xs px-2 py-0.5 rounded-full">Prensipal</div>
                      )}
                      <button
                        type="button"
                        onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-4">
          {step > 1 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary">
              ← Tounen
            </button>
          ) : <div />}

          {step < 4 ? (
            <button type="button" onClick={() => setStep(step + 1)} className="btn-primary">
              Kontinye →
            </button>
          ) : (
            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2 px-8">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ship className="w-4 h-4" />}
              {submitting ? 'Ap anrejistre...' : 'Pibliye Bato'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
