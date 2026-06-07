import type { FormData } from './types';

export const getDefaultLifecycleFormValues = (): Pick<
  FormData,
  | 'auto_load'
  | 'auto_load_replicas'
  | 'auto_adjust_replicas'
  | 'auto_unload'
  | 'auto_unload_timeout'
  | 'scale_window_minutes'
  | 'scale_down_kv_threshold'
> => ({
  auto_load: true,
  auto_load_replicas: 1,
  auto_adjust_replicas: false,
  auto_unload: true,
  auto_unload_timeout: 10,
  scale_window_minutes: 5,
  scale_down_kv_threshold: 0.6
});

export const normalizeLifecycleFormValues = (
  values: FormData
): Pick<
  FormData,
  | 'auto_load'
  | 'auto_load_replicas'
  | 'auto_adjust_replicas'
  | 'auto_unload'
  | 'auto_unload_timeout'
  | 'scale_window_minutes'
  | 'scale_down_kv_threshold'
> => ({
  auto_load: values.auto_load ?? true,
  auto_load_replicas: values.auto_load_replicas ?? 1,
  auto_adjust_replicas: values.auto_load
    ? (values.auto_adjust_replicas ?? false)
    : false,
  auto_unload: values.auto_unload ?? true,
  auto_unload_timeout: values.auto_unload_timeout ?? 10,
  scale_window_minutes: values.scale_window_minutes ?? 5,
  scale_down_kv_threshold: values.scale_down_kv_threshold ?? 0.6
});
