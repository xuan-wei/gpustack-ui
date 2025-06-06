import IconFont from '@/components/icon-font';
import LabelSelector from '@/components/label-selector';
import ListInput from '@/components/list-input';
import SealCascader from '@/components/seal-form/seal-cascader';
import SealInput from '@/components/seal-form/seal-input';
import SealSelect from '@/components/seal-form/seal-select';
import TooltipList from '@/components/tooltip-list';
import { PageActionType } from '@/config/types';
import useAppUtils from '@/hooks/use-app-utils';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import {
  Checkbox,
  Collapse,
  Form,
  FormInstance,
  Input,
  Tooltip,
  Typography
} from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import {
  backendLabelMap,
  backendOptionsMap,
  backendParamsHolderTips,
  modelCategories,
  placementStrategyOptions
} from '../config';
import { useFormContext } from '../config/form-context';
import llamaConfig from '../config/llama-config';
import mindieConfig from '../config/mindie-config';
import { FormData } from '../config/types';
import vllmConfig from '../config/vllm-config';
import dataformStyles from '../style/data-form.less';
import GPUCard from './gpu-card';

interface AdvanceConfigProps {
  isGGUF: boolean;
  form: FormInstance;
  gpuOptions: Array<any>;
  action: PageActionType;
  source: string;
}

const CheckboxField: React.FC<{
  title: string;
  label: string;
  checked?: boolean;
  onChange?: (e: CheckboxChangeEvent) => void;
  disabled?: boolean;
}> = ({ title, label, checked, onChange, disabled }) => {
  return (
    <Checkbox
      className="p-l-6"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    >
      <Tooltip title={title}>
        <span style={{ color: 'var(--ant-color-text-tertiary)' }}>{label}</span>
        <QuestionCircleOutlined
          className="m-l-4"
          style={{ color: 'var(--ant-color-text-tertiary)' }}
        />
      </Tooltip>
    </Checkbox>
  );
};

