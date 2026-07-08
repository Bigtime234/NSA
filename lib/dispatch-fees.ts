export type DispatchLocation = {
  label: string
  value: string
  fee: number
}

export const dispatchLocations: DispatchLocation[] = [
  { label: "Ikeja", value: "ikeja", fee: 2500 },
  { label: "Yaba", value: "yaba", fee: 2500 },
  { label: "Surulere", value: "surulere", fee: 2800 },
  { label: "Lekki Phase 1", value: "lekki-1", fee: 3500 },
  { label: "Lekki Phase 2", value: "lekki-2", fee: 4000 },
  { label: "Ajah", value: "ajah", fee: 4200 },
  { label: "Victoria Island", value: "vi", fee: 3800 },
  { label: "Ikoyi", value: "ikoyi", fee: 3800 },
  { label: "Ojota", value: "ojota", fee: 2700 },
  { label: "Gbagada", value: "gbagada", fee: 2700 },
  { label: "Ojo", value: "ojo", fee: 3800 },
  { label: "Festac", value: "festac", fee: 3500 },
  { label: "Ikorodu", value: "ikorodu", fee: 3600 },
  { label: "Alimosho", value: "alimosho", fee: 3000 },
  { label: "Agege", value: "agege", fee: 2800 },
  { label: "Badagry", value: "badagry", fee: 5500 },
  { label: "Epe", value: "epe", fee: 6000 },
  { label: "Outside Lagos", value: "outside-lagos", fee: 7000 },
]

export function getDispatchFee(value: string): number {
  const location = dispatchLocations.find((loc) => loc.value === value)
  return location?.fee ?? 0
}

export function getDispatchLabel(value: string): string {
  const location = dispatchLocations.find((loc) => loc.value === value)
  return location?.label ?? ""
}