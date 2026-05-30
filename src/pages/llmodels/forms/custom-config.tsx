import CheckboxField from '@/components/seal-form/checkbox-field';
import SealInput from '@/components/seal-form/seal-input';
import { useIntl } from '@umijs/max';
import { Form } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useCallback } from 'react';
import { backendOptionsMap } from '../config/backend-parameters';
import { useFormContext } from '../config/form-context';
import { FormData } from '../config/types';

const CustomConfig = () => {
  const intl = useIntl();
  const form = Form.useFormInstance();
  const autoLoadEnabled = Form.useWatch('auto_load', form);
  const autoAdjustEnabled = Form.useWatch('auto_adjust_replicas', form);
  const autoUnloadEnabled = Form.useWatch('auto_unload', form);
  const backend = Form.useWatch('backend', form);
  const showGpuMemoryRange = backend === backendOptionsMap.vllm;
  const { onValuesChange } = useFormContext();

  const handleAutoLoadChange = useCallback(
    (e: CheckboxChangeEvent) => {
      const checked = e.target.checked;
      form.setFieldValue('auto_load', checked);

      if (!checked) {
        form.setFieldValue('auto_adjust_replicas', false);
      }

      onValuesChange?.({}, form.getFieldsValue());
    },
    [form, onValuesChange]
  );

  const handleAutoUnloadChange = useCallback(
    (e: CheckboxChangeEvent) => {
      const checked = e.target.checked;
      form.setFieldValue('auto_unload', checked);
      onValuesChange?.({}, form.getFieldsValue());
    },
    [form, onValuesChange]
  );

  return (
    <>
      <div
        data-field="auto_load"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 16
        }}
      >
        <Form.Item<FormData>
          name="auto_load"
          valuePropName="checked"
          style={{ marginBottom: 0, flex: '1 1 50%' }}
        >
          <CheckboxField
            onChange={handleAutoLoadChange}
            label={intl.formatMessage({
              id: 'models.form.autoLoad'
            })}
            description={intl.formatMessage({
              id: 'models.form.autoLoad.tips'
            })}
          ></CheckboxField>
        </Form.Item>
        {autoLoadEnabled ? (
          <Form.Item<FormData>
            name="auto_load_replicas"
            style={{ marginBottom: 0, flex: '1 1 50%' }}
          >
            <SealInput.Number
              style={{ width: '100%' }}
              min={1}
              label={intl.formatMessage({
                id: 'models.form.autoLoadReplicas'
              })}
              description={intl.formatMessage({
                id: 'models.form.autoLoadReplicas.tips'
              })}
            ></SealInput.Number>
          </Form.Item>
        ) : (
          <Form.Item<FormData> name="auto_load_replicas" hidden>
            <input type="hidden" />
          </Form.Item>
        )}
      </div>
      <Form.Item<FormData>
        name="auto_adjust_replicas"
        valuePropName="checked"
        style={{ marginBottom: 8 }}
      >
        <CheckboxField
          disabled={!autoLoadEnabled}
          label={intl.formatMessage({
            id: 'models.form.autoAdjustReplicas'
          })}
          description={intl.formatMessage({
            id: 'models.form.autoAdjustReplicas.tips'
          })}
        ></CheckboxField>
      </Form.Item>
      {autoLoadEnabled && autoAdjustEnabled ? (
        <>
          <Form.Item<FormData> name="scale_window_minutes">
            <SealInput.Number
              style={{ width: '100%' }}
              min={1}
              label={intl.formatMessage({
                id: 'models.form.scaleWindowMinutes'
              })}
              description={intl.formatMessage({
                id: 'models.form.scaleWindowMinutes.tips'
              })}
            ></SealInput.Number>
          </Form.Item>
          <Form.Item<FormData> name="scale_down_kv_threshold">
            <SealInput.Number
              style={{ width: '100%' }}
              min={0}
              max={1}
              step={0.05}
              label={intl.formatMessage({
                id: 'models.form.scaleDownKvThreshold'
              })}
              description={intl.formatMessage({
                id: 'models.form.scaleDownKvThreshold.tips'
              })}
            ></SealInput.Number>
          </Form.Item>
        </>
      ) : (
        <>
          <Form.Item<FormData> name="scale_window_minutes" hidden>
            <input type="hidden" />
          </Form.Item>
          <Form.Item<FormData> name="scale_down_kv_threshold" hidden>
            <input type="hidden" />
          </Form.Item>
        </>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 16
        }}
      >
        <Form.Item<FormData>
          name="auto_unload"
          valuePropName="checked"
          style={{ marginBottom: 0, flex: '1 1 50%' }}
        >
          <CheckboxField
            onChange={handleAutoUnloadChange}
            label={intl.formatMessage({
              id: 'models.form.autoUnload'
            })}
            description={intl.formatMessage({
              id: 'models.form.autoUnload.tips'
            })}
          ></CheckboxField>
        </Form.Item>
        {autoUnloadEnabled ? (
          <Form.Item<FormData>
            name="auto_unload_timeout"
            style={{ marginBottom: 0, flex: '1 1 50%' }}
          >
            <SealInput.Number
              style={{ width: '100%' }}
              min={1}
              label={intl.formatMessage({
                id: 'models.form.autoUnloadTimeout'
              })}
              description={intl.formatMessage({
                id: 'models.form.autoUnloadTimeout.tips'
              })}
            ></SealInput.Number>
          </Form.Item>
        ) : (
          <Form.Item<FormData> name="auto_unload_timeout" hidden>
            <input type="hidden" />
          </Form.Item>
        )}
      </div>
      <Form.Item<FormData>
        name="gpu_memory_min_gib"
        hidden={!showGpuMemoryRange}
      >
        <SealInput.Number
          style={{ width: '100%' }}
          min={0}
          step={1}
          precision={0}
          label={intl.formatMessage({
            id: 'models.form.gpuMemoryMinGib'
          })}
          description={intl.formatMessage({
            id: 'models.form.gpuMemoryMinGib.tips'
          })}
        ></SealInput.Number>
      </Form.Item>
      <Form.Item<FormData>
        name="gpu_memory_max_gib"
        hidden={!showGpuMemoryRange}
      >
        <SealInput.Number
          style={{ width: '100%' }}
          min={0}
          step={1}
          precision={0}
          label={intl.formatMessage({
            id: 'models.form.gpuMemoryMaxGib'
          })}
          description={intl.formatMessage({
            id: 'models.form.gpuMemoryMaxGib.tips'
          })}
        ></SealInput.Number>
      </Form.Item>
    </>
  );
};

export default CustomConfig;
