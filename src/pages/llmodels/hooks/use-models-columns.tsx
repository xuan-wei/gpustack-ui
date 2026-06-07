// columns.ts
import { systemConfigAtom } from '@/atoms/system';
import AutoTooltip from '@/components/auto-tooltip';
import DropdownButtons from '@/components/drop-down-buttons';
import icons from '@/components/icon-font/icons';
import { SealColumnProps } from '@/components/seal-table/types';
import { OPENAI_COMPATIBLE, tableSorter } from '@/config/settings';
import GrafanaIcon from '@/pages/_components/grafana-icon';
import { TargetStatusValueMap } from '@/pages/model-routes/config';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import _ from 'lodash';
import React, { useMemo } from 'react';
import ModelTag from '../../_components/model-tag';
import { ModelRuntimeSnapshot } from '../apis';
import { generateSource } from '../config/button-actions';
import { ListItem } from '../config/types';
import useLifecycleColumns from './columns/lifecycle-columns';
import useRuntimeLoadColumn from './columns/runtime-load-column';

interface ActionItem {
  label: string;
  key: string;
  icon: React.ReactNode;
  props?: {
    danger?: boolean;
  };
}

const ActionList: ActionItem[] = [
  {
    label: 'common.button.edit',
    key: 'edit',
    icon: icons.EditOutlined
  },
  {
    label: 'models.openinplayground',
    key: 'chat',
    icon: icons.ExperimentOutlined
  },
  {
    label: 'common.button.start',
    key: 'start',
    icon: icons.Play
  },
  {
    label: 'common.button.stop',
    key: 'stop',
    icon: icons.Stop
  },
  {
    label: 'resources.metrics.details',
    key: 'metrics',
    icon: (
      <span className="flex-center">
        <GrafanaIcon style={{ width: 14, height: 14 }}></GrafanaIcon>
      </span>
    )
  },
  {
    key: 'copy',
    label: 'common.button.clone',
    icon: icons.CopyOutlined
  },
  {
    label: 'common.button.delete',
    key: 'delete',
    props: {
      danger: true
    },
    icon: icons.DeleteOutlined
  }
];

interface ModelsColumnsHookProps {
  handleSelect: (val: string, record: ListItem) => void;
  sortOrder: string[];
  targetList: any[];
  refreshTrigger: number;
  handleAutoLoadToggle: (checked: boolean, record: ListItem) => void;
  handleAutoUnloadToggle: (checked: boolean, record: ListItem) => void;
  handleAutoAdjustToggle: (checked: boolean, record: ListItem) => void;
  calculateUnloadTime: (record: ListItem) => string | null;
  calculateNextScaleTime: (
    record: ListItem
  ) => string | React.ReactElement | null;
  runtimeSnapshots?: Record<string, ModelRuntimeSnapshot>;
  runtimeUpdatedAt?: string | null;
  refreshRuntime?: () => Promise<void>;
  runtimeRefreshing?: boolean;
}

