
import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
    aspectRatio?: number
    minHeight?: number
  }
>(({ id, className, children, config, aspectRatio, minHeight, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  // iOS weather app-style responsive aspect ratio
  const getAspectRatio = () => {
    if (aspectRatio) return aspectRatio;
    if (typeof window === 'undefined') return 16/9;
    
    const width = window.innerWidth;
    // More square ratios on mobile like iOS weather
    if (width < 400) return 1.1; // Almost square on very small screens
    if (width < 768) return 1.3; // Slightly wider on mobile
    if (width < 1024) return 1.6; // Balanced on tablet
    return 1.8; // Wider on desktop
  };

  // iOS weather app-style responsive min height
  const getMinHeight = () => {
    if (minHeight) return minHeight;
    if (typeof window === 'undefined') return 220;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Scale based on viewport like iOS weather
    if (width < 400) return Math.max(180, height * 0.25); // 25% of viewport on small screens
    if (width < 768) return Math.max(220, height * 0.3); // 30% on mobile
    if (width < 1024) return Math.max(280, height * 0.35); // 35% on tablet
    return Math.max(320, height * 0.4); // 40% on desktop, but capped
  };

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex justify-center text-xs",
          // iOS weather app-style responsive styling
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
          "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-layer]:outline-none",
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
          "[&_.recharts-radial-bar-background-sector]:fill-muted",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted",
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
          "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-sector]:outline-none",
          "[&_.recharts-surface]:outline-none",
          // Enhanced responsive container
          "w-full transition-all duration-300 ease-out",
          // Touch-friendly adjustments for iOS-style interaction
          "[&_.recharts-dot]:cursor-pointer [&_.recharts-dot]:min-w-[44px] [&_.recharts-dot]:min-h-[44px]",
          "[&_.recharts-legend-item]:cursor-pointer [&_.recharts-legend-item]:min-h-[44px]",
          // iOS weather app glassmorphism effect
          "relative overflow-hidden",
          // Dynamic text sizing using CSS clamp
          "[&_.recharts-text]:text-[length:clamp(10px,2.5vw,12px)]",
          "[&_.recharts-cartesian-axis-tick_text]:text-[length:clamp(9px,2vw,11px)]",
          "[&_.recharts-tooltip-label]:text-[length:clamp(11px,3vw,14px)]",
          className
        )}
        style={{
          aspectRatio: getAspectRatio(),
          minHeight: `${getMinHeight()}px`,
          maxWidth: '100%'
        }}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium text-[#1D1D1F]", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium text-[#1D1D1F]", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-2xl border-0",
          // iOS weather app-style tooltip with glassmorphism
          "bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-xl",
          "px-3 py-2 shadow-2xl shadow-black/10 dark:shadow-black/30",
          // Responsive sizing using CSS clamp
          "text-[length:clamp(11px,3vw,14px)]",
          "max-w-[200px] sm:max-w-[250px] lg:max-w-[300px]",
          "min-h-[44px] touch-manipulation", // Touch-friendly minimum height
          "text-[#1D1D1F] dark:text-[#F2F2F7]", // iOS text colors
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-[#8E8E93]",
                  indicator === "dot" && "items-center",
                  "min-h-[44px] touch-manipulation" // Touch-friendly row height
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-full border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-[#8E8E93] dark:text-[#8E8E93] font-medium">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-semibold tabular-nums text-[#1D1D1F] dark:text-[#F2F2F7]">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          // iOS weather app-style responsive legend
          "gap-2 sm:gap-3 lg:gap-4",
          "text-[length:clamp(10px,2.5vw,12px)]", // Responsive text using clamp
          "flex-wrap", // Allow wrapping on small screens
          "min-h-[44px] touch-manipulation", // Touch-friendly minimum height
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-[#8E8E93]",
                // iOS weather app-style responsive icons
                "[&>svg]:h-2 [&>svg]:w-2 sm:[&>svg]:h-3 sm:[&>svg]:w-3",
                "min-h-[44px] touch-manipulation cursor-pointer hover:opacity-80 transition-opacity",
                // iOS-style background with glassmorphism
                "bg-white/10 dark:bg-[#1C1C1E]/20 backdrop-blur-sm px-3 py-2 rounded-xl",
                "border border-white/20 dark:border-[#1C1C1E]/30"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-full sm:h-2.5 sm:w-2.5"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              <span className="truncate text-[#1D1D1F] dark:text-[#F2F2F7] font-medium">
                {itemConfig?.label}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
