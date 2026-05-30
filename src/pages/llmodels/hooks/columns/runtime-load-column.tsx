// Runtime load column for the model list table.
//
// Extracted from use-models-columns.tsx so upstream changes to the main
// columns hook don't drag this fork-specific column into every rebase
// conflict.
import { SealColumnProps } from '@/components/seal-table/types';
import { QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Spin, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef } from 'react';
import { ModelRuntimeSnapshot } from '../../apis';
import { ListItem } from '../../config/types';

// Hold last non-null TTFT/TPOT/throughput per model so the UI doesn't flip to
// "--" the moment a 30s aggregation window has no requests. Values older than
// this window fall back to "--".
const STALE_WINDOW_MS = 60_000;

type LastGood = Record<
  string,
  {
    ttft?: number;
    ttftAt?: number;
    tpot?: number;
    tpotAt?: number;
    throughput?: number;
    throughputAt?: number;
  }
>;

interface UseRuntimeLoadColumnProps {
  runtimeSnapshots?: Record<string, ModelRuntimeSnapshot>;
  runtimeUpdatedAt?: string | null;
  refreshRuntime?: () => Promise<void>;
  runtimeRefreshing?: boolean;
}

const useRuntimeLoadColumn = ({
  runtimeSnapshots,
  runtimeUpdatedAt,
  refreshRuntime,
  runtimeRefreshing
}: UseRuntimeLoadColumnProps): SealColumnProps => {
  const intl = useIntl();
  const lastGoodRef = useRef<LastGood>({});

  useEffect(() => {
    if (!runtimeSnapshots) return;
    const now = Date.now();
    Object.entries(runtimeSnapshots).forEach(([id, snap]) => {
      const lg = lastGoodRef.current[id] || {};
      if (snap.ttft_avg_ms !== undefined && snap.ttft_avg_ms !== null) {
        lg.ttft = snap.ttft_avg_ms;
        lg.ttftAt = now;
      }
      if (snap.tpot_avg_ms !== undefined && snap.tpot_avg_ms !== null) {
        lg.tpot = snap.tpot_avg_ms;
        lg.tpotAt = now;
      }
      if (
        snap.gen_throughput_tok_s !== undefined &&
        snap.gen_throughput_tok_s !== null
      ) {
        lg.throughput = snap.gen_throughput_tok_s;
        lg.throughputAt = now;
      }
      lastGoodRef.current[id] = lg;
    });
  }, [runtimeSnapshots]);

  return useMemo<SealColumnProps>(
    () => ({
      title: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Tooltip
            title={intl.formatMessage({ id: 'models.table.runtimeLoad.tips' })}
          >
            <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {intl.formatMessage({ id: 'models.table.runtimeLoad' })}
            </span>
            <QuestionCircleOutlined className="m-l-5" />
          </Tooltip>
          {/* Global refresh lives in the header so it is always visible — a
              per-row icon gets clipped when the column is squeezed on small
              screens. The scrape returns all models at once anyway, so per-row
              vs global refresh is functionally identical. */}
          <Tooltip
            title={intl.formatMessage({
              id: 'models.table.runtimeLoad.refresh'
            })}
          >
            <ReloadOutlined
              spin={!!runtimeRefreshing}
              onClick={(e) => {
                e.stopPropagation();
                if (!runtimeRefreshing) {
                  refreshRuntime?.();
                }
              }}
              style={{
                cursor: runtimeRefreshing ? 'wait' : 'pointer',
                fontSize: 12,
                color: '#888'
              }}
            />
          </Tooltip>
        </span>
      ),
      dataIndex: 'runtime_load',
      key: 'runtime_load',
      align: 'center',
      // 3-row layout (running/waiting/load — req/TTFT/TPOT — throughput) needs
      // a wider cell than the legacy 2-row, otherwise the longer rows wrap.
      span: 3,
      render: (_: any, record: ListItem) => {
        // Hide entirely when replicas=0 (model intentionally stopped or unloaded).
        if ((record.replicas ?? 0) === 0) {
          return <span style={{ color: '#bbb' }}>--</span>;
        }

        const snap = runtimeSnapshots?.[String(record.id)];

        // Replicas>0 but no snapshot yet: show loading hint.
        if (!snap) {
          return (
            <span style={{ color: '#999', fontSize: 12 }}>
              <Spin size="small" style={{ marginRight: 6 }} />
              {intl.formatMessage({
                id: 'models.table.runtimeLoad.waitingData'
              })}
            </span>
          );
        }

        const running = snap.running ?? 0;
        const waiting = snap.waiting ?? 0;

        // Unified load (vLLM KV or llama.cpp slot occupancy).
        const loadRatio = snap.load_ratio ?? null;
        const loadDisplay =
          loadRatio === null
            ? intl.formatMessage({ id: 'models.table.runtimeLoad.kvNa' })
            : `${(loadRatio * 100).toFixed(0)}%`;
        const loadColor = loadRatio === null ? '#bbb' : undefined;

        const lg = lastGoodRef.current[String(record.id)] || {};
        const now = Date.now();

        let ttft = '--';
        let ttftStale = false;
        if (snap.ttft_avg_ms !== undefined && snap.ttft_avg_ms !== null) {
          ttft = `${snap.ttft_avg_ms.toFixed(0)} ms`;
        } else if (
          lg.ttft !== undefined &&
          lg.ttft !== null &&
          lg.ttftAt &&
          now - lg.ttftAt < STALE_WINDOW_MS
        ) {
          ttft = `${lg.ttft.toFixed(0)} ms`;
          ttftStale = true;
        }

        let tpot = '--';
        let tpotStale = false;
        if (snap.tpot_avg_ms !== undefined && snap.tpot_avg_ms !== null) {
          tpot = `${snap.tpot_avg_ms.toFixed(0)} ms`;
        } else if (
          lg.tpot !== undefined &&
          lg.tpot !== null &&
          lg.tpotAt &&
          now - lg.tpotAt < STALE_WINDOW_MS
        ) {
          tpot = `${lg.tpot.toFixed(0)} ms`;
          tpotStale = true;
        }

        const reqRate = snap.req_per_min ?? null;
        const reqDisplay =
          reqRate === null ? '--' : `${reqRate.toFixed(1)}/min`;
        const reqColor = reqRate === null ? '#bbb' : undefined;

        let throughput = '--';
        let throughputStale = false;
        if (
          snap.gen_throughput_tok_s !== undefined &&
          snap.gen_throughput_tok_s !== null
        ) {
          throughput = `${snap.gen_throughput_tok_s.toFixed(1)} tok/s`;
        } else if (
          lg.throughput !== undefined &&
          lg.throughput !== null &&
          lg.throughputAt &&
          now - lg.throughputAt < STALE_WINDOW_MS
        ) {
          throughput = `${lg.throughput.toFixed(1)} tok/s`;
          throughputStale = true;
        }

        const kvPerReplica = snap.kv_per_replica ?? [];
        const updatedAgo = runtimeUpdatedAt
          ? dayjs(runtimeUpdatedAt).fromNow()
          : null;

        const tooltipContent = (
          <div style={{ fontSize: 12, lineHeight: 1.6, minWidth: 220 }}>
            <div>
              <b>
                {intl.formatMessage({
                  id: 'models.table.runtimeLoad.running'
                })}
              </b>
              : {running}
            </div>
            <div>
              <b>
                {intl.formatMessage({
                  id: 'models.table.runtimeLoad.waiting'
                })}
              </b>
              : {waiting}
            </div>
            <div>
              <b>
                {intl.formatMessage({ id: 'models.table.runtimeLoad.load' })}
              </b>
              : <span style={{ color: loadColor }}>{loadDisplay}</span>
              {loadRatio !== null && (
                <span style={{ color: '#888', marginLeft: 6 }}>
                  (
                  {intl.formatMessage({
                    id: snap.kv_supported
                      ? 'models.table.runtimeLoad.loadSourceVllm'
                      : 'models.table.runtimeLoad.loadSourceLlamaCpp'
                  })}
                  )
                </span>
              )}
              {loadRatio !== null && kvPerReplica.length > 0 && (
                <span style={{ color: '#888', marginLeft: 6 }}>
                  [
                  {kvPerReplica
                    .map((v) => `${(v * 100).toFixed(0)}%`)
                    .join(', ')}
                  ]
                </span>
              )}
            </div>
            <div>
              <b>
                {intl.formatMessage({
                  id: 'models.table.runtimeLoad.reqRate'
                })}
              </b>
              : <span style={{ color: reqColor }}>{reqDisplay}</span>
            </div>
            <div>
              <b>
                {intl.formatMessage({ id: 'models.table.runtimeLoad.ttft' })}
              </b>
              :{' '}
              <span style={{ color: ttftStale ? '#bbb' : undefined }}>
                {ttft}
              </span>
            </div>
            <div>
              <b>
                {intl.formatMessage({ id: 'models.table.runtimeLoad.tpot' })}
              </b>
              :{' '}
              <span style={{ color: tpotStale ? '#bbb' : undefined }}>
                {tpot}
              </span>
            </div>
            <div>
              <b>
                {intl.formatMessage({
                  id: 'models.table.runtimeLoad.throughput'
                })}
              </b>
              :{' '}
              <span style={{ color: throughputStale ? '#bbb' : undefined }}>
                {throughput}
              </span>
            </div>
            {updatedAgo && (
              <div style={{ marginTop: 4, color: '#888' }}>
                {intl.formatMessage(
                  { id: 'models.table.runtimeLoad.updatedAt' },
                  { time: updatedAgo }
                )}
              </div>
            )}
          </div>
        );

        const inline = (
          <div
            style={{
              fontSize: 12,
              lineHeight: 1.4,
              textAlign: 'center',
              minWidth: 180,
              whiteSpace: 'nowrap'
            }}
          >
            <div>
              <span style={{ color: '#52c41a' }}>▶ {running}</span>
              <span style={{ marginLeft: 8, color: '#faad14' }}>
                ⏸ {waiting}
              </span>
              <span style={{ marginLeft: 8, color: loadColor }}>
                📊 {loadDisplay}
              </span>
            </div>
            <div style={{ color: '#666' }}>
              <span style={{ color: ttftStale ? '#bbb' : undefined }}>
                TTFT {ttft}
              </span>
              <span style={{ margin: '0 6px', color: '#ccc' }}>·</span>
              <span style={{ color: tpotStale ? '#bbb' : undefined }}>
                TPOT {tpot}
              </span>
            </div>
            <div style={{ color: '#666' }}>
              <span style={{ color: reqColor }}>🔁 {reqDisplay}</span>
              <span style={{ margin: '0 6px', color: '#ccc' }}>·</span>
              <span style={{ color: throughputStale ? '#bbb' : undefined }}>
                🚀 {throughput}
              </span>
            </div>
          </div>
        );

        return (
          <Tooltip title={tooltipContent} placement="top">
            <div style={{ cursor: 'help' }}>{inline}</div>
          </Tooltip>
        );
      }
    }),
    [
      intl,
      runtimeSnapshots,
      runtimeUpdatedAt,
      refreshRuntime,
      runtimeRefreshing
    ]
  );
};

export default useRuntimeLoadColumn;