const useModelsColumns = ({
  handleSelect,
  sortOrder,
  targetList,
  refreshTrigger,
  handleAutoLoadToggle,
  handleAutoUnloadToggle,
  handleAutoAdjustToggle,
  calculateUnloadTime,
  calculateNextScaleTime,
  runtimeSnapshots,
  runtimeUpdatedAt,
  refreshRuntime,
  runtimeRefreshing
}: ModelsColumnsHookProps): SealColumnProps[] => {
  const intl = useIntl();
  const systemConfig = useAtomValue(systemConfigAtom);

  const runtimeLoadColumn = useRuntimeLoadColumn({
    runtimeSnapshots,
    runtimeUpdatedAt,
    refreshRuntime,
    runtimeRefreshing
  });

  const { autoLoadColumn, autoAdjustColumn, autoUnloadColumn, lastUsedColumn } =
    useLifecycleColumns({
      handleAutoLoadToggle,
      handleAutoUnloadToggle,
      handleAutoAdjustToggle,
      calculateUnloadTime,
      calculateNextScaleTime
    });

  const setModelActionList = useMemoizedFn((record: any) => {
    return _.filter(ActionList, (action: any) => {
      if (action.key === 'chat') {
        return (
          record.ready_replicas > 0 &&
          targetList?.find(
            (target) =>
              target.model_id === record.id &&
              target.state === TargetStatusValueMap.Active
          )
        );
      }

      if (action.key === 'start') {
        return record.replicas === 0;
      }

      if (action.key === 'stop') {
        return record.replicas > 0;
      }
      if (action.key === 'metrics') {
        return systemConfig.showMonitoring;
      }

      return true;
    });
  });

  return useMemo(() => {
    // refreshTrigger is referenced to force re-render every second for countdowns
    void refreshTrigger;

    return [
      {
        title: intl.formatMessage({ id: 'common.table.name' }),
        dataIndex: 'name',
        key: 'name',
        sorter: tableSorter(1),
        span: 4,
        width: 240,
        render: (text: string, record: ListItem) => (
          <span className="flex-center" style={{ maxWidth: '100%' }}>
            <AutoTooltip ghost>
              <span className="m-r-5">{text}</span>
            </AutoTooltip>
            <ModelTag categoryKey={record.categories?.[0] || ''} />
          </span>
        )
      },
      {
        title: intl.formatMessage({ id: 'models.form.source' }),
        dataIndex: 'source',
        key: 'source',
        sorter: tableSorter(2),
        span: 2,
        width: 200,
        render: (_: string, record: ListItem) => (
          <span className="flex flex-column" style={{ width: '100%' }}>
            <AutoTooltip ghost>{generateSource(record)}</AutoTooltip>
          </span>
        )
      },
      {
        title: (
          <Tooltip
            title={intl.formatMessage(
              { id: 'models.form.replicas.tips' },
              { api: `${window.location.origin}/${OPENAI_COMPATIBLE}` }
            )}
          >
            <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {intl.formatMessage({ id: 'models.form.replicas' })}
            </span>
            <QuestionCircleOutlined className="m-l-5" />
          </Tooltip>
        ),
        dataIndex: 'replicas',
        key: 'replicas',
        align: 'center',
        sorter: tableSorter(3),
        span: 2,
        width: 120,
        editable: {
          valueType: 'number',
          title: intl.formatMessage({ id: 'models.table.replicas.edit' })
        },
        render: (_: number, record: ListItem) => (
          <div className="flex-column flex-center" style={{ gap: '4px' }}>
            <span style={{ paddingLeft: 10, minWidth: '33px' }}>
              {record.ready_replicas} / {record.replicas}
            </span>
          </div>
        )
      },
      autoLoadColumn,
      runtimeLoadColumn,
      autoAdjustColumn,
      autoUnloadColumn,
      lastUsedColumn,
      {
        title: intl.formatMessage({ id: 'common.table.createTime' }),
        dataIndex: 'created_at',
        key: 'created_at',
        sorter: tableSorter(4),
        span: 2,
        width: 180,
        render: (text: number) => (
          <AutoTooltip ghost>
            {dayjs(text).format('YYYY-MM-DD HH:mm:ss')}
          </AutoTooltip>
        )
      },
      {
        title: intl.formatMessage({ id: 'common.table.operation' }),
        key: 'operation',
        dataIndex: 'operation',
        span: 2,
        width: 120,
        render: (_: any, record: ListItem) => (
          <DropdownButtons
            items={setModelActionList(record)}
            onSelect={(val) => handleSelect(val, record)}
          />
        )
      }
    ];
  }, [
    sortOrder,
    refreshTrigger,
    intl,
    handleSelect,
    setModelActionList,
    runtimeLoadColumn,
    autoLoadColumn,
    autoAdjustColumn,
    autoUnloadColumn,
    lastUsedColumn
  ]);
};

export default useModelsColumns;
