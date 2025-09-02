"use client";

import { useEffect, useRef } from "react";

const TradingViewChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);

  useEffect(() => {
    const loadChart = async () => {
      if (!chartContainerRef.current) return;

      try {
        const { createChart } = await import("lightweight-charts");

        const chart = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
          layout: {
            background: { color: "hsl(0, 0%, 11%)" },
            textColor: "#d1d4dc",
          },
          grid: {
            vertLines: { color: "#334155" },
            horzLines: { color: "#334155" },
          },
          crosshair: {
            mode: 1,
          },
          rightPriceScale: {
            borderColor: "#485c7b",
          },
          timeScale: {
            borderColor: "#485c7b",
            timeVisible: true,
            secondsVisible: false,
          },
          watermark: {
            visible: false,
            text: "",
            fontSize: 0,
            horzAlign: "left",
            vertAlign: "bottom",
          },
          handleScroll: {
            mouseWheel: true,
            pressedMouseMove: true,
          },
          handleScale: {
            axisPressedMouseMove: true,
            mouseWheel: true,
            pinch: true,
          },
        });

        chartRef.current = chart;

        // Sample candlestick data
        const candlestickData = [
          { time: "2024-01-01", open: 100, high: 110, low: 98, close: 105 },
          { time: "2024-01-02", open: 105, high: 115, low: 103, close: 108 },
          { time: "2024-01-03", open: 108, high: 118, low: 106, close: 112 },
          { time: "2024-01-04", open: 112, high: 120, low: 110, close: 115 },
          { time: "2024-01-05", open: 115, high: 125, low: 113, close: 120 },
          { time: "2024-01-06", open: 120, high: 122, low: 115, close: 118 },
          { time: "2024-01-07", open: 118, high: 130, low: 116, close: 125 },
          { time: "2024-01-08", open: 125, high: 135, low: 123, close: 130 },
        ];

        // Create candlestick series
        const candlestickSeries = chart.addCandlestickSeries({
          upColor: "#26a69a",
          downColor: "#ef5350",
          borderVisible: false,
          wickUpColor: "#26a69a",
          wickDownColor: "#ef5350",
        });
        candlestickSeriesRef.current = candlestickSeries;
        candlestickSeries.setData(candlestickData);

        const handleResize = () => {
          if (chartContainerRef.current && chartRef.current) {
            chartRef.current.applyOptions({
              width: chartContainerRef.current.clientWidth,
              height: chartContainerRef.current.clientHeight,
            });
          }
        };

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
        };
      } catch (error) {
        console.error("Failed to load chart:", error);
      }
    };

    loadChart();

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  return (
    <div className="chart-container relative h-full w-full">
      <div ref={chartContainerRef} className="chart-wrapper h-full w-full" />
    </div>
  );
};

export default TradingViewChart;
