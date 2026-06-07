import type { ListItem as WorkerListItem } from '../../resources/config/types';
import type { ModelInstanceListItem } from './types';

export const formatSubordinateWorkers = (
  instance: ModelInstanceListItem,
  workerList: Pick<WorkerListItem, 'id' | 'name' | 'ip'>[]
): string => {
  const subordinateWorkers =
    instance.distributed_servers?.subordinate_workers || [];

  if (!subordinateWorkers.length) {
    return '--';
  }

  return subordinateWorkers
    .map((item) => {
      const worker = workerList.find(
        (workerItem) => String(workerItem.id) === String(item.worker_id)
      );
      return worker?.name || `Worker ${item.worker_id}`;
    })
    .join(', ');
};
