import { modelsExpandKeysAtom } from '@/atoms/models';
import AutoTooltip from '@/components/auto-tooltip';
import DeleteModal from '@/components/delete-modal';
import DropDownActions from '@/components/drop-down-actions';
import DropdownButtons from '@/components/drop-down-buttons';
import { PageSize } from '@/components/logs-viewer/config';
import PageTools from '@/components/page-tools';
import SealTable from '@/components/seal-table';
import { SealColumnProps } from '@/components/seal-table/types';
import { PageAction } from '@/config';
import useBodyScroll from '@/hooks/use-body-scroll';
import useExpandedRowKeys from '@/hooks/use-expanded-row-keys';
import useTableRowSelection from '@/hooks/use-table-row-selection';
import useTableSort from '@/hooks/use-table-sort';
import { ListItem as WorkerListItem } from '@/pages/resources/config/types';
import { handleBatchRequest } from '@/utils';
import {
  IS_FIRST_LOGIN,
  readState,
  writeState
} from '@/utils/localstore/index';
import {
  DownOutlined,
  QuestionCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl, useNavigate } from '@umijs/max';
import {
  Button,
  Empty,
  Input,
  Select,
  Space,
  Switch,
  Tooltip,
  Typography,
  message
} from 'antd';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import _ from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  MODELS_API,
  MODEL_INSTANCE_API,
  createModel,
  deleteModel,
  deleteModelInstance,
  queryModelInstancesList,
  updateModel
} from '../apis';
import {
  InstanceRealtimeLogStatus,
  backendOptionsMap,
  modelCategories,
  modelCategoriesMap,
  modelSourceMap
} from '../config';
import {
  ButtonList,
  categoryToPathMap,
  generateSource,
  modalConfig,
  setModelActionList,
  sourceOptions
} from '../config/button-actions';
import {
  FormData,
  ListItem,
  ModelInstanceListItem,
  SourceType
} from '../config/types';
import { useGenerateFormEditInitialValues } from '../hooks';
import APIAccessInfoModal from './api-access-info';
import DeployModal from './deploy-modal';
import Instances from './instances';
import ModelTag from './model-tag';
import UpdateModel from './update-modal';
import ViewLogsModal from './view-logs-modal';
interface ModelsProps {
  handleSearch: () => void;
  handleNameChange: (e: any) => void;
  handleShowSizeChange?: (page: number, size: number) => void;
  handlePageChange: (page: number, pageSize: number | undefined) => void;
  handleDeleteSuccess: () => void;
  handleCategoryChange: (val: any) => void;
  onViewLogs: () => void;
  onCancelViewLogs: () => void;
  handleOnToggleExpandAll: () => void;
  queryParams: {
    page: number;
    perPage: number;
    query?: string;
    categories?: string[];
  };
  deleteIds?: number[];
  workerList: WorkerListItem[];
  modelFileOptions: any[];
  catalogList?: any[];
  dataSource: ListItem[];
  loading: boolean;
  loadend: boolean;
  total: number;
}

const getFormattedData = (record: any, extraData = {}) => ({
  id: record.id,
  data: {
    ..._.omit(record, [
      'id',
      'ready_replicas',
      'created_at',
      'updated_at',
      'last_request_time',
      'rowIndex'
    ]),
    ...extraData
  }
});

