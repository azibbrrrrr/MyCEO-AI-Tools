"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { WizardLayout } from "@/components/wizard-layout"
import { StepCard } from "@/components/step-card"

export default function ProfitCalculatorPage() {
  const { t } = useLanguage()

  const [costPerItem, setCostPerItem] = useState(5)
  const [sellingPrice, setSellingPrice] = useState(10)
  const [quantity, setQuantity] = useState(20)

  const [profitPerItem, setProfitPerItem] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [profitMargin, setProfitMargin] = useState(0)

  useEffect(() => {
    const profit = sellingPrice - costPerItem
    const revenue = sellingPrice * quantity
    const cost = costPerItem * quantity
    const total = profit * quantity
    const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0

    setProfitPerItem(profit)
    setTotalRevenue(revenue)
    setTotalCost(cost)
    setTotalProfit(total)
    setProfitMargin(margin)
  }, [costPerItem, sellingPrice, quantity])

  const getProfitEmoji = () => {
    if (profitPerItem <= 0) return { emoji: "😢", text: t("profit.status.loss"), color: "var(--coral-pink)" }
    if (profitMargin < 20) return { emoji: "😐", text: t("profit.status.low"), color: "var(--sunshine-orange)" }
    if (profitMargin < 40) return { emoji: "😊", text: t("profit.status.good"), color: "var(--sky-blue)" }
    return { emoji: "🤑", text: t("profit.status.great"), color: "var(--mint-green)" }
  }

  const status = getProfitEmoji()

  return (
    <WizardLayout currentStep={1} totalSteps={1} toolName={t("tool.profit")} toolIcon="💰">
      <div className="max-w-3xl mx-auto">
        <StepCard title={t("profit.title")} subtitle={t("profit.subtitle")} icon="💰">
          {/* Sliders */}
          <div className="space-y-8 mb-8">
            {/* Cost per item */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-[var(--text-primary)]">{t("profit.cost")}</label>
                <span className="text-lg font-bold text-[var(--sunshine-orange)]">RM {costPerItem}</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={costPerItem}
                onChange={(e) => setCostPerItem(Number(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--sunshine-orange) 0%, var(--sunshine-orange) ${(costPerItem / 50) * 100}%, var(--muted) ${(costPerItem / 50) * 100}%, var(--muted) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                <span>RM 1</span>
                <span>RM 50</span>
              </div>
            </div>

            {/* Selling price */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-[var(--text-primary)]">{t("profit.price")}</label>
                <span className="text-lg font-bold text-[var(--sky-blue)]">RM {sellingPrice}</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--sky-blue) 0%, var(--sky-blue) ${sellingPrice}%, var(--muted) ${sellingPrice}%, var(--muted) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                <span>RM 1</span>
                <span>RM 100</span>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-[var(--text-primary)]">{t("profit.quantity")}</label>
                <span className="text-lg font-bold text-[var(--mint-green)]">
                  {quantity} {t("profit.items")}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--mint-green) 0%, var(--mint-green) ${quantity}%, var(--muted) ${quantity}%, var(--muted) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                <span>1</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gradient-to-br from-[var(--sky-blue-light)]/50 to-[var(--mint-green)]/50 rounded-3xl p-6">
            {/* Status indicator */}
            <div className="text-center mb-6">
              <div
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-white font-bold"
                style={{ backgroundColor: status.color }}
              >
                <span className="text-3xl">{status.emoji}</span>
                <span>{status.text}</span>
              </div>
            </div>

            {/* Calculation breakdown */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-4 text-center">
                <p className="text-sm text-[var(--text-muted)]">{t("profit.revenue")}</p>
                <p className="text-2xl font-extrabold text-[var(--text-primary)]">RM {totalRevenue}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center">
                <p className="text-sm text-[var(--text-muted)]">{t("profit.totalCost")}</p>
                <p className="text-2xl font-extrabold text-[var(--sunshine-orange)]">RM {totalCost}</p>
              </div>
            </div>

            {/* Total profit highlight */}
            <div className="bg-white rounded-2xl p-6 text-center">
              <p className="text-sm text-[var(--text-muted)] mb-2">{t("profit.totalProfit")}</p>
              <p
                className="text-4xl font-extrabold transition-all"
                style={{ color: totalProfit >= 0 ? "var(--sky-blue)" : "var(--coral-pink)" }}
              >
                RM {totalProfit}
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                {t("profit.perItem")}: RM {profitPerItem} | {t("profit.margin")}: {profitMargin.toFixed(0)}%
              </p>
            </div>

            {/* Formula explanation */}
            <div className="mt-6 bg-white/50 rounded-xl p-4 text-center">
              <p className="text-sm text-[var(--text-secondary)]">
                <span className="font-semibold">{t("profit.formula")}:</span> {t("profit.revenue")} -{" "}
                {t("profit.totalCost")} = {t("profit.totalProfit")}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                (RM {sellingPrice} x {quantity}) - (RM {costPerItem} x {quantity}) = RM {totalProfit}
              </p>
            </div>
          </div>

          {/* Back to dashboard */}
          <div className="flex justify-center mt-8">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[var(--sky-blue)] text-white font-bold hover:scale-105 transition-all"
            >
              {t("profit.done")} 🎉
            </a>
          </div>
        </StepCard>
      </div>
    </WizardLayout>
  )
}
