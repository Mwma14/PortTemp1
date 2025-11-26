import React from "react"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Card } from "./card"

interface BenefitProps {
  text: string
  checked: boolean
}

const Benefit = ({ text, checked }: BenefitProps) => {
  return (
    <div className="flex items-center gap-3">
      {checked ? (
        <span className="flex items-center justify-center size-5 rounded-full bg-white text-black shrink-0">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      ) : (
        <span className="flex items-center justify-center size-5 rounded-full bg-zinc-800 text-zinc-500 shrink-0">
          <X className="size-3.5" />
        </span>
      )}
      <span className={cn("text-sm", checked ? "text-zinc-300" : "text-zinc-500")}>{text}</span>
    </div>
  )
}

interface PricingCardProps {
  tier: string
  price: string
  bestFor: string
  CTA: string
  benefits: Array<{ text: string; checked: boolean }>
  className?: string
}

export const PricingCard = ({
  tier,
  price,
  bestFor,
  CTA,
  benefits,
  className,
}: PricingCardProps) => {
  const isPopular = tier.toLowerCase() === "pro" || tier.toLowerCase() === "creator";

  return (
    <motion.div
      initial={{ filter: "blur(2px)", opacity: 0 }}
      whileInView={{ filter: "blur(0px)", opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeInOut", delay: 0.25 }}
      className="h-full"
    >
      <Card
        className={cn(
          "relative h-full w-full overflow-hidden flex flex-col",
          "bg-zinc-950 border-zinc-800",
          "p-8",
          className,
        )}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <span className="mb-4 text-zinc-100 font-medium">
            {tier}
          </span>
          <span className="mb-2 text-5xl font-bold text-white tracking-tight">
            {price}
          </span>
          <span className="text-zinc-500 text-sm">
            {bestFor}
          </span>
        </div>
        
        <div className="h-px w-full bg-zinc-800 mb-8" />

        <div className="space-y-4 flex-1 mb-8">
          {benefits.map((benefit, index) => (
            <Benefit key={index} {...benefit} />
          ))}
        </div>
        
        <Button
          className={cn(
            "w-full h-12 text-base font-semibold transition-all duration-200",
            isPopular 
              ? "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]" 
              : "bg-transparent text-white hover:text-white hover:bg-zinc-800 border border-transparent hover:border-zinc-700"
          )}
          variant={isPopular ? "default" : "ghost"}
        >
          {CTA}
        </Button>
      </Card>
    </motion.div>
  )
}