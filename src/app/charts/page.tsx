"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  User,
  Home,
  HelpCircle,
  Sparkles,
  DollarSign,
  Keyboard,
  LogOut,
  Search,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { BiCandles } from "react-icons/bi";
import {
  IoCameraReverseOutline,
  IoSettingsOutline,
  IoCalendarNumberOutline,
} from "react-icons/io5";
import { GoScreenFull } from "react-icons/go";
import { LuAlarmClockCheck, LuCircleHelp } from "react-icons/lu";
import { MdOutlineEditNotifications } from "react-icons/md";
import { CgCommunity } from "react-icons/cg";
import { AiOutlineProduct } from "react-icons/ai";
import { BsTools } from "react-icons/bs";
import { PiChats } from "react-icons/pi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TradingViewChart, { ChartRef } from "@/components/TradingViewChart";
import CodeEditor from "@/components/CodeEditor";

// Panel pages configuration
const PANEL_PAGES = {
  broker: "Broker(MCP)",
  codeEditor: "Code Editor",
  strategyTester: "Strategy Tester",
  replayTrading: "Replay Trading",
  tradingPanel: "Trading Panel",
} as const;

type PanelPage = keyof typeof PANEL_PAGES;

const ChartsPage = () => {
  const { data: session } = useSession();

  // Panel state
  const [panelHeight, setPanelHeight] = useState(0);
  const [activePage, setActivePage] = useState<PanelPage>("broker");
  const [isDragging, setIsDragging] = useState(false);
  const [lastNonMaxHeight, setLastNonMaxHeight] = useState(240);
  const [isClientReady, setIsClientReady] = useState(false);
  const [isSymbolPopupOpen, setIsSymbolPopupOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isTimeframeDropdownOpen, setIsTimeframeDropdownOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    TICKS: false,
    SECONDS: false,
    MINUTES: true,
    HOURS: false,
    DAYS: false,
    RANGES: false,
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState("2 minutes");
  const [isCandleDropdownOpen, setIsCandleDropdownOpen] = useState(false);
  const [selectedCandleType, setSelectedCandleType] = useState("Candles");
  const [selectedIndicatorCategory, setSelectedIndicatorCategory] =
    useState("Technical");
  const [isIndicatorPopupOpen, setIsIndicatorPopupOpen] = useState(false);
  const [isSettingsPopupOpen, setIsSettingsPopupOpen] = useState(false);

  // Search state for brokers
  const [brokerSearchQuery, setBrokerSearchQuery] = useState("");

  // Refs for performance
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const footerDockRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const timeframeDropdownRef = useRef<HTMLDivElement>(null);
  const candleDropdownRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ChartRef>(null);

  // Drag performance refs
  const panelHeightRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const maxHeightRef = useRef(0);
  const rafIdRef = useRef<number>(0);
  const currentPointerY = useRef(0);

  // Constants
  const MIN_HEIGHT = 220;
  const HEADER_HEIGHT = 32; // 8 * 4 = 32px (h-8)
  const FOOTER_HEIGHT = 32; // 8 * 4 = 32px (h-8)

  // Calculate max height (covers 80% of header, leaves 20% visible)
  const getMaxHeight = useCallback(() => {
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const headerCoverage = HEADER_HEIGHT * 0.8; // Cover 80% of header
    return Math.floor(
      viewportHeight - FOOTER_HEIGHT - (HEADER_HEIGHT - headerCoverage),
    );
  }, []);

  // Debounced save to localStorage (client-side only)
  const saveStateTimeoutRef = useRef<NodeJS.Timeout>();
  const saveState = useCallback(
    (height: number, page: PanelPage, lastHeight?: number) => {
      // Only save if we're on the client and have a valid height
      if (!isClientReady || typeof window === "undefined") return;

      if (saveStateTimeoutRef.current) {
        clearTimeout(saveStateTimeoutRef.current);
      }
      saveStateTimeoutRef.current = setTimeout(() => {
        try {
          localStorage.setItem(
            "charts-panel-state",
            JSON.stringify({
              height: Math.max(0, height), // Ensure non-negative
              page,
              lastHeight: lastHeight ?? lastNonMaxHeight,
            }),
          );
        } catch (error) {
          console.warn("Failed to save panel state to localStorage:", error);
        }
      }, 300);
    },
    [lastNonMaxHeight, isClientReady],
  );

  // Set client ready flag after mount
  useEffect(() => {
    setIsClientReady(true);
  }, []);

  // Load state from localStorage (client-side only)
  useEffect(() => {
    if (!isClientReady) return;

    const saved = localStorage.getItem("charts-panel-state");
    if (saved) {
      try {
        const { page, lastHeight } = JSON.parse(saved);
        // Don't restore height on page load - keep panel closed
        // Only restore the active page and last height for future use

        if (page && PANEL_PAGES[page as PanelPage]) {
          setActivePage(page as PanelPage);
        }

        if (lastHeight && lastHeight > 0) {
          setLastNonMaxHeight(lastHeight);
        }
      } catch (error) {
        console.warn("Failed to parse saved panel state:", error);
      }
    }
  }, [isClientReady]);

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        timeframeDropdownRef.current &&
        !timeframeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTimeframeDropdownOpen(false);
      }
      if (
        candleDropdownRef.current &&
        !candleDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCandleDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync refs with state
  useEffect(() => {
    panelHeightRef.current = panelHeight;
  }, [panelHeight]);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  // Manage body class for maximized state
  useEffect(() => {
    const isMaximized = panelHeight >= getMaxHeight();
    if (isMaximized) {
      document.body.classList.add("panel-maximized");
    } else {
      document.body.classList.remove("panel-maximized");
    }

    return () => {
      document.body.classList.remove("panel-maximized");
      // Cleanup RAF on unmount
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (saveStateTimeoutRef.current) {
        clearTimeout(saveStateTimeoutRef.current);
      }
    };
  }, [panelHeight, getMaxHeight]);

  // Handle viewport changes to keep panel within bounds
  useEffect(() => {
    const handleViewportChange = () => {
      const maxHeight = getMaxHeight();
      maxHeightRef.current = maxHeight;
      if (panelHeight > maxHeight) {
        setPanelHeight(maxHeight);
        panelHeightRef.current = maxHeight;
        saveState(maxHeight, activePage);
      }
    };

    // Initialize max height
    maxHeightRef.current = getMaxHeight();

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("orientationchange", handleViewportChange);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportChange);
    }

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("orientationchange", handleViewportChange);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleViewportChange,
        );
      }
    };
  }, [panelHeight, activePage, saveState, getMaxHeight]);

  // Trigger chart resize when panel height changes
  useEffect(() => {
    if (!isClientReady) return;

    // Use requestAnimationFrame to ensure DOM has updated
    const resizeChart = () => {
      if (chartRef.current && typeof chartRef.current.resize === "function") {
        chartRef.current.resize();
      }
    };

    requestAnimationFrame(resizeChart);
  }, [panelHeight, isClientReady]);

  // Open panel with smooth transition
  const openPanel = useCallback(
    (targetHeight: number, page?: PanelPage) => {
      const newPage = page || activePage;
      const clampedHeight = Math.max(0, Math.min(getMaxHeight(), targetHeight));
      setPanelHeight(clampedHeight);
      panelHeightRef.current = clampedHeight;
      if (page) setActivePage(page);
      saveState(clampedHeight, newPage);
    },
    [activePage, getMaxHeight, saveState],
  );

  // Handle footer button clicks
  const handlePageClick = useCallback(
    (page: PanelPage) => {
      if (panelHeightRef.current === 0) {
        // Panel closed - open with default height
        openPanel(MIN_HEIGHT, page);
      } else if (activePage === page) {
        // Same page clicked - toggle collapse (optional behavior)
        setPanelHeight(0);
        panelHeightRef.current = 0;
        saveState(0, page);
      } else {
        // Different page - switch without changing height
        setActivePage(page);
        saveState(panelHeightRef.current, page);
      }
    },
    [activePage, openPanel, saveState],
  );

  // RAF drag loop
  const dragLoop = useCallback(() => {
    if (!isDraggingRef.current) return;

    const deltaY = dragStartY.current - currentPointerY.current;
    const newHeight = Math.max(
      0,
      Math.min(maxHeightRef.current, dragStartHeight.current + deltaY),
    );
    const roundedHeight = Math.floor(newHeight);

    // Update DOM directly for performance
    if (footerDockRef.current) {
      footerDockRef.current.style.transform = `translateY(-${roundedHeight}px)`;
    }
    if (bottomPanelRef.current) {
      bottomPanelRef.current.style.height = `${roundedHeight}px`;
    }

    panelHeightRef.current = roundedHeight;

    // Lock body scroll when at max height
    const isMaximized = roundedHeight >= maxHeightRef.current;
    if (isMaximized !== document.body.classList.contains("panel-maximized")) {
      if (isMaximized) {
        document.body.classList.add("panel-maximized");
      } else {
        document.body.classList.remove("panel-maximized");
      }
    }

    rafIdRef.current = requestAnimationFrame(dragLoop);
  }, []);

  // Handle drag start
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      isDraggingRef.current = true;
      dragStartY.current = e.clientY;
      currentPointerY.current = e.clientY;
      dragStartHeight.current = panelHeightRef.current;
      maxHeightRef.current = getMaxHeight();

      // Disable transitions during drag
      if (footerDockRef.current) {
        footerDockRef.current.style.transition = "none";
      }
      if (bottomPanelRef.current) {
        bottomPanelRef.current.style.transition = "none";
      }

      if (dividerRef.current) {
        dividerRef.current.setPointerCapture(e.pointerId);
      }

      // Start RAF loop
      rafIdRef.current = requestAnimationFrame(dragLoop);
    },
    [dragLoop, getMaxHeight],
  );

  // Handle drag move - just update pointer position
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    currentPointerY.current = e.clientY;
  }, []);

  // Handle drag end
  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;

      // Stop RAF loop
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      setIsDragging(false);
      isDraggingRef.current = false;

      if (dividerRef.current) {
        dividerRef.current.releasePointerCapture(e.pointerId);
      }

      // Get final height from ref
      let finalHeight = panelHeightRef.current;

      // Snap to minimum height if too small
      if (finalHeight > 0 && finalHeight < MIN_HEIGHT) {
        finalHeight = MIN_HEIGHT;
      }

      // Re-enable transitions
      if (footerDockRef.current) {
        footerDockRef.current.style.transition = "transform 0.15s ease-out";
      }
      if (bottomPanelRef.current) {
        bottomPanelRef.current.style.transition = "height 0.15s ease-out";
      }

      // Single state update
      setPanelHeight(finalHeight);
      panelHeightRef.current = finalHeight;

      // Update last non-max height
      if (finalHeight > 0 && finalHeight < maxHeightRef.current) {
        setLastNonMaxHeight(finalHeight);
      }

      saveState(
        finalHeight,
        activePage,
        finalHeight > 0 && finalHeight < maxHeightRef.current
          ? finalHeight
          : undefined,
      );
    },
    [activePage, saveState],
  );

  // Handle double-click to toggle max/restore
  const handleDoubleClick = useCallback(() => {
    const maxHeight = getMaxHeight();
    if (panelHeightRef.current >= maxHeight) {
      // Currently maximized - restore to last height
      openPanel(lastNonMaxHeight);
    } else {
      // Not maximized - maximize
      if (panelHeightRef.current > 0) {
        setLastNonMaxHeight(panelHeightRef.current);
      }
      openPanel(maxHeight);
    }
  }, [getMaxHeight, lastNonMaxHeight, openPanel]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const step = 20;
      const maxHeight = getMaxHeight();

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setPanelHeight((prev) => {
            const newHeight = Math.min(
              maxHeight,
              prev === 0 ? MIN_HEIGHT : prev + step,
            );
            panelHeightRef.current = newHeight;
            if (newHeight > 0 && newHeight < maxHeight) {
              setLastNonMaxHeight(newHeight);
            }
            saveState(newHeight, activePage);
            return newHeight;
          });
          break;
        case "ArrowDown":
          e.preventDefault();
          setPanelHeight((prev) => {
            const newHeight = Math.max(0, prev - step);
            panelHeightRef.current = newHeight;
            if (newHeight > 0 && newHeight < maxHeight) {
              setLastNonMaxHeight(newHeight);
            }
            saveState(newHeight, activePage);
            return newHeight;
          });
          break;
        case "Home":
          e.preventDefault();
          setPanelHeight(0);
          panelHeightRef.current = 0;
          saveState(0, activePage);
          break;
        case "End":
          e.preventDefault();
          if (panelHeight > 0 && panelHeight < maxHeight) {
            setLastNonMaxHeight(panelHeight);
          }
          setPanelHeight(maxHeight);
          panelHeightRef.current = maxHeight;
          saveState(maxHeight, activePage);
          break;
      }
    },
    [activePage, getMaxHeight, panelHeight, saveState],
  );

  // Panel content components
  const renderPanelContent = () => {
    const commonClasses = "h-full overflow-auto p-4";

    switch (activePage) {
      case "broker":
        const allBrokers = [
          {
            name: "Interactive Brokers",
            tier: "Enterprise",
            commission: "$0.005/share",
          },
          {
            name: "Charles Schwab",
            tier: "Professional",
            commission: "$0 commissions",
          },
          {
            name: "Fidelity",
            tier: "Professional",
            commission: "$0 commissions",
          },
          {
            name: "TD Ameritrade",
            tier: "Professional",
            commission: "$0 commissions",
          },
          { name: "E*TRADE", tier: "Standard", commission: "$0 commissions" },
          { name: "MetaTrader 5", tier: "Enterprise", commission: "Variable" },
          { name: "MetaTrader 4", tier: "Standard", commission: "Variable" },
          {
            name: "Thinkorswim",
            tier: "Professional",
            commission: "$0.65/contract",
          },
          { name: "OANDA", tier: "Professional", commission: "Spread-based" },
          {
            name: "IG Markets",
            tier: "Professional",
            commission: "Spread-based",
          },
          { name: "CMC Markets", tier: "Standard", commission: "Spread-based" },
          {
            name: "Pepperstone",
            tier: "Professional",
            commission: "From $3.5/lot",
          },
          {
            name: "IC Markets",
            tier: "Professional",
            commission: "From $3/lot",
          },
          { name: "FXTM", tier: "Standard", commission: "Spread-based" },
          { name: "XM", tier: "Standard", commission: "Spread-based" },
          { name: "Exness", tier: "Professional", commission: "From $3.5/lot" },
          {
            name: "Admiral Markets",
            tier: "Professional",
            commission: "From $3/lot",
          },
          { name: "Forex.com", tier: "Standard", commission: "Spread-based" },
          { name: "AvaTrade", tier: "Standard", commission: "Spread-based" },
          { name: "Plus500", tier: "Standard", commission: "Spread-based" },
          { name: "eToro", tier: "Standard", commission: "Variable" },
          { name: "Binance", tier: "Professional", commission: "0.1% spot" },
          {
            name: "Coinbase Pro",
            tier: "Professional",
            commission: "0.5% taker",
          },
          { name: "Kraken", tier: "Professional", commission: "0.26% taker" },
        ];

        const filteredBrokers = allBrokers.filter((broker) =>
          broker.name.toLowerCase().includes(brokerSearchQuery.toLowerCase()),
        );

        const getTierColor = (tier: string) => {
          switch (tier) {
            case "Enterprise":
              return "bg-white text-black";
            case "Professional":
              return "bg-gray-200 text-black";
            default:
              return "bg-gray-400 text-black";
          }
        };

        return (
          <div className={`${commonClasses} broker-page bg-black text-white`}>
            <div className="mb-6 border-b border-white/20 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="select-none text-lg font-bold text-white">
                    Enterprise Brokerage Network
                  </h2>
                  <p className="mt-1 select-none text-xs text-white/70">
                    Connect to institutional-grade trading infrastructure
                  </p>
                </div>
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-white/50" />
                  <Input
                    type="text"
                    placeholder="Search brokers..."
                    value={brokerSearchQuery}
                    onChange={(e) => setBrokerSearchQuery(e.target.value)}
                    className="select-none border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/50 focus:border-white/40"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBrokers.map((broker, index) => (
                <div
                  key={index}
                  className="group select-none border border-white/20 bg-white/5 p-4 transition-all duration-200 hover:border-white/40 hover:bg-white/10"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center bg-white text-sm font-bold text-black">
                      {broker.name.charAt(0)}
                    </div>
                    <div
                      className={`px-2 py-1 text-xs font-medium ${getTierColor(broker.tier)}`}
                    >
                      {broker.tier}
                    </div>
                  </div>
                  <h3 className="mb-2 select-none text-xs font-semibold leading-tight text-white">
                    {broker.name}
                  </h3>
                  <p className="mb-3 select-none text-xs text-white/60">
                    {broker.commission}
                  </p>
                  <button className="w-full select-none bg-white px-3 py-2 text-xs font-medium text-black transition-colors hover:bg-white/90 group-hover:bg-white">
                    Connect
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-white/20 pt-4">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-xl font-bold text-white">24</div>
                  <div className="text-xs text-white/60">Connected Brokers</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">99.9%</div>
                  <div className="text-xs text-white/60">Uptime SLA</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">&lt;10ms</div>
                  <div className="text-xs text-white/60">Avg Latency</div>
                </div>
              </div>
            </div>
          </div>
        );
      case "codeEditor":
        return (
          <div className="code-editor-page h-full w-full p-0">
            <div className="flex w-full items-center justify-between border-b border-border bg-background px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="flex select-none items-center gap-1 text-sm text-white">
                  <span>~</span>
                  <span>Untitled script</span>
                </span>
                <button className="flex select-none items-center gap-1 text-xs text-white/70 hover:text-white">
                  <span>📁</span>
                  <span>Add to chart</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="select-none rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20">
                  Publish indicator
                </button>
                <button className="select-none text-xs text-white/70 hover:text-white">
                  ⋯
                </button>
              </div>
            </div>
            <div className="h-full">
              <CodeEditor height="100%" />
            </div>
          </div>
        );
      case "strategyTester":
        return (
          <div className="flex h-full w-full flex-col items-center justify-center bg-background p-8 text-center">
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-center">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <rect
                    x="6"
                    y="4"
                    width="4"
                    height="16"
                    fill="currentColor"
                    opacity="0.7"
                  />
                  <rect
                    x="14"
                    y="8"
                    width="4"
                    height="12"
                    fill="currentColor"
                    opacity="0.7"
                  />
                  <path
                    d="M8 4L8 2M16 8L16 6M8 20L8 22M16 20L16 22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-lg font-semibold text-white">
                Strategy Tester
              </h2>
              <p className="max-w-md text-sm text-white/70">
                To test a strategy, apply it to the chart. Make sure to select
                the right symbol and time interval you&apos;d like to test.
              </p>
            </div>
            <button className="rounded bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20">
              Load your strategy
            </button>
          </div>
        );
      case "replayTrading":
        return (
          <div className="flex h-full w-full flex-col items-center justify-center bg-background p-8 text-center">
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-center">
                <div className="relative">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-white"
                  >
                    <rect
                      x="3"
                      y="6"
                      width="18"
                      height="12"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path d="M8 10l4 2-4 2v-4z" fill="currentColor" />
                  </svg>
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-black"
                    >
                      <path d="M11 7l-7 5 7 5V7z" fill="currentColor" />
                      <path d="M18 7l-7 5 7 5V7z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </div>
              <h2 className="mb-2 text-lg font-semibold text-white">
                Advanced analysis for your Bar Replay
              </h2>
              <p className="max-w-md text-sm text-white/70">
                With replay mode, you can get extended statistics about your
                trading on historical data. Open Bar Replay, make a trade, and
                start your analysis.
              </p>
            </div>
            <button className="rounded bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20">
              Launch Bar Replay
            </button>
          </div>
        );
      case "tradingPanel":
        return (
          <div className="flex h-full w-full flex-col items-center justify-center bg-background p-8 text-center">
            <div className="mb-6">
              <p className="mb-2 text-sm text-blue-400">Need a broker?</p>
              <h2 className="mb-6 text-xl font-semibold text-white">
                Top trading is one decision away
              </h2>
              <div className="flex items-center gap-4">
                <button className="rounded-full bg-white px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90">
                  Open account
                </button>
                <button className="rounded-full bg-gray-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-500">
                  Explore brokers
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className={commonClasses + " select-none"}>Select a panel</div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-8 w-full select-none border-b border-border bg-background">
        <div className="mx-auto h-full w-full px-6">
          <div className="flex h-full w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2 h-6 w-6 select-none p-0 transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-48 border-[hsl(0,0%,20.4%)] bg-[hsl(0,0%,11%)]"
                >
                  {session?.user?.email && (
                    <div className="border-b border-[hsl(0,0%,20.4%)] px-2 py-1.5 text-xs text-[hsl(0,0%,70%)]">
                      {session.user.email}
                    </div>
                  )}
                  <DropdownMenuItem className="text-[hsl(0,0%,95%)] hover:bg-[hsl(0,0%,15%)] focus:bg-[hsl(0,0%,15%)]">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[hsl(0,0%,95%)] hover:bg-[hsl(0,0%,15%)] focus:bg-[hsl(0,0%,15%)]">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help Center
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[hsl(0,0%,95%)] hover:bg-[hsl(0,0%,15%)] focus:bg-[hsl(0,0%,15%)]">
                    <Sparkles className="mr-2 h-4 w-4" />
                    What&apos;s New
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[hsl(0,0%,95%)] hover:bg-[hsl(0,0%,15%)] focus:bg-[hsl(0,0%,15%)]">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Pricing
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[hsl(0,0%,95%)] hover:bg-[hsl(0,0%,15%)] focus:bg-[hsl(0,0%,15%)]">
                    <Keyboard className="mr-2 h-4 w-4" />
                    Keyboard Shortcuts
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[hsl(0,0%,20.4%)]" />
                  <DropdownMenuItem
                    className="text-[hsl(0,0%,95%)] hover:bg-[hsl(0,0%,15%)] focus:bg-[hsl(0,0%,15%)]"
                    asChild
                  >
                    <a href="/">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 select-none px-2 transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                onClick={() => setIsSymbolPopupOpen(true)}
              >
                <Search className="mr-1 h-4 w-4" />
                <span className="select-none text-xs">Symbol</span>
              </Button>
              <div className="relative" ref={timeframeDropdownRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 select-none px-2 transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCandleDropdownOpen(false);
                    setIsTimeframeDropdownOpen(!isTimeframeDropdownOpen);
                  }}
                >
                  <span className="select-none text-xs">
                    {selectedTimeframe}
                  </span>
                </Button>
                {isTimeframeDropdownOpen && (
                  <div className="timeframe-dropdown absolute left-0 top-8 z-50 w-48 rounded-md border border-[hsl(0,0%,20.4%)] bg-[hsl(0,0%,11%)] shadow-lg">
                    <div className="p-2">
                      <div
                        className="flex cursor-pointer items-center justify-between px-2 py-1 text-xs text-muted-foreground hover:bg-[hsl(0,0%,15%)]"
                        onClick={() =>
                          setExpandedSections((prev) => ({
                            ...prev,
                            TICKS: !prev.TICKS,
                          }))
                        }
                      >
                        <span>TICKS</span>
                        <span>{expandedSections.TICKS ? "˄" : "˅"}</span>
                      </div>
                      {expandedSections.TICKS && (
                        <div className="ml-2 space-y-1">
                          <div
                            className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]"
                            onClick={() => {
                              setSelectedTimeframe("1 tick");
                              setIsTimeframeDropdownOpen(false);
                            }}
                          >
                            1 tick
                          </div>
                          <div
                            className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]"
                            onClick={() => {
                              setSelectedTimeframe("2 ticks");
                              setIsTimeframeDropdownOpen(false);
                            }}
                          >
                            2 ticks
                          </div>
                          <div
                            className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]"
                            onClick={() => {
                              setSelectedTimeframe("3 ticks");
                              setIsTimeframeDropdownOpen(false);
                            }}
                          >
                            3 ticks
                          </div>
                          <div
                            className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]"
                            onClick={() => {
                              setSelectedTimeframe("5 ticks");
                              setIsTimeframeDropdownOpen(false);
                            }}
                          >
                            5 ticks
                          </div>
                          <div
                            className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]"
                            onClick={() => {
                              setSelectedTimeframe("10 ticks");
                              setIsTimeframeDropdownOpen(false);
                            }}
                          >
                            10 ticks
                          </div>
                        </div>
                      )}

                      <div
                        className="flex cursor-pointer items-center justify-between px-2 py-1 text-xs text-muted-foreground hover:bg-[hsl(0,0%,15%)]"
                        onClick={() =>
                          setExpandedSections((prev) => ({
                            ...prev,
                            SECONDS: !prev.SECONDS,
                          }))
                        }
                      >
                        <span>SECONDS</span>
                        <span>{expandedSections.SECONDS ? "˄" : "˅"}</span>
                      </div>
                      {expandedSections.SECONDS && (
                        <div className="ml-2 space-y-1">
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            1 second
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            2 seconds
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            3 seconds
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            5 seconds
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            10 seconds
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            15 seconds
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            30 seconds
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            45 seconds
                          </div>
                        </div>
                      )}

                      <div
                        className="flex cursor-pointer items-center justify-between px-2 py-1 text-xs text-muted-foreground hover:bg-[hsl(0,0%,15%)]"
                        onClick={() =>
                          setExpandedSections((prev) => ({
                            ...prev,
                            MINUTES: !prev.MINUTES,
                          }))
                        }
                      >
                        <span>MINUTES</span>
                        <span>{expandedSections.MINUTES ? "˄" : "˅"}</span>
                      </div>
                      {expandedSections.MINUTES && (
                        <div className="ml-2 space-y-1">
                          <div
                            className={`cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)] ${selectedTimeframe === "1 minute" ? "bg-accent/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`}
                            onClick={() => {
                              setSelectedTimeframe("1 minute");
                              setIsTimeframeDropdownOpen(false);
                            }}
                          >
                            1 minute
                          </div>
                          <div
                            className={`cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)] ${selectedTimeframe === "2 minutes" ? "bg-accent/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`}
                            onClick={() => {
                              setSelectedTimeframe("2 minutes");
                              setIsTimeframeDropdownOpen(false);
                            }}
                          >
                            2 minutes
                          </div>
                          <div
                            className={`cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)] ${selectedTimeframe === "3 minutes" ? "bg-accent/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`}
                            onClick={() => {
                              setSelectedTimeframe("3 minutes");
                              setIsTimeframeDropdownOpen(false);
                            }}
                          >
                            3 minutes
                          </div>
                          <div
                            className={`cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)] ${selectedTimeframe === "5 minutes" ? "bg-accent/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`}
                            onClick={() => {
                              setSelectedTimeframe("5 minutes");
                              setIsTimeframeDropdownOpen(false);
                            }}
                          >
                            5 minutes
                          </div>
                          <div
                            className={`cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)] ${selectedTimeframe === "10 minutes" ? "bg-accent/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`}
                            onClick={() => {
                              setSelectedTimeframe("10 minutes");
                              setIsTimeframeDropdownOpen(false);
                            }}
                          >
                            10 minutes
                          </div>
                          <div
                            className={`cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)] ${selectedTimeframe === "15 minutes" ? "bg-accent/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`}
                            onClick={() => {
                              setSelectedTimeframe("15 minutes");
                              setIsTimeframeDropdownOpen(false);
                            }}
                          >
                            15 minutes
                          </div>
                          <div
                            className={`cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)] ${selectedTimeframe === "30 minutes" ? "bg-accent/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`}
                            onClick={() => {
                              setSelectedTimeframe("30 minutes");
                              setIsTimeframeDropdownOpen(false);
                            }}
                          >
                            30 minutes
                          </div>
                          <div
                            className={`cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)] ${selectedTimeframe === "45 minutes" ? "bg-accent/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`}
                            onClick={() => {
                              setSelectedTimeframe("45 minutes");
                              setIsTimeframeDropdownOpen(false);
                            }}
                          >
                            45 minutes
                          </div>
                        </div>
                      )}

                      <div
                        className="flex cursor-pointer items-center justify-between px-2 py-1 text-xs text-muted-foreground hover:bg-[hsl(0,0%,15%)]"
                        onClick={() =>
                          setExpandedSections((prev) => ({
                            ...prev,
                            HOURS: !prev.HOURS,
                          }))
                        }
                      >
                        <span>HOURS</span>
                        <span>{expandedSections.HOURS ? "˄" : "˅"}</span>
                      </div>
                      {expandedSections.HOURS && (
                        <div className="ml-2 space-y-1">
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            1 hour
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            2 hours
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            3 hours
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            4 hours
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            6 hours
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            8 hours
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            12 hours
                          </div>
                        </div>
                      )}

                      <div
                        className="flex cursor-pointer items-center justify-between px-2 py-1 text-xs text-muted-foreground hover:bg-[hsl(0,0%,15%)]"
                        onClick={() =>
                          setExpandedSections((prev) => ({
                            ...prev,
                            DAYS: !prev.DAYS,
                          }))
                        }
                      >
                        <span>DAYS</span>
                        <span>{expandedSections.DAYS ? "˄" : "˅"}</span>
                      </div>
                      {expandedSections.DAYS && (
                        <div className="ml-2 space-y-1">
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            1 day
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            2 days
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            3 days
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            1 week
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            1 month
                          </div>
                        </div>
                      )}

                      <div
                        className="flex cursor-pointer items-center justify-between px-2 py-1 text-xs text-muted-foreground hover:bg-[hsl(0,0%,15%)]"
                        onClick={() =>
                          setExpandedSections((prev) => ({
                            ...prev,
                            RANGES: !prev.RANGES,
                          }))
                        }
                      >
                        <span>RANGES</span>
                        <span>{expandedSections.RANGES ? "˄" : "˅"}</span>
                      </div>
                      {expandedSections.RANGES && (
                        <div className="ml-2 space-y-1">
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            Range bars
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            Renko
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            Kagi
                          </div>
                          <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                            Point & Figure
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative" ref={candleDropdownRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 select-none p-0 transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTimeframeDropdownOpen(false);
                    setIsCandleDropdownOpen(!isCandleDropdownOpen);
                  }}
                >
                  <BiCandles className="h-4 w-4" />
                </Button>
                {isCandleDropdownOpen && (
                  <div className="candle-dropdown absolute left-0 top-8 z-50 w-48 rounded-md border border-[hsl(0,0%,20.4%)] bg-[hsl(0,0%,11%)] shadow-lg">
                    <div className="p-2">
                      <div
                        className={`cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)] ${selectedCandleType === "Bars" ? "bg-accent/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`}
                        onClick={() => {
                          setSelectedCandleType("Bars");
                          setIsCandleDropdownOpen(false);
                        }}
                      >
                        Bars
                      </div>
                      <div
                        className={`cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)] ${selectedCandleType === "Candles" ? "bg-accent/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`}
                        onClick={() => {
                          setSelectedCandleType("Candles");
                          setIsCandleDropdownOpen(false);
                        }}
                      >
                        Candles
                      </div>
                      <div
                        className={`cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)] ${selectedCandleType === "Hollow candles" ? "bg-accent/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`}
                        onClick={() => {
                          setSelectedCandleType("Hollow candles");
                          setIsCandleDropdownOpen(false);
                        }}
                      >
                        Hollow candles
                      </div>
                      <div
                        className={`cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)] ${selectedCandleType === "Volume candles" ? "bg-accent/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`}
                        onClick={() => {
                          setSelectedCandleType("Volume candles");
                          setIsCandleDropdownOpen(false);
                        }}
                      >
                        Volume candles
                      </div>
                      <div
                        className={`cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)] ${selectedCandleType === "Line" ? "bg-accent/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`}
                        onClick={() => {
                          setSelectedCandleType("Line");
                          setIsCandleDropdownOpen(false);
                        }}
                      >
                        Line
                      </div>
                      <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                        Line with markers
                      </div>
                      <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                        Step line
                      </div>
                      <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                        Area
                      </div>
                      <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                        HLC area
                      </div>
                      <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                        Baseline
                      </div>
                      <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                        Columns
                      </div>
                      <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                        High-low
                      </div>
                      <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                        Volume footprint
                      </div>
                      <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                        Time Price Opportunity
                      </div>
                      <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                        Session volume profile
                      </div>
                      <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                        Heikin Ashi
                      </div>
                      <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                        Renko
                      </div>
                      <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                        Line break
                      </div>
                      <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                        Kagi
                      </div>
                      <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                        Point & figure
                      </div>
                      <div className="cursor-pointer px-2 py-1 text-sm hover:bg-[hsl(0,0%,15%)]">
                        Range
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 select-none px-2 transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                onClick={() => setIsIndicatorPopupOpen(true)}
              >
                <span className="select-none text-xs">Indicator</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 select-none p-0 transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                onClick={() => setIsSettingsPopupOpen(true)}
              >
                <IoSettingsOutline className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 select-none p-0 transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <GoScreenFull className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 select-none p-0 transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <IoCameraReverseOutline className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="-mr-4 h-6 select-none px-2 transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <span className="select-none text-xs">Publish</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div
        ref={containerRef}
        className="fixed left-0 right-10 overflow-hidden bg-background"
        style={{
          top: `${HEADER_HEIGHT}px`,
          bottom: `${FOOTER_HEIGHT + panelHeight}px`,
        }}
      >
        <TradingViewChart ref={chartRef} />
      </div>

      {/* Bottom Panel - Always at bottom of viewport */}
      <div
        ref={bottomPanelRef}
        className="fixed left-0 right-0 z-10 overflow-auto bg-background"
        style={{
          bottom: 0,
          height: `${panelHeight}px`,
          willChange: "height",
          contain: "layout paint size",
          transition: isDragging ? "none" : "height 0.15s ease-out",
        }}
        role="region"
        aria-label="Bottom panel"
      >
        {panelHeight > 0 && (
          <div className="panel-content h-full w-full">
            {renderPanelContent()}
          </div>
        )}
      </div>

      {/* Footer Dock - Moves up with panel */}
      <div
        ref={footerDockRef}
        className="fixed left-0 right-0 z-20"
        style={{
          bottom: 0,
          transform: `translateY(-${panelHeight}px)`,
          willChange: "transform",
          transition: isDragging ? "none" : "transform 0.15s ease-out",
        }}
      >
        {/* Invisible drag hitbox above divider */}
        <div
          ref={dividerRef}
          className="panel-drag-handle h-2 cursor-ns-resize"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onDoubleClick={handleDoubleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Resize panel"
          style={{ touchAction: "none" }}
        />

        {/* Visible divider line */}
        <div className="h-px bg-border" />

        {/* Footer content */}
        <div className="h-8 w-full select-none border-t border-border bg-background">
          <div className="flex h-full items-center justify-between px-6">
            <div className="flex items-center gap-2">
              {Object.entries(PANEL_PAGES).map(([key, label]) => (
                <Button
                  key={key}
                  variant="ghost"
                  size="sm"
                  className={`h-6 select-none px-2 transition-all hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 ${
                    activePage === key
                      ? "bg-white/30 shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                      : ""
                  }`}
                  onClick={() => handlePageClick(key as PanelPage)}
                  aria-pressed={activePage === key}
                >
                  <span className="select-none text-xs">{label}</span>
                </Button>
              ))}
            </div>
            <LiveTimestamp />
          </div>
        </div>
        {panelHeight > 0 && <div className="h-px bg-border" />}
      </div>

      <div className="fixed bottom-8 right-0 top-8 w-10 select-none border-l border-border bg-background">
        <div className="flex h-full flex-col items-center gap-2 pt-2">
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 select-none p-0 transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <BsTools className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 select-none p-0 transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <LuAlarmClockCheck className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 select-none p-0 transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <PiChats className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1" />
          <div className="flex flex-col items-center gap-2 pb-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 select-none p-0 transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <IoCalendarNumberOutline className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 select-none p-0 transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <AiOutlineProduct className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 select-none p-0 transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <CgCommunity className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 select-none p-0 transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <MdOutlineEditNotifications className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 select-none p-0 transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <LuCircleHelp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Symbol Popup */}
      {isSymbolPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setIsSymbolPopupOpen(false)}
        >
          <div
            className="relative h-[80vh] w-[50vw] select-none rounded-lg border border-border bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="absolute left-4 top-2 select-none text-lg font-semibold">
              Search Symbols
            </h2>
            <input
              type="text"
              placeholder="Search..."
              className="absolute left-0 right-0 top-10 h-10 border-b border-t border-border bg-background px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute bottom-0 left-0 top-20 w-48 border-r border-border bg-muted/20">
              <div className="space-y-1 p-2">
                {[
                  "Watch List",
                  "All",
                  "Stocks",
                  "Funds",
                  "Futures",
                  "Forex",
                  "Crypto",
                  "Indices",
                  "Bonds",
                  "Economy",
                  "Options",
                ].map((category) => (
                  <div
                    key={category}
                    className={`cursor-pointer px-2 py-1 text-sm transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] ${
                      activeCategory === category
                        ? "bg-accent/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                        : ""
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-0 left-48 right-0 top-20 overflow-auto">
              <div className="space-y-1 p-2">
                <div className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-muted">
                  <span>AAPL</span>
                  <span className="text-muted-foreground">NASDAQ</span>
                </div>
                <div className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-muted">
                  <span>GOOGL</span>
                  <span className="text-muted-foreground">NASDAQ</span>
                </div>
                <div className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-muted">
                  <span>MSFT</span>
                  <span className="text-muted-foreground">NASDAQ</span>
                </div>
                <div className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-muted">
                  <span>TSLA</span>
                  <span className="text-muted-foreground">NASDAQ</span>
                </div>
                <div className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-muted">
                  <span>AMZN</span>
                  <span className="text-muted-foreground">NASDAQ</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsSymbolPopupOpen(false)}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Indicator Popup */}
      {isIndicatorPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setIsIndicatorPopupOpen(false)}
        >
          <div
            className="relative h-[80vh] w-[50vw] select-none rounded-lg border border-border bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="absolute left-4 top-2 select-none text-lg font-semibold">
              Indicators
            </h2>
            <input
              type="text"
              placeholder="Search..."
              className="absolute left-0 right-0 top-10 h-10 border-b border-t border-border bg-background px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute bottom-0 left-0 top-20 w-48 border-r border-border bg-muted/20">
              <div className="space-y-1 p-2">
                <div
                  className={`cursor-pointer px-2 py-1 text-sm transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] ${selectedIndicatorCategory === "Favourites" ? "bg-accent/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`}
                  onClick={() => setSelectedIndicatorCategory("Favourites")}
                >
                  Favourites
                </div>
                <div
                  className={`cursor-pointer px-2 py-1 text-sm transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] ${selectedIndicatorCategory === "Personal" ? "bg-accent/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`}
                  onClick={() => setSelectedIndicatorCategory("Personal")}
                >
                  Personal
                </div>
                <div
                  className={`cursor-pointer px-2 py-1 text-sm transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] ${selectedIndicatorCategory === "Technical" ? "bg-accent/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`}
                  onClick={() => setSelectedIndicatorCategory("Technical")}
                >
                  Technical
                </div>
                <div
                  className={`cursor-pointer px-2 py-1 text-sm transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] ${selectedIndicatorCategory === "Financial" ? "bg-accent/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`}
                  onClick={() => setSelectedIndicatorCategory("Financial")}
                >
                  Financial
                </div>
                <div
                  className={`cursor-pointer px-2 py-1 text-sm transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] ${selectedIndicatorCategory === "Community" ? "bg-accent/20 shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`}
                  onClick={() => setSelectedIndicatorCategory("Community")}
                >
                  Community
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-48 right-0 top-20 overflow-auto"></div>
            <button
              onClick={() => setIsIndicatorPopupOpen(false)}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Settings Popup */}
      {isSettingsPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setIsSettingsPopupOpen(false)}
        >
          <div
            className="relative h-[80vh] w-[50vw] select-none rounded-lg border border-border bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="absolute left-4 top-2 select-none text-lg font-semibold">
              Settings
            </h2>
            <div className="absolute bottom-0 left-0 top-10 w-48 border-r border-border bg-muted/20">
              <div className="space-y-1 p-2">
                <div className="cursor-pointer bg-accent/20 px-2 py-1 text-sm shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  General
                </div>
                <div className="cursor-pointer px-2 py-1 text-sm transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  Chart
                </div>
                <div className="cursor-pointer px-2 py-1 text-sm transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  Trading
                </div>
                <div className="cursor-pointer px-2 py-1 text-sm transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  Notifications
                </div>
                <div className="cursor-pointer px-2 py-1 text-sm transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  Account
                </div>
                <div className="cursor-pointer px-2 py-1 text-sm transition-shadow hover:bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  Privacy
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-48 right-0 top-10 overflow-auto">
              <div className="space-y-4 p-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Theme</h3>
                  <div className="flex gap-2">
                    <button className="rounded border border-border px-3 py-1 text-sm hover:bg-muted">
                      Light
                    </button>
                    <button className="rounded border border-border bg-accent/20 px-3 py-1 text-sm">
                      Dark
                    </button>
                    <button className="rounded border border-border px-3 py-1 text-sm hover:bg-muted">
                      Auto
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Language</h3>
                  <select className="w-full rounded border border-border bg-background px-3 py-1 text-sm">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Time Zone</h3>
                  <select className="w-full rounded border border-border bg-background px-3 py-1 text-sm">
                    <option>UTC</option>
                    <option>EST</option>
                    <option>PST</option>
                    <option>GMT</option>
                  </select>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsSettingsPopupOpen(false)}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const LiveTimestamp = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="select-none font-mono text-sm text-muted-foreground">
      {time}
    </div>
  );
};

export default ChartsPage;