const AdvanceConfig: React.FC<AdvanceConfigProps> = (props) => {
  const { form, isGGUF, gpuOptions, source } = props;
  const { getRuleMessage } = useAppUtils();
  const intl = useIntl();
  const wokerSelector = Form.useWatch('worker_selector', form);
  const EnviromentVars = Form.useWatch('env', form);
  const scheduleType = Form.useWatch('scheduleType', form);
  const backend = Form.useWatch('backend', form);
  const backend_parameters = Form.useWatch('backend_parameters', form);
  const categories = Form.useWatch('categories', form);
  const backend_version = Form.useWatch('backend_version', form);
  const placement_strategy = Form.useWatch('placement_strategy', form);
  const gpuSelectorIds = Form.useWatch(['gpu_selector', 'gpu_ids'], form);
  const worker_selector = Form.useWatch('worker_selector', form);
  const auto_load = Form.useWatch('auto_load', form);
  const auto_adjust_replicas = Form.useWatch('auto_adjust_replicas', form);
  const auto_unload = Form.useWatch('auto_unload', form);
  const { onValuesChange } = useFormContext();

  const placementStrategyTips = [
    {
      title: 'Spread',
      tips: intl.formatMessage({
        id: 'resources.form.spread.tips'
      })
    },
    {
      title: 'Binpack',
      tips: intl.formatMessage({
        id: 'resources.form.binpack.tips'
      })
    }
  ];

  const scheduleTypeTips = [
    {
      title: intl.formatMessage({
        id: 'models.form.scheduletype.auto'
      }),
      tips: intl.formatMessage({
        id: 'models.form.scheduletype.auto.tips'
      })
    },
    {
      title: intl.formatMessage({
        id: 'models.form.scheduletype.manual'
      }),
      tips: intl.formatMessage({
        id: 'models.form.scheduletype.manual.tips'
      })
    }
  ];

  const paramsConfig = useMemo(() => {
    if (backend === backendOptionsMap.llamaBox) {
      return llamaConfig;
    }
    if (backend === backendOptionsMap.vllm) {
      return vllmConfig;
    }
    if (backend === backendOptionsMap.ascendMindie) {
      return mindieConfig;
    }
    return [];
  }, [backend]);

  const backendParamsTips = useMemo(() => {
    if (backend === backendOptionsMap.llamaBox) {
      return {
        backend: 'llama-box',
        releases: 'https://github.com/gpustack/llama-box/releases',
        link: 'https://github.com/gpustack/llama-box?tab=readme-ov-file#usage'
      };
    }
    if (backend === backendOptionsMap.vllm) {
      return {
        backend: 'vLLM',
        releases: 'https://github.com/vllm-project/vllm/releases',
        link: 'https://docs.vllm.ai/en/stable/serving/openai_compatible_server.html#cli-reference'
      };
    }
    if (backend === backendOptionsMap.ascendMindie) {
      return {
        backend: 'Ascend MindIE',
        releases: '',
        link: 'http://docs.gpustack.ai/latest/user-guide/inference-backends/#parameters-reference_2'
      };
    }

    return null;
  }, [backend]);

  const handleWorkerLabelsChange = useCallback(
    (labels: Record<string, any>) => {
      form.setFieldValue('worker_selector', labels);
    },
    []
  );
  const handleEnviromentVarsChange = useCallback(
    (labels: Record<string, any>) => {
      form.setFieldValue('env', labels);
    },
    []
  );

  const handleAutoLoadChange = useCallback(
    (e: CheckboxChangeEvent) => {
      const checked = e.target.checked;
      form.setFieldValue('auto_load', checked);

      // 如果关闭 auto_load，同时关闭 auto_adjust_replicas
      if (!checked) {
        form.setFieldValue('auto_adjust_replicas', false);
      }

      onValuesChange?.({}, form.getFieldsValue());
    },
    [form, onValuesChange]
  );

  const handleAutoAdjustReplicasChange = useCallback(
    (e: CheckboxChangeEvent) => {
      const checked = e.target.checked;
      form.setFieldValue('auto_adjust_replicas', checked);
      onValuesChange?.({}, form.getFieldsValue());
    },
    [form, onValuesChange]
  );

  const handleBackendParametersChange = useCallback((list: string[]) => {
    form.setFieldValue('backend_parameters', list);
  }, []);

  const handleBackendParametersOnBlur = () => {
    const backendParams = form.getFieldValue('backend_parameters');
    onValuesChange?.({}, form.getFieldsValue());
  };

  const handleDeleteBackendParameters = (index: number) => {
    onValuesChange?.({}, form.getFieldsValue());
  };

  const handleSelectorOnBlur = () => {
    const workerSelector = form.getFieldValue('worker_selector');
    // check if all keys have values
    const hasEmptyValue = _.some(_.keys(workerSelector), (k: string) => {
      return !workerSelector[k];
    });
    if (!hasEmptyValue) {
      onValuesChange?.({}, form.getFieldsValue());
    }
  };

  const handleDeleteWorkerSelector = (index: number) => {
    onValuesChange?.({}, form.getFieldsValue());
  };

  const handleBackendVersionOnBlur = () => {
    const backendVersion = form.getFieldValue('backend_version');
    onValuesChange?.({}, form.getFieldsValue());
  };

  const handleScheduleTypeChange = (value: string) => {
    if (value === 'auto') {
      onValuesChange?.({}, form.getFieldsValue());
    }
  };

  const handleBeforeGpuSelectorChange = (gpuIds: any[]) => {
    if (backend !== backendOptionsMap.ascendMindie || !gpuIds?.length) {
      return;
    }
    const lastGroupName = gpuIds[gpuIds.length - 1][0];

    const lastGroupItems = gpuIds.filter((item) => item[0] === lastGroupName);

    form.setFieldValue(['gpu_selector', 'gpu_ids'], lastGroupItems);
  };

  const handleGpuSelectorChange = (value: any[]) => {
    handleBeforeGpuSelectorChange(value);
    onValuesChange?.({}, form.getFieldsValue());
  };

  const collapseItems = useMemo(() => {
    const children = (
      <>
        <Form.Item<FormData> name="categories">
          <SealSelect
            allowNull
            label={intl.formatMessage({
              id: 'models.form.categories'
            })}
            options={modelCategories}
          ></SealSelect>
        </Form.Item>
        <Form.Item name="scheduleType">
          <SealSelect
            onChange={handleScheduleTypeChange}
            label={intl.formatMessage({ id: 'models.form.scheduletype' })}
            description={<TooltipList list={scheduleTypeTips}></TooltipList>}
            options={[
              {
                label: intl.formatMessage({
                  id: 'models.form.scheduletype.auto'
                }),
                value: 'auto'
              },
              {
                label: intl.formatMessage({
                  id: 'models.form.scheduletype.manual'
                }),
                value: 'manual'
              }
            ]}
          ></SealSelect>
        </Form.Item>
        {scheduleType === 'auto' && (
          <>
            <Form.Item<FormData> name="placement_strategy">
              <SealSelect
                label={intl.formatMessage({
                  id: 'resources.form.placementStrategy'
                })}
                options={placementStrategyOptions}
                description={
                  <TooltipList list={placementStrategyTips}></TooltipList>
                }
              ></SealSelect>
            </Form.Item>
            <Form.Item<FormData>
              name="worker_selector"
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (
                      getFieldValue('scheduleType') === 'auto' &&
                      _.keys(value).length > 0
                    ) {
                      if (_.some(_.keys(value), (k: string) => !value[k])) {
                        return Promise.reject(
                          intl.formatMessage(
                            {
                              id: 'common.validate.value'
                            },
                            {
                              name: intl.formatMessage({
                                id: 'models.form.selector'
                              })
                            }
                          )
                        );
                      }
                    }
                    return Promise.resolve();
                  }
                })
              ]}
            >
              <LabelSelector
                label={intl.formatMessage({
                  id: 'resources.form.workerSelector'
                })}
                labels={wokerSelector}
                onChange={handleWorkerLabelsChange}
                onBlur={handleSelectorOnBlur}
                onDelete={handleDeleteWorkerSelector}
                description={
                  <span>
                    {intl.formatMessage({
                      id: 'resources.form.workerSelector.description'
                    })}
                  </span>
                }
              ></LabelSelector>
            </Form.Item>
          </>
        )}
        {scheduleType === 'manual' && (
          <>
            <Form.Item
              name={['gpu_selector', 'gpu_ids']}
              rules={[
                {
                  required: true,
                  message: getRuleMessage('select', 'models.form.gpuselector')
                }
              ]}
            >
              <SealCascader
                required
                showSearch
                expandTrigger="hover"
                multiple={backend !== backendOptionsMap.voxBox}
                popupClassName="cascader-popup-wrapper gpu-selector"
                maxTagCount={1}
                label={intl.formatMessage({ id: 'models.form.gpuselector' })}
                options={gpuOptions}
                showCheckedStrategy="SHOW_CHILD"
                value={form.getFieldValue(['gpu_selector', 'gpu_ids'])}
                optionNode={GPUCard}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                onChange={handleGpuSelectorChange}
              ></SealCascader>
            </Form.Item>
          </>
        )}

        <Form.Item name="backend_version">
          <SealInput.Input
            onBlur={handleBackendVersionOnBlur}
            label={intl.formatMessage({ id: 'models.form.backendVersion' })}
            description={intl.formatMessage(
              {
                id: 'models.form.backendVersion.tips'
              },
              {
                backend: backendLabelMap[backend],
                link: backendParamsTips?.releases && (
                  <span
                    style={{
                      marginLeft: 5
                    }}
                  >
                    <Typography.Link
                      className="flex-center"
                      style={{ display: 'inline' }}
                      href={backendParamsTips?.releases}
                      target="_blank"
                    >
                      <span>
                        {intl.formatMessage({ id: 'models.form.releases' })}
                      </span>
                      <IconFont
                        type="icon-external-link"
                        className="font-size-14 m-l-4"
                      ></IconFont>
                    </Typography.Link>
                  </span>
                )
              }
            )}
          ></SealInput.Input>
        </Form.Item>

        <Form.Item<FormData> name="backend_parameters">
          <ListInput
            placeholder={
              backendParamsHolderTips[backend]
                ? intl.formatMessage({
                    id: backendParamsHolderTips[backend].holder
                  })
                : ''
            }
            btnText="common.button.addParams"
            label={intl.formatMessage({
              id: 'models.form.backend_parameters'
            })}
            dataList={form.getFieldValue('backend_parameters') || []}
            onChange={handleBackendParametersChange}
            onBlur={handleBackendParametersOnBlur}
            onDelete={handleDeleteBackendParameters}
            options={paramsConfig}
            description={
              backendParamsTips && (
                <span style={{ marginLeft: 5 }}>
                  {intl.formatMessage(
                    { id: 'models.form.backend_parameters.vllm.tips' },
                    { backend: backendParamsTips.backend || '' }
                  )}{' '}
                  <Typography.Link
                    style={{ display: 'inline' }}
                    className="flex-center"
                    href={backendParamsTips.link}
                    target="_blank"
                  >
                    <span>
                      {intl.formatMessage({ id: 'common.text.here' })}
                    </span>
                    <IconFont
                      type="icon-external-link"
                      className="font-size-14 m-l-4"
                    ></IconFont>
                  </Typography.Link>
                </span>
              )
            }
          ></ListInput>
        </Form.Item>
        <Form.Item<FormData>
          name="env"
          rules={[
            () => ({
              validator(rule, value) {
                if (_.keys(value).length > 0) {
                  if (_.some(_.keys(value), (k: string) => !value[k])) {
                    return Promise.reject(
                      intl.formatMessage(
                        {
                          id: 'common.validate.value'
                        },
                        {
                          name: intl.formatMessage({
                            id: 'common.text.variable'
                          })
                        }
                      )
                    );
                  }
                }
                return Promise.resolve();
              }
            })
          ]}
        >
          <LabelSelector
            label={intl.formatMessage({
              id: 'models.form.env'
            })}
            labels={EnviromentVars}
            btnText="common.button.vars"
            onChange={handleEnviromentVarsChange}
          ></LabelSelector>
        </Form.Item>

        <div
          style={{ display: 'flex', alignItems: 'center', paddingBottom: 22 }}
        >
          <div style={{ paddingLeft: 10 }}>
            <Form.Item<FormData>
              name="auto_load"
              valuePropName="checked"
              style={{ padding: '0 10px', marginBottom: 0 }}
              noStyle
            >
              <CheckboxField
                title={intl.formatMessage({
                  id: 'models.form.auto_load.tips'
                })}
                label={intl.formatMessage({
                  id: 'models.form.auto_load'
                })}
                onChange={handleAutoLoadChange}
              ></CheckboxField>
            </Form.Item>
          </div>

          {auto_load && (
            <div
              style={{ marginLeft: 20, display: 'flex', alignItems: 'center' }}
            >
              <span
                style={{
                  marginRight: 8,
                  color: 'var(--ant-color-text-tertiary)',
                  fontSize: '14px'
                }}
              >
                {intl.formatMessage({ id: 'models.form.auto_load_replicas' }) ||
                  'Auto Load Replicas'}
                :
              </span>
              <Form.Item<FormData> name="auto_load_replicas" noStyle>
                <Input
                  style={{ width: 80 }}
                  placeholder="1"
                  type="number"
                  min={1}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value < 1) {
                      form.setFieldValue('auto_load_replicas', 1);
                    }
                  }}
                />
              </Form.Item>
              <Tooltip
                title={intl.formatMessage({
                  id: 'models.form.auto_load_replicas.tips'
                })}
              >
                <QuestionCircleOutlined
                  className="m-l-4"
                  style={{ color: 'var(--ant-color-text-tertiary)' }}
                />
              </Tooltip>
            </div>
          )}
        </div>

        <div style={{ paddingBottom: 22, paddingLeft: 10 }}>
          <Form.Item<FormData>
            name="auto_adjust_replicas"
            valuePropName="checked"
            style={{ padding: '0 10px', marginBottom: 0 }}
            noStyle
          >
            <CheckboxField
              title={intl.formatMessage({
                id: 'models.form.auto_adjust_replicas.tips'
              })}
              label={intl.formatMessage({
                id: 'models.form.auto_adjust_replicas'
              })}
              onChange={handleAutoAdjustReplicasChange}
              disabled={!auto_load}
            ></CheckboxField>
          </Form.Item>
        </div>

        <div
          style={{ display: 'flex', alignItems: 'center', paddingBottom: 22 }}
        >
          <div style={{ paddingLeft: 10 }}>
            <Form.Item<FormData>
              name="auto_unload"
              valuePropName="checked"
              style={{ padding: '0 10px', marginBottom: 0 }}
              noStyle
            >
              <CheckboxField
                title={intl.formatMessage({
                  id: 'models.form.auto_unload.tips'
                })}
                label={intl.formatMessage({
                  id: 'models.form.auto_unload'
                })}
              ></CheckboxField>
            </Form.Item>
          </div>

          {auto_unload && (
            <div
              style={{ marginLeft: 20, display: 'flex', alignItems: 'center' }}
            >
              <span
                style={{
                  marginRight: 8,
                  color: 'var(--ant-color-text-tertiary)',
                  fontSize: '14px'
                }}
              >
                {intl.formatMessage({
                  id: 'models.form.auto_unload_timeout'
                }) || 'Timeout'}
                :
              </span>
              <Form.Item<FormData> name="auto_unload_timeout" noStyle>
                <Input
                  style={{ width: 80 }}
                  placeholder="10"
                  suffix={
                    intl.formatMessage({ id: 'common.text.minutes' }) || 'mins'
                  }
                  type="number"
                  min={5}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value < 5) {
                      form.setFieldValue('auto_unload_timeout', 5);
                    }
                  }}
                />
              </Form.Item>
              <Tooltip
                title={intl.formatMessage({
                  id: 'models.form.auto_unload_timeout.tips'
                })}
              >
                <QuestionCircleOutlined
                  className="m-l-4"
                  style={{ color: 'var(--ant-color-text-tertiary)' }}
                />
              </Tooltip>
            </div>
          )}
        </div>

        {backend === backendOptionsMap.llamaBox && (
          <div style={{ paddingBottom: 22, paddingLeft: 10 }}>
            <Form.Item<FormData>
              name="cpu_offloading"
              valuePropName="checked"
              style={{ padding: '0 10px', marginBottom: 0 }}
              noStyle
            >
              <CheckboxField
                title={intl.formatMessage({
                  id: 'models.form.partialoffload.tips'
                })}
                label={intl.formatMessage({
                  id: 'resources.form.enablePartialOffload'
                })}
              ></CheckboxField>
            </Form.Item>
          </div>
        )}
        {[backendOptionsMap.llamaBox, backendOptionsMap.vllm].includes(
          backend
        ) && (
          <div style={{ paddingBottom: 22, paddingLeft: 10 }}>
            <Form.Item<FormData>
              name="distributed_inference_across_workers"
              valuePropName="checked"
              style={{ padding: '0 10px', marginBottom: 0 }}
              noStyle
            >
              <CheckboxField
                title={intl.formatMessage({
                  id: 'models.form.distribution.tips'
                })}
                label={intl.formatMessage({
                  id: 'resources.form.enableDistributedInferenceAcrossWorkers'
                })}
              ></CheckboxField>
            </Form.Item>
          </div>
        )}
        <div style={{ paddingBottom: 22, paddingLeft: 10 }}>
          <Form.Item<FormData>
            name="restart_on_error"
            valuePropName="checked"
            style={{ padding: '0 10px', marginBottom: 0 }}
            noStyle
          >
            <CheckboxField
              title={intl.formatMessage({
                id: 'models.form.restart.onerror.tips'
              })}
              label={intl.formatMessage({
                id: 'models.form.restart.onerror'
              })}
            ></CheckboxField>
          </Form.Item>
        </div>
      </>
    );
    return [
      {
        key: '1',
        label: (
          <span
            style={{ fontWeight: 'var(--font-weight-medium)' }}
            className="font-size-14"
          >
            {intl.formatMessage({ id: 'resources.form.advanced' })}
          </span>
        ),
        forceRender: true,
        children
      }
    ];
  }, [
    form,
    source,
    intl,
    gpuOptions,
    paramsConfig,
    scheduleType,
    wokerSelector,
    backend,
    backend_parameters,
    isGGUF,
    categories,
    backend_version,
    placement_strategy,
    gpuSelectorIds,
    EnviromentVars,
    worker_selector,
    auto_load,
    auto_adjust_replicas,
    auto_unload
  ]);

  return (
    <Collapse
      expandIconPosition="start"
      bordered={false}
      ghost
      destroyInactivePanel={false}
      className={dataformStyles['advanced-collapse']}
      expandIcon={({ isActive }) => (
        <IconFont
          type="icon-down"
          rotate={isActive ? 0 : -90}
          style={{ fontSize: '14px' }}
        ></IconFont>
      )}
      items={collapseItems}
    ></Collapse>
  );
};

export default React.memo(AdvanceConfig);