const Models: React.FC<ModelsProps> = ({
  handleNameChange,
  handleSearch,
  handlePageChange,
  handleDeleteSuccess,
  onViewLogs,
  onCancelViewLogs,
  handleCategoryChange,
  handleOnToggleExpandAll,
  modelFileOptions,
  deleteIds,
  dataSource,
  workerList,
  catalogList,
  queryParams,
  loading,
  loadend,
  total
}) => {
  const { getGPUList, generateFormValues, gpuDeviceList } =
    useGenerateFormEditInitialValues();
  const { saveScrollHeight, restoreScrollHeight } = useBodyScroll();
  const [updateFormInitials, setUpdateFormInitials] = useState<{
    gpuOptions: any[];
    modelFileOptions?: any[];
    data: any;
    isGGUF: boolean;
  }>({
    gpuOptions: [],
    modelFileOptions: [],
    data: {},
    isGGUF: false
  });
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandAtom, setExpandAtom] = useAtom(modelsExpandKeysAtom);
  const intl = useIntl();
  const navigate = useNavigate();
  const rowSelection = useTableRowSelection();
  const {
    handleExpandChange,
    handleExpandAll,
    updateExpandedRowKeys,
    removeExpandedRowKey,
    expandedRowKeys
  } = useExpandedRowKeys(expandAtom);
  const { sortOrder, setSortOrder } = useTableSort({
    defaultSortOrder: 'descend'
  });

  const [apiAccessInfo, setAPIAccessInfo] = useState<any>({
    show: false,
    data: {}
  });
  const [openLogModal, setOpenLogModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeployModal, setOpenDeployModal] = useState<{
    show: boolean;
    width: number | string;
    hasLinuxWorker?: boolean;
    source: SourceType;
    gpuOptions: any[];
    isGGUF?: boolean;
    modelFileOptions?: any[];
  }>({
    show: false,
    hasLinuxWorker: false,
    width: 600,
    isGGUF: false,
    source: modelSourceMap.huggingface_value as SourceType,
    gpuOptions: [],
    modelFileOptions: []
  });
  const currentData = useRef<ListItem>({} as ListItem);
  const [currentInstance, setCurrentInstance] = useState<{
    url: string;
    status: string;
    id?: number | string;
    modelId?: number | string;
    tail?: number;
  }>({
    url: '',
    status: ''
  });
  const modalRef = useRef<any>(null);

  // 添加自动倒计时功能
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!catalogList?.length) {
      return;
    }
    const getFirstLoginState = async () => {
      const is_first_login = await readState(IS_FIRST_LOGIN);
      setIsFirstLogin(is_first_login);
    };
    getFirstLoginState();
  }, [catalogList?.length]);

  useEffect(() => {
    if (deleteIds?.length) {
      rowSelection.removeSelectedKey(deleteIds);
    }
  }, [deleteIds]);

  useEffect(() => {
    const getData = async () => {
      await getGPUList();
    };
    getData();
    return () => {
      setExpandAtom([]);
    };
  }, []);

  const setCurrentData = (data: ListItem) => {
    currentData.current = data;
  };

  const handleOnSort = (dataIndex: string, order: any) => {
    setSortOrder(order);
  };

  const handleOnCell = useCallback(
    async (record: any, dataIndex: string) => {
      try {
        // 如果是auto_load_replicas字段，确保值不小于1
        if (
          dataIndex === 'auto_load_replicas' &&
          record.auto_load_replicas !== undefined
        ) {
          if (record.auto_load_replicas < 1) {
            // 更新值为1
            record.auto_load_replicas = 1;
            message.info(
              intl.formatMessage({
                id: 'models.form.auto_load_replicas.min_warning'
              }) || 'Auto load replicas cannot be less than 1, setting to 1'
            );
          }
        }
        // 如果是auto_unload_timeout字段，确保值不小于5
        if (
          dataIndex === 'auto_unload_timeout' &&
          record.auto_unload_timeout !== undefined
        ) {
          if (record.auto_unload_timeout < 5) {
            // 更新值为5
            record.auto_unload_timeout = 5;
            message.info(
              intl.formatMessage({
                id: 'models.form.auto_unload_timeout.min_warning'
              }) ||
                'Auto unload timeout cannot be less than 5 minutes, setting to 5 minutes'
            );
          }
        }

        await updateModel(getFormattedData(record));
        message.success(intl.formatMessage({ id: 'common.message.success' }));
      } catch (error) {
        // ignore
      }
    },
    [intl]
  );

  const handleStartModel = async (row: ListItem) => {
    await updateModel(getFormattedData(row, { replicas: 1 }));
  };

  const handleStopModel = async (row: ListItem) => {
    await updateModel(getFormattedData(row, { replicas: 0 }));
    removeExpandedRowKey([row.id]);
  };

  // 更新模型的最后请求时间
  const updateLastRequestTime = useCallback(async (record: ListItem) => {
    if (!record.last_request_time) {
      try {
        await updateModel(
          getFormattedData(record, {
            // 使用UTC时间格式，与数据库中的其他时间字段保持一致
            last_request_time: dayjs().utc().format('YYYY-MM-DD HH:mm:ss')
          })
        );
        // 静默更新，不显示成功消息
      } catch (error) {
        // 忽略错误
        console.error('Failed to update last_request_time:', error);
      }
    }
  }, []);

  const handleModalOk = useCallback(
    async (data: FormData) => {
      try {
        await updateModel({
          data,
          id: currentData.current?.id as number
        });
        setOpenAddModal(false);
        message.success(intl.formatMessage({ id: 'common.message.success' }));
        setTimeout(() => {
          handleSearch();
        }, 150);
        restoreScrollHeight();
      } catch (error) {}
    },
    [handleSearch]
  );

  const handleModalCancel = useCallback(() => {
    setOpenAddModal(false);
    restoreScrollHeight();
  }, []);

  const handleDeployModalCancel = () => {
    setOpenDeployModal({
      ...openDeployModal,
      show: false
    });
  };

  const handleCreateModel = useCallback(
    async (data: FormData) => {
      try {
        console.log('data:', data, openDeployModal);

        const modelData = await createModel({
          data
        });
        setOpenDeployModal({
          ...openDeployModal,
          show: false
        });
        setTimeout(() => {
          updateExpandedRowKeys([modelData.id, ...expandedRowKeys]);
        }, 300);
        message.success(intl.formatMessage({ id: 'common.message.success' }));
        setTimeout(() => {
          handleSearch?.();
        }, 150);
      } catch (error) {}
    },
    [openDeployModal]
  );

  const handleLogModalCancel = useCallback(() => {
    setOpenLogModal(false);
    onCancelViewLogs();
    restoreScrollHeight();
  }, [onCancelViewLogs]);

  const handleDelete = async (row: any) => {
    modalRef.current.show({
      content: 'models.table.models',
      operation: 'common.delete.single.confirm',
      name: row.name,
      async onOk() {
        await deleteModel(row.id);
        removeExpandedRowKey([row.id]);
        rowSelection.removeSelectedKey(row.id);
        handleDeleteSuccess();
        handleSearch();
      }
    });
  };

  const handleDeleteBatch = () => {
    modalRef.current.show({
      content: 'models.table.models',
      operation: 'common.delete.confirm',
      selection: true,
      async onOk() {
        await handleBatchRequest(rowSelection.selectedRowKeys, deleteModel);
        rowSelection.clearSelections();
        removeExpandedRowKey(rowSelection.selectedRowKeys);
        handleDeleteSuccess();
        handleSearch();
      }
    });
  };

  const handleOpenPlayGround = (row: any) => {
    for (const [category, path] of Object.entries(categoryToPathMap)) {
      if (
        row.categories?.includes(category) &&
        [
          modelCategoriesMap.text_to_speech,
          modelCategoriesMap.speech_to_text
        ].includes(category)
      ) {
        navigate(`${path}&model=${row.name}`);
        return;
      }
      if (row.categories?.includes(category)) {
        navigate(`${path}?model=${row.name}`);
        return;
      }
    }
    navigate(`/playground/chat?model=${row.name}`);
  };

  const handleViewLogs = useCallback(
    async (row: any) => {
      try {
        setCurrentInstance({
          url: `${MODEL_INSTANCE_API}/${row.id}/logs`,
          status: row.state,
          id: row.id,
          modelId: row.model_id,
          tail: InstanceRealtimeLogStatus.includes(row.state)
            ? undefined
            : PageSize - 1
        });
        setOpenLogModal(true);
        onViewLogs();
        saveScrollHeight();
      } catch (error) {
        console.log('error:', error);
      }
    },
    [onViewLogs]
  );
  const handleDeleteInstace = useCallback(
    (row: any) => {
      modalRef.current.show({
        content: 'models.instances',
        okText: 'common.button.delrecreate',
        operation: 'common.delete.single.confirm',
        name: row.name,
        async onOk() {
          await deleteModelInstance(row.id);
        }
      });
    },
    [deleteModelInstance]
  );

  const getModelInstances = useCallback(async (row: any, options?: any) => {
    try {
      const params = {
        id: row.id,
        page: 1,
        perPage: 100
      };
      const data = await queryModelInstancesList(params, {
        token: options?.token
      });
      return data.items || [];
    } catch (error) {
      return [];
    }
  }, []);

  const generateChildrenRequestAPI = useCallback((params: any) => {
    return `${MODELS_API}/${params.id}/instances`;
  }, []);

  const handleEdit = async (row: ListItem) => {
    const initialValues = generateFormValues(row, gpuDeviceList.current);
    setUpdateFormInitials({
      gpuOptions: gpuDeviceList.current,
      modelFileOptions: modelFileOptions,
      data: initialValues,
      isGGUF: row.backend === backendOptionsMap.llamaBox
    });
    setCurrentData(row);
    setOpenAddModal(true);
    saveScrollHeight();
  };

  const handleViewAPIInfo = useCallback((row: ListItem) => {
    setAPIAccessInfo({
      show: true,
      data: {
        id: row.id,
        name: row.name,
        categories: row.categories,
        url: `${MODELS_API}/${row.id}/instances`
      }
    });
  }, []);
  const handleSelect = useCallback(
    async (val: any, row: ListItem) => {
      try {
        if (val === 'edit') {
          handleEdit(row);
        }
        if (val === 'chat') {
          handleOpenPlayGround(row);
        }
        if (val === 'delete') {
          handleDelete(row);
        }
        if (val === 'start') {
          await handleStartModel(row);
          message.success(intl.formatMessage({ id: 'common.message.success' }));
          updateExpandedRowKeys([row.id, ...expandedRowKeys]);
        }

        if (val === 'api') {
          handleViewAPIInfo(row);
        }

        if (val === 'stop') {
          modalRef.current.show({
            content: 'models.instances',
            title: 'common.title.stop.confirm',
            okText: 'common.button.stop',
            operation: 'common.stop.single.confirm',
            name: row.name,
            async onOk() {
              await handleStopModel(row);
            }
          });
        }
      } catch (error) {
        // ignore
      }
    },
    [handleEdit, handleOpenPlayGround, handleDelete, expandedRowKeys]
  );

  const handleChildSelect = useCallback(
    (val: any, row: ModelInstanceListItem) => {
      if (val === 'delete') {
        handleDeleteInstace(row);
      }
      if (val === 'viewlog') {
        handleViewLogs(row);
      }
    },
    [handleViewLogs, handleDeleteInstace]
  );

  const renderChildren = useCallback(
    (list: any, options: { parent?: any; [key: string]: any }) => {
      return (
        <Instances
          list={list}
          currentExpanded={options.currentExpanded}
          modelData={options.parent}
          workerList={workerList}
          handleChildSelect={handleChildSelect}
        ></Instances>
      );
    },
    [workerList]
  );

  const handleClickDropdown = (item: any) => {
    if (item.key === 'catalog') {
      navigate('/models/catalog');
      return;
    }

    const config = modalConfig[item.key];
    const hasLinuxWorker = workerList.some(
      (worker) => _.toLower(worker.labels?.os) === 'linux'
    );

    if (config) {
      setOpenDeployModal({
        ...config,
        hasLinuxWorker: hasLinuxWorker,
        gpuOptions: gpuDeviceList.current,
        modelFileOptions: modelFileOptions
      });
    }
  };

  const handleStartBatch = async () => {
    modalRef.current.show({
      content: 'models.table.models',
      title: 'common.title.start.confirm',
      okText: 'common.button.start',
      operation: 'common.start.confirm',
      async onOk() {
        await handleBatchRequest(rowSelection.selectedRows, handleStartModel);
        rowSelection.clearSelections();
      }
    });
  };

  const handleStopBatch = async () => {
    modalRef.current.show({
      content: 'models.table.models',
      title: 'common.title.stop.confirm',
      okText: 'common.button.stop',
      operation: 'common.stop.confirm',
      async onOk() {
        await handleBatchRequest(rowSelection.selectedRows, handleStopModel);
        rowSelection.clearSelections();
      }
    });
  };

  const handleActionSelect = (val: any) => {
    if (val === 'delete') {
      handleDeleteBatch();
    }
    if (val === 'start') {
      handleStartBatch();
    }
    if (val === 'stop') {
      handleStopBatch();
    }
  };

  const handleAutoLoadToggle = useCallback(
    async (checked: boolean, record: ListItem) => {
      try {
        const autoLoadValue = checked ? 1 : 0;

        // 准备更新数据
        const updateData: any = { auto_load: autoLoadValue };

        // 如果关闭 auto_load，同时关闭 auto_adjust_replicas
        if (!checked && record.auto_adjust_replicas !== undefined) {
          updateData.auto_adjust_replicas = 0;
        }

        await updateModel(getFormattedData(record, updateData));
        message.success(intl.formatMessage({ id: 'common.message.success' }));
        handleSearch();
      } catch (error: any) {
        if (
          error?.response?.data?.detail?.includes(
            'no such column: models.auto_load'
          )
        ) {
          message.warning(
            'Auto-load feature requires database migration. Please contact administrator.'
          );
        } else {
          message.error(intl.formatMessage({ id: 'common.message.failed' }));
        }
      }
    },
    [handleSearch]
  );

  const handleAutoUnloadToggle = useCallback(
    async (checked: boolean, record: ListItem) => {
      try {
        const autoUnloadValue = checked ? 1 : 0;
        await updateModel(
          getFormattedData(record, { auto_unload: autoUnloadValue })
        );
        message.success(intl.formatMessage({ id: 'common.message.success' }));
        handleSearch();
      } catch (error: any) {
        if (
          error?.response?.data?.detail?.includes(
            'no such column: models.auto_unload'
          )
        ) {
          message.warning(
            'Auto unload feature requires database migration. Please contact administrator.'
          );
        } else {
          message.error(intl.formatMessage({ id: 'common.message.failed' }));
        }
      }
    },
    [handleSearch]
  );

  const handleAutoAdjustToggle = useCallback(
    async (checked: boolean, record: ListItem) => {
      try {
        const autoAdjustValue = checked ? 1 : 0;
        await updateModel(
          getFormattedData(record, { auto_adjust_replicas: autoAdjustValue })
        );
        message.success(intl.formatMessage({ id: 'common.message.success' }));
        handleSearch();
      } catch (error: any) {
        if (
          error?.response?.data?.detail?.includes(
            'no such column: models.auto_adjust_replicas'
          )
        ) {
          message.warning(
            'Auto adjust replicas feature requires database migration. Please contact administrator.'
          );
        } else {
          message.error(intl.formatMessage({ id: 'common.message.failed' }));
        }
      }
    },
    [handleSearch]
  );

  const handleAutoLoadReplicasChange = useCallback(
    async (value: number, record: ListItem) => {
      // 确保值不小于1
      const validValue = Math.max(1, value);

      // 同步更新当前行的显示
      record.auto_load_replicas = validValue;

      try {
        await updateModel(
          getFormattedData(record, { auto_load_replicas: validValue })
        );
        message.success(intl.formatMessage({ id: 'common.message.success' }));
        handleSearch();
      } catch (error: any) {
        if (
          error?.response?.data?.detail?.includes(
            'no such column: models.auto_load_replicas'
          )
        ) {
          message.warning(
            'Auto load replicas feature requires database migration. Please contact administrator.'
          );
        } else {
          message.error(intl.formatMessage({ id: 'common.message.failed' }));
        }
      }
    },
    [handleSearch, intl]
  );

  const handleAutoUnloadTimeoutChange = useCallback(
    async (value: number, record: ListItem) => {
      // 确保值不小于5
      const validValue = Math.max(5, value);

      // 同步更新当前行的显示
      record.auto_unload_timeout = validValue;

      try {
        await updateModel(
          getFormattedData(record, { auto_unload_timeout: validValue })
        );
        message.success(intl.formatMessage({ id: 'common.message.success' }));
        handleSearch();
      } catch (error: any) {
        if (
          error?.response?.data?.detail?.includes(
            'no such column: models.auto_unload_timeout'
          )
        ) {
          message.warning(
            'Auto unload timeout feature requires database migration. Please contact administrator.'
          );
        } else {
          message.error(intl.formatMessage({ id: 'common.message.failed' }));
        }
      }
    },
    [handleSearch, intl]
  );

  // 计算正确的 unload 时间
  const calculateUnloadTime = useCallback(
    (record: ListItem): string | null => {
      if (!record.auto_unload || !record.auto_unload_timeout) {
        return null;
      }

      // 获取配置的超时时间（分钟）
      const timeoutMinutes = record.auto_unload_timeout;

      // 如果没有 last_request_time，直接返回配置的超时时间
      if (!record.last_request_time) {
        return `${timeoutMinutes}${intl.formatMessage({ id: 'common.text.minutes' })} 0${intl.formatMessage({ id: 'common.text.seconds' })}`;
      }

      try {
        // 1. 将数据库中存储的UTC时间正确解析
        const lastRequestTime = dayjs(record.last_request_time).utc();
        // 2. 获取当前UTC时间，确保时区一致
        const now = dayjs().utc();

        // 3. 计算到期时间（在lastRequestTime基础上加上timeoutMinutes分钟）
        const expiryTime = lastRequestTime.add(timeoutMinutes || 0, 'minute');

        // 4. 计算剩余时间（毫秒）
        const diffMs = Math.max(0, expiryTime.diff(now));

        // 5. 转换为分钟和秒
        const diffMinutes = Math.floor(diffMs / (60 * 1000));
        const diffSeconds = Math.floor((diffMs % (60 * 1000)) / 1000);

        if (diffMinutes === 0 && diffSeconds === 0) {
          return intl.formatMessage({ id: 'models.form.waiting_unloading' });
        }
        // 格式化显示，只显示分钟和秒
        return `${diffMinutes}${intl.formatMessage({ id: 'common.text.minutes' })} ${diffSeconds}${intl.formatMessage({ id: 'common.text.seconds' })}`;
      } catch (error) {
        console.error('Error calculating unload time:', error);
        // 出错时显示配置的时间
        return `${timeoutMinutes}${intl.formatMessage({ id: 'common.text.minutes' })} 0${intl.formatMessage({ id: 'common.text.seconds' })}`;
      }
    },
    [intl]
  );

  // 计算下次scaling的时间
  const calculateNextScaleTime = useCallback(
    (record: ListItem): string | React.ReactElement | null => {
      if (!record.auto_adjust_replicas) {
        return null;
      }

      try {
        // 如果没有 last_scale_time，说明还没有进行过scaling，返回等待状态
        if (!record.last_scale_time) {
          return (
            intl.formatMessage({ id: 'models.form.waiting_first_scaling' }) ||
            'Waiting for first auto scaling'
          );
        }

        // 1. 将数据库中存储的UTC时间正确解析
        const lastScaleTime = dayjs(record.last_scale_time).utc();
        // 2. 获取当前UTC时间，确保时区一致
        const now = dayjs().utc();

        // 3. 计算自上次scaling以来过了多少秒
        const elapsedSeconds = now.diff(lastScaleTime, 'second');

        // 4. ≥60.5秒，显示等待第一次自动调整。 # 0.5秒考虑时间误差
        if (elapsedSeconds >= 60.5) {
          return (
            intl.formatMessage({ id: 'models.form.waiting_first_scaling' }) ||
            'Waiting for first auto scaling'
          );
        }

        // 5. 0-1秒，显示"获取数据中"
        if (elapsedSeconds >= 0 && elapsedSeconds < 1) {
          return (
            intl.formatMessage({
              id: 'models.form.checking_replicas_change'
            }) || 'Checking replicas change...'
          );
        }

        // 6. 1-5秒，显示scaling详细信息
        if (elapsedSeconds >= 1 && elapsedSeconds <= 5) {
          if (record.last_scale_message) {
            try {
              // 解析last_scale_message，格式应该是："requestRate,processRate,previousReplicas,newReplicas"
              const parts = record.last_scale_message.split(',');
              if (parts.length >= 4) {
                const requestRate = parts[0];
                const processRate = parts[1];
                const previousReplicas = parts[2];
                const newReplicas = parts[3];

                const requestRateText =
                  intl.formatMessage({ id: 'models.table.avg_request_rate' }) ||
                  'Request Rate';
                const processRateText =
                  intl.formatMessage({ id: 'models.table.avg_process_rate' }) ||
                  'Process Rate';
                const replicasText =
                  intl.formatMessage({ id: 'models.form.replicas' }) ||
                  'Replicas';

                return (
                  <div
                    style={{
                      fontSize: '10px',
                      lineHeight: '1.2',
                      textAlign: 'center'
                    }}
                  >
                    <div>
                      {requestRateText}：{requestRate}/min
                    </div>
                    <div>
                      {processRateText}：{processRate}/min
                    </div>
                    <div>
                      {replicasText}：{previousReplicas} → {newReplicas}
                    </div>
                  </div>
                );
              }
            } catch (error) {
              console.error('Error parsing last_scale_message:', error);
            }
          }
          // 如果没有last_scale_message或解析失败，显示默认信息
          return (
            intl.formatMessage({
              id: 'models.form.replicas_change_no_change'
            }) || 'No replicas change'
          );
        }

        // 7. 5-60秒，显示倒计时
        const remainingSeconds = 60 - elapsedSeconds;
        return `${Math.max(0, remainingSeconds)}${intl.formatMessage({ id: 'common.text.seconds' }) || 's'}`;
      } catch (error) {
        console.error('Error calculating next scale time:', error);
        return (
          intl.formatMessage({ id: 'models.form.waiting_first_scaling' }) ||
          'Waiting for first auto scaling'
        );
      }
    },
    [intl]
  );

  useEffect(() => {
    // 每秒更新一次倒计时
    const timer = setInterval(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const columns: SealColumnProps[] = useMemo(() => {
    return [
      {
        title: intl.formatMessage({ id: 'common.table.name' }),
        dataIndex: 'name',
        key: 'name',
        width: 300,
        span: 4,
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
        width: 200,
        span: 2,
        render: (text: string, record: ListItem) => (
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
              { api: `${window.location.origin}/v1` }
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
        width: 120,
        span: 2,
        editable: {
          valueType: 'number',
          title: intl.formatMessage({ id: 'models.table.replicas.edit' })
        },
        render: (text: number, record: ListItem) => {
          return (
            <div className="flex-column flex-center" style={{ gap: '4px' }}>
              <span style={{ paddingLeft: 10, minWidth: '33px' }}>
                {record.ready_replicas} / {record.replicas}
              </span>
            </div>
          );
        }
      },
      {
        title: (
          <Tooltip
            title={
              intl.formatMessage({ id: 'models.form.auto_load.tips' }) ||
              'Whether to automatically load model when API requests arrive'
            }
          >
            <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {intl.formatMessage({ id: 'models.form.auto_load' }) ||
                'Auto Load'}
            </span>
            <QuestionCircleOutlined className="m-l-5" />
          </Tooltip>
        ),
        dataIndex: 'auto_load_replicas',
        key: 'auto_load',
        align: 'center',
        width: 120,
        span: 2,
        editable: {
          valueType: 'number',
          title:
            intl.formatMessage({ id: 'models.form.auto_load_replicas' }) ||
            'Auto Load Replicas'
        },
        render: (auto_load_replicas: number, record: ListItem) => {
          // 确保显示值不小于1
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
                disabled={record.auto_load === undefined}
                title={
                  record.auto_load === undefined
                    ? 'Auto-load feature requires database migration'
                    : ''
                }
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
      {
        title: (
          <Tooltip
            title={
              intl.formatMessage({
                id: 'models.table.request_process_rate.tips'
              }) ||
              'Calculate request rate and process rate based on request and processing data from the past 2 minutes (updated every 15 seconds)'
            }
          >
            <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {intl.formatMessage({
                id: 'models.table.request_process_rate'
              }) || 'Request/Process Rate'}
            </span>
            <QuestionCircleOutlined className="m-l-5" />
          </Tooltip>
        ),
        dataIndex: 'avg_request_rate',
        key: 'request_process_rate',
        align: 'center',
        width: 190,
        span: 2,
        render: (text: any, record: ListItem) => {
          return (
            <div
              style={{
                fontSize: '10px',
                lineHeight: '1.3',
                textAlign: 'center'
              }}
            >
              <div style={{ color: '#666', marginBottom: '2px' }}>
                <span style={{ fontWeight: '500' }}>
                  {intl.formatMessage({
                    id: 'models.table.avg_request_rate'
                  }) || 'Request Rate'}
                  :
                </span>{' '}
                {record.avg_request_rate !== undefined
                  ? `${record.avg_request_rate.toFixed(1)}/min`
                  : 'N/A'}
              </div>
              <div style={{ color: '#666' }}>
                <span style={{ fontWeight: '500' }}>
                  {intl.formatMessage({
                    id: 'models.table.avg_process_rate'
                  }) || 'Process Rate'}
                  :
                </span>{' '}
                {record.avg_process_rate !== undefined
                  ? `${record.avg_process_rate.toFixed(1)}/min`
                  : 'N/A'}
              </div>
            </div>
          );
        }
      },
      {
        title: (
          <Tooltip
            title={
              intl.formatMessage({
                id: 'models.form.auto_adjust_replicas.tips'
              }) || 'Automatically adjust replicas based on request rate'
            }
          >
            <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {intl.formatMessage({ id: 'models.form.auto_adjust_replicas' }) ||
                'Auto Adjust Replicas'}
            </span>
            <QuestionCircleOutlined className="m-l-5" />
          </Tooltip>
        ),
        dataIndex: 'auto_adjust_replicas',
        key: 'auto_adjust_replicas',
        align: 'center',
        width: 120,
        span: 2,
        render: (text: any, record: ListItem) => {
          // 获取下次scaling倒计时文本，使用 refreshTrigger 作为依赖项，确保每秒更新
          const nextScaleTimeText = record.auto_adjust_replicas
            ? calculateNextScaleTime(record)
            : null;

          return (
            <div className="flex-column flex-center" style={{ gap: '4px' }}>
              <Switch
                checked={!!record.auto_adjust_replicas}
                size="small"
                onChange={(checked) => handleAutoAdjustToggle(checked, record)}
                disabled={record.auto_adjust_replicas === undefined}
                title={
                  record.auto_adjust_replicas === undefined
                    ? 'Auto adjust replicas feature requires database migration'
                    : ''
                }
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
      {
        title: (
          <Tooltip
            title={
              intl.formatMessage({ id: 'models.form.auto_unload.tips' }) ||
              'Whether to automatically unload model when idle'
            }
          >
            <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {intl.formatMessage({ id: 'models.form.auto_unload' }) ||
                'Auto-unload'}
            </span>
            <QuestionCircleOutlined className="m-l-5" />
          </Tooltip>
        ),
        dataIndex: 'auto_unload_timeout',
        key: 'auto_unload',
        align: 'center',
        width: 140,
        span: 2,
        editable: {
          valueType: 'number',
          title:
            intl.formatMessage({ id: 'models.form.auto_unload_timeout' }) ||
            'Unload Timeout (min)'
        },
        render: (auto_unload_timeout: number, record: ListItem) => {
          // 确保显示值不小于1
          const displayValue =
            auto_unload_timeout !== undefined
              ? auto_unload_timeout < 5
                ? `5${intl.formatMessage({ id: 'common.text.minutes' }) || 'min'}`
                : `${auto_unload_timeout}${intl.formatMessage({ id: 'common.text.minutes' }) || 'min'}`
              : '-';

          // 当 auto_unload 开启且 ready_replicas >= 1 时显示倒计时
          const shouldShowUnloadTime =
            !!record.auto_unload && record.ready_replicas >= 1;

          // 如果需要显示倒计时且 last_request_time 为 null，异步更新它
          if (shouldShowUnloadTime && !record.last_request_time) {
            updateLastRequestTime(record);
          }

          // 获取倒计时显示文本，使用 refreshTrigger 作为依赖项，确保每秒更新
          const unloadTimeText = shouldShowUnloadTime
            ? calculateUnloadTime(record)
            : null;

          return (
            <div className="flex-column flex-center" style={{ gap: '4px' }}>
              <Switch
                checked={!!record.auto_unload}
                size="small"
                onChange={(checked) => handleAutoUnloadToggle(checked, record)}
                disabled={record.auto_unload === undefined}
                title={
                  record.auto_unload === undefined
                    ? 'Auto-unload feature requires database migration'
                    : ''
                }
              />
              <div
                className="flex-center"
                style={{ lineHeight: '1', fontSize: '12px' }}
              >
                <span>{displayValue}</span>
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
      {
        title: intl.formatMessage({ id: 'common.table.createTime' }),
        dataIndex: 'created_at',
        key: 'created_at',
        defaultSortOrder: 'descend',
        sortOrder,
        sorter: false,
        width: 180,
        span: 2,
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
        width: 120,
        span: 2,
        render: (text, record) => (
          <DropdownButtons
            items={setModelActionList(record)}
            onSelect={(val) => handleSelect(val, record)}
          />
        )
      }
    ];
  }, [
    sortOrder,
    intl,
    handleSelect,
    handleAutoLoadToggle,
    handleAutoAdjustToggle,
    handleAutoUnloadToggle,
    handleAutoLoadReplicasChange,
    handleAutoUnloadTimeoutChange,
    updateLastRequestTime,
    calculateUnloadTime,
    calculateNextScaleTime,
    refreshTrigger
  ]);

  const handleOnClick = async () => {
    if (isLoading) {
      return;
    }

    const data = catalogList?.[0] || {};
    try {
      setIsLoading(true);
      const modelData = await createModel({
        data: data
      });
      writeState(IS_FIRST_LOGIN, false);
      setIsFirstLogin(false);
      setTimeout(() => {
        updateExpandedRowKeys([modelData.id]);
      }, 300);
      message.success(intl.formatMessage({ id: 'common.message.success' }));
      handleSearch?.();
    } catch (error) {
      // ingore
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleExpandAll = useCallback(
    (expanded: boolean) => {
      const keys = dataSource.map((item) => item.id);
      handleExpandAll(expanded, keys);
      if (expanded) {
        handleOnToggleExpandAll();
      }
    },
    [dataSource]
  );

  const renderEmpty = useMemo(() => {
    if (dataSource.length || !isFirstLogin || !catalogList?.length) {
      return null;
    }
    return (
      <div
        className="flex-column justify-center flex-center"
        style={{ height: 300 }}
      >
        <Empty description=""></Empty>
        <Typography.Title level={4} style={{ marginBottom: 30 }}>
          {intl.formatMessage({ id: 'models.table.list.empty' })}
        </Typography.Title>
        <div>
          <Button type="primary" onClick={handleOnClick} loading={isLoading}>
            <span
              className="flex-center"
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage({ id: 'models.table.list.getStart' })
              }}
            ></span>
          </Button>
        </div>
      </div>
    );
  }, [dataSource.length, isFirstLogin, isLoading, intl]);

  return (
    <>
      <PageContainer
        className="models-page-container"
        ghost
        header={{
          title: intl.formatMessage({ id: 'models.title' }),
          style: {
            paddingInline: 'var(--layout-content-header-inlinepadding)'
          },
          breadcrumb: {}
        }}
        extra={[]}
      >
        <PageTools
          marginBottom={22}
          left={
            <Space>
              <Input
                placeholder={intl.formatMessage({ id: 'common.filter.name' })}
                style={{ width: 230 }}
                size="large"
                allowClear
                onChange={handleNameChange}
              ></Input>
              <Select
                allowClear
                showSearch={false}
                placeholder={intl.formatMessage({
                  id: 'models.filter.category'
                })}
                style={{ width: 180 }}
                size="large"
                maxTagCount={1}
                onChange={handleCategoryChange}
                options={modelCategories.filter((item) => item.value)}
              ></Select>
              <Button
                type="text"
                style={{ color: 'var(--ant-color-text-tertiary)' }}
                onClick={handleSearch}
                icon={<SyncOutlined></SyncOutlined>}
              ></Button>
            </Space>
          }
          right={
            <Space size={20}>
              <DropDownActions
                menu={{
                  items: sourceOptions,
                  onClick: handleClickDropdown
                }}
                trigger={['hover']}
                placement="bottomRight"
              >
                <Button
                  icon={<DownOutlined></DownOutlined>}
                  type="primary"
                  iconPosition="end"
                >
                  {intl?.formatMessage?.({ id: 'models.button.deploy' })}
                </Button>
              </DropDownActions>
              <DropdownButtons
                items={ButtonList}
                extra={
                  rowSelection.selectedRowKeys.length > 0 && (
                    <span>({rowSelection.selectedRowKeys.length})</span>
                  )
                }
                size="large"
                showText={true}
                disabled={!rowSelection.selectedRowKeys.length}
                onSelect={handleActionSelect}
              />
            </Space>
          }
        ></PageTools>

        <SealTable
          columns={columns}
          dataSource={dataSource}
          rowSelection={rowSelection}
          expandedRowKeys={expandedRowKeys}
          onExpand={handleExpandChange}
          onExpandAll={handleToggleExpandAll}
          loading={loading}
          loadend={loadend}
          rowKey="id"
          childParentKey="model_id"
          expandable={true}
          onSort={handleOnSort}
          onCell={handleOnCell}
          pollingChildren={false}
          watchChildren={true}
          loadChildren={getModelInstances}
          loadChildrenAPI={generateChildrenRequestAPI}
          renderChildren={renderChildren}
          pagination={{
            showSizeChanger: true,
            pageSize: queryParams.perPage,
            current: queryParams.page,
            total: total,
            hideOnSinglePage: queryParams.perPage === 10,
            onChange: handlePageChange
          }}
        ></SealTable>
      </PageContainer>
      <UpdateModel
        open={openAddModal}
        action={PageAction.EDIT}
        title={intl.formatMessage({ id: 'models.title.edit' })}
        updateFormInitials={updateFormInitials}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
      ></UpdateModel>
      <DeployModal
        open={openDeployModal.show}
        action={PageAction.CREATE}
        title={intl.formatMessage({ id: 'models.button.deploy' })}
        source={openDeployModal.source}
        width={openDeployModal.width}
        isGGUF={openDeployModal.isGGUF}
        hasLinuxWorker={openDeployModal.hasLinuxWorker}
        gpuOptions={openDeployModal.gpuOptions}
        modelFileOptions={openDeployModal.modelFileOptions || []}
        onCancel={handleDeployModalCancel}
        onOk={handleCreateModel}
      ></DeployModal>
      <ViewLogsModal
        url={currentInstance.url}
        tail={currentInstance.tail}
        id={currentInstance.id}
        modelId={currentInstance.modelId}
        open={openLogModal}
        onCancel={handleLogModalCancel}
      ></ViewLogsModal>
      <DeleteModal ref={modalRef}></DeleteModal>
      <APIAccessInfoModal
        open={apiAccessInfo.show}
        data={apiAccessInfo.data}
        onClose={() => {
          setAPIAccessInfo({
            ...apiAccessInfo,
            show: false
          });
        }}
      ></APIAccessInfoModal>
    </>
  );
};

export default Models;
