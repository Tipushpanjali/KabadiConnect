import { FileText, Box, CupSoda, Wrench, GlassWater, Smartphone, Coffee, Train, ShoppingBasket, Sprout, TreePine, Medal, Truck, Factory, Award, CheckCircle2, Trophy, Gift, Recycle, Package, Inbox, Bell } from 'lucide-react'

const MAP = { FileText, Box, CupSoda, Wrench, GlassWater, Smartphone, Coffee, Train, ShoppingBasket, Sprout, TreePine, Medal, Truck, Factory, Award, CheckCircle2, Trophy, Gift, Recycle, Package, Inbox, Bell }

export function Ico({ name, ...props }) {
  const C = MAP[name] || Recycle
  return <C aria-hidden="true" {...props} />
}
