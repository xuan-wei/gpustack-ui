// Lifecycle columns (AutoLoad / AutoAdjust / AutoUnload / LastUsed) for the
// model list table.
//
// Extracted from use-models-columns.tsx so these fork-specific columns don't
// bloat the official columns hook's diff and don't drag it into every rebase
// conflict (same rationale as runtime-load-column.tsx).
import { SealColumnProps } from '@/components/seal-table/types';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Switch, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { ListItem } from '../../config/types';

interface UseLifecycleColumnsProps {
  handleAutoLoadToggle: (checked: boolean, record: ListItem) => void;
  handleAutoUnloadToggle: (checked: boolean, record: ListItem) => void;
  handleAutoAdjustToggle: (checked: boolean, record: ListItem) => void;
  calculateUnloadTime: (record: ListItem) => string | null;
  calculateNextScaleTime: (
    record: ListItem
  ) => string | React.ReactElement | null;
}

export interface LifecycleColumns {
  autoLoadColumn: SealColumnProps;
  autoAdjustColumn: SealColumnProps;
  autoUnloadColumn: SealColumnProps;
  lastUsedColumn: SealColumnProps;
}

const useLifecycleColumns = ({
  handleAutoLoadToggle,
  handleAutoUnloadToggle,
  handleAutoAdjustToggle,
  calculateUnloadTime,
  calculateNextScaleTime
}: UseLifecycleColumnsProps): LifecycleColumns => {
  const intl = useIntl();

  return useMemo<LifecycleColumns>(
    () => ({
      autoLoadColumn: {
        title: (
          <Tooltip
            title={intl.formatMessage({ id: 'models.form.autoLoad.tips' })}
          >
            <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {intl.formatMessage({ id: 'models.form.autoLoad' })}
            </span>
            <QuestionCircleOutlined className="m-l-5" />
          </Tooltip>
        ),
        dataIndex: 'auto_load_replicas',
        key: 'auto_load',
        align: 'center',
        span: 2,
        width: 120,
        editable: {
          valueType: 'number',
          title: intl.formatMessage({ id: 'models.form.autoLoadReplicas' })
        },
        render: (auto_load_replicas: number | undefined, record: ListItem) => {
          const displayValue =
            auto_load_replicas !== undefined
              ? auto_load_replicas < 1
                ? 1
                : auto_load_replicas
              : '-';
          return (
            <div className="flex-column flex-center" style={{ gap: '4px' }}>
              <Switch
                checked={!!record.auto_load}
                size="small"
                onChange={(checked) => handleAutoLoadToggle(checked, record)}
              />
              <div
                className="flex-center"
                style={{ lineHeight: '1', fontSize: '12px' }}
              >
                <span>{displayValue}</span>
              </div>
            </div>
          );
        }
      },
      autoAdjustColumn: {
        title: (
          <Tooltip
            title={intl.formatMessage({
              id: 'models.form.autoAdjustReplicas.tips'
            })}
          >
            <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {intl.formatMessage({ id: 'models.form.autoAdjustReplicas' })}
            </span>
            <QuestionCircleOutlined className="m-l-5" />
          </Tooltip>
        ),
        dataIndex: 'auto_adjust_replicas',
        key: 'auto_adjust_replicas',
        align: 'center',
        span: 2,
        width: 130,
        render: (_: any, record: ListItem) => {
          const nextScaleTimeText = record.auto_adjust_replicas
            ? calculateNextScaleTime(record)
            : null;
          return (
            <div className="flex-column flex-center" style={{ gap: '4px' }}>
              <Switch
                checked={!!record.auto_adjust_replicas}
                size="small"
                onChange={(checked) => handleAutoAdjustToggle(checked, record)}
              />
              {nextScaleTimeText && (
                <div
                  className="flex-center"
                  style={{
                    lineHeight: '1',
                    fontSize: '10px',
                    color: '#ff7a45',
                    textAlign: 'center'
                  }}
                >
                  {nextScaleTimeText}
                </div>
              )}
            </div>
          );
        }
      },
      autoUnloadColumn: {
        title: (
          <Tooltip
            title={intl.formatMessage({ id: 'models.form.autoUnload.tips' })}
          >
            <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {intl.formatMessage({ id: 'models.form.autoUnload' })}
            </span>
            <QuestionCircleOutlined className="m-l-5" />
          </Tooltip>
        ),
        dataIndex: 'auto_unload_timeout',
        key: 'auto_unload',
        align: 'center',
        span: 2,
        width: 140,
        editable: {
          valueType: 'number',
          title: intl.formatMessage({ id: 'models.form.autoUnloadTimeout' })
        },
        render: (auto_unload_timeout: number | undefined, record: ListItem) => {
          const timeoutDisplay =
            auto_unload_timeout !== undefined
              ? `${auto_unload_timeout < 5 ? 5 : auto_unload_timeout}min`
              : '-';
          const shouldShowUnloadTime =
            !!record.auto_unload && (record.ready_replicas ?? 0) >= 1;
          const unloadTimeText = shouldShowUnloadTime
            ? calculateUnloadTime(record)
            : null;
          return (
            <div className="flex-column flex-center" style={{ gap: '4px' }}>
              <Switch
                checked={!!record.auto_unload}
                size="small"
                onChange={(checked) => handleAutoUnloadToggle(checked, record)}
              />
              <div
                className="flex-center"
                style={{ lineHeight: '1', fontSize: '12px' }}
              >
                <span>{timeoutDisplay}</span>
              </div>
              {unloadTimeText && (
                <div
                  className="flex-center"
                  style={{
                    lineHeight: '1',
                    fontSize: '10px',
                    color: '#ff7a45',
                    textAlign: 'center'
                  }}
                >
                  {unloadTimeText}
                </div>
              )}
            </div>
          );
        }
      },
      lastUsedColumn: {
        title: intl.formatMessage({ id: 'models.table.lastUsed' }),
        dataIndex: 'last_request_time',
        key: 'last_request_time',
        align: 'center',
        span: 2,
        render: (text: string | undefined) => {
          if (!text) {
            return (
              <span style={{ color: '#bbb' }}>
                {intl.formatMessage({ id: 'models.table.lastUsed.never' })}
              </span>
            );
          }
          return (
            <Tooltip title={dayjs(text).format('YYYY-MM-DD HH:mm:ss')}>
              <span style={{ cursor: 'help' }}>{dayjs(text).fromNow()}</span>
            </Tooltip>
          );
        }
      }
    }),
    [
      intl,
      handleAutoLoadToggle,
      handleAutoUnloadToggle,
      handleAutoAdjustToggle,
      calculateUnloadTime,
      calculateNextScaleTime
    ]
  );
};

export default useLifecycleColumns;
