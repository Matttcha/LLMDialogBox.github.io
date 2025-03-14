interface ConversationMetric {
  marks: {
    start: string;
    end: string;
    streamingStart?: string;
    firstChunkArrival?: string;
  };
  dataPoints: DataPoint[];
  resources: PerformanceResourceTiming[];
}

interface DataPoint {
  type: "text" | "suggestion";
  timestamp: number;
  memory?: number;
}

interface PerformanceReport {
  id: string;
  measures: {
    total?: PerformanceMeasure;
    streaming?: PerformanceMeasure;
    firstChunk?: PerformanceMeasure;
  };
  dataPoints: DataPoint[];
  stats: {
    avgChunkInterval: number;
    maxMemory: number;
    chunkTypes: Record<string, number>;
  };
}

/**
 * DialogPerfMonitor 性能监控类：记录流式响应时间、首个数据块到达时间等性能指标，数据上报
 */
export default class DialogPerfMonitor {
  private metrics = new Map<string, ConversationMetric>();
  private memorySupported: boolean;

  constructor() {
    this.memorySupported =
      "memory" in performance && !!(performance as any).memory?.jsHeapSizeLimit;
  }

  // 安全获取内存信息
  private getMemoryInfo(): { used: number; limit: number } | null {
    if (!this.memorySupported) return null;
    const mem = (performance as any).memory;
    return { used: mem.usedJSHeapSize, limit: mem.jsHeapSizeLimit };
  }

  startConversation(conversationId: string) {
    const marks = {
      start: `conv_start_${conversationId}`,
      end: `conv_end_${conversationId}`,
    };

    try {
      performance.mark(marks.start); // 标记一条性能条目：`conv_start_${conversationId}` 表示消息开始发送
      this.metrics.set(conversationId, {
        marks,
        dataPoints: [],
        resources: [],
      });
    } catch (error) {
      console.error("Failed to start conversation monitoring:", error);
    }
  }

  recordStreamingStart(conversationId: string) {
    const metric = this.metrics.get(conversationId);
    if (!metric) return;

    try {
      const markName = `stream_start_${conversationId}`;
      performance.mark(markName); // 标记一条性能条目：`stream_start_${conversationId}` 表示流式响应开始
      metric.marks.streamingStart = markName;
    } catch (error) {
      console.error("Failed to record streaming start:", error);
    }
  }

  recordChunkArrival(conversationId: string, chunkType: "text" | "suggestion") {
    const metric = this.metrics.get(conversationId);
    if (!metric) return;

    try {
      if (!metric.dataPoints.length) {
        const markName = `stream_first_chunk_arrival_${conversationId}`;
        performance.mark(markName); // 标记一条性能条目，表示接收到流式响应第一个流式块

        metric.marks.firstChunkArrival = markName;
      }
      metric.dataPoints.push({
        type: chunkType,
        timestamp: performance.now(),
        memory: this.getMemoryInfo()?.used,
      });
    } catch (error) {
      console.error("Failed to record chunk arrival:", error);
    }
  }

  endConversation(conversationId: string) {
    const metric = this.metrics.get(conversationId);
    if (!metric) return;

    try {
      // 确保结束标记存在
      if (!performance.getEntriesByName(metric.marks.end).length) {
        performance.mark(metric.marks.end);
      }

      const measures: PerformanceReport["measures"] = {};

      // 总耗时测量
      if (performance.getEntriesByName(metric.marks.start).length) {
        measures.total = performance.measure(
          "total_duration",
          metric.marks.start,
          metric.marks.end
        );
      }

      // 流式耗时测量
      if (metric.marks.streamingStart) {
        measures.streaming = performance.measure(
          "streaming_duration",
          metric.marks.streamingStart,
          metric.marks.end
        );
      }

      // 发送接口到流式响应第一个数据块到达的耗时
      if (metric.marks.firstChunkArrival) {
        measures.firstChunk = performance.measure(
          "first_chunk_duration",
          metric.marks.streamingStart,
          metric.marks.firstChunkArrival
        );
      }

      const report: PerformanceReport = {
        id: conversationId,
        measures,
        dataPoints: metric.dataPoints,
        stats: this.calculateStats(metric.dataPoints),
      };

      this.sendReport(report);
    } catch (error) {
      console.error("Failed to end conversation monitoring:", error);
    } finally {
      this.metrics.delete(conversationId);
    }
  }

  /**
   * calculateStats 计算消息性能监控状态
   * @param dataPoints
   * @returns
   */
  private calculateStats(dataPoints: DataPoint[]) {
    const validMemories = dataPoints
      .map((p) => p.memory)
      .filter((m): m is number => typeof m === "number");

    return {
      avgChunkInterval: this.calculateAverageInterval(dataPoints), // 消息数据块平均到达时间
      maxMemory: validMemories.length ? Math.max(...validMemories) : 0, // 消息数据块占用最大内存
      chunkTypes: dataPoints.reduce((acc, p) => {
        // 消息数据块类型统计
        acc[p.type] = (acc[p.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
  /**
   * calculateAverageInterval 计算块平均到达时间
   * @param points
   * @returns
   */
  private calculateAverageInterval(points: DataPoint[]) {
    if (points.length < 2) return 0;

    const intervals = points
      .slice(1)
      .map((p, i) => p.timestamp - points[i].timestamp);

    return intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
  }

  /**
   * sendReport 发送报告
   * @param report
   */
  private sendReport(report: PerformanceReport) {
    try {
      const success = navigator.sendBeacon(
        "/api/performance",
        JSON.stringify(report)
      );

      if (!success) {
        console.warn("Beacon failed, fallback to fetch");
        fetch("/api/performance", {
          method: "POST",
          body: JSON.stringify(report),
          keepalive: true,
        });
      }
    } catch (error) {
      console.error("Failed to send performance report:", error);
    }
  }

  // 清理资源
  disconnect() {
    this.metrics.clear();
  }
}
