export default {
  'models.button.deploy': 'Развернуть модель',
  'models.title': 'Модели',
  'models.title.edit': 'Редактировать модель',
  'models.table.models': 'модели',
  'models.table.name': 'Название модели',
  'models.form.source': 'Источник',
  'models.form.repoid': 'ID репозитория',
  'models.form.repoid.desc': 'Поддерживается только формат .gguf',
  'models.form.filename': 'Имя файла',
  'models.form.replicas': 'Реплики',
  'models.form.selector': 'Селектор',
  'models.form.env': 'Переменные окружения',
  'models.form.configurations': 'Конфигурации',
  'models.form.s3address': 'S3-адрес',
  'models.form.partialoffload.tips': `При включенном оффлоудинге на CPU: если ресурсов GPU недостаточно, часть слоёв модели будет перенесена на CPU. Если GPU отсутствует, будет использоваться полный вывод на CPU.`, // Already translated
  'models.form.distribution.tips': `Позволяет переносить часть слоёв модели на один или несколько удалённых воркеров, когда ресурсов текущего воркера недостаточно.`,
  'models.openinplayground': 'Открыть в Песочнице',
  'models.instances': 'инстансы',
  'models.table.replicas.edit': 'Редактировать реплики',
  'model.form.ollama.model': 'Модель Ollama',
  'model.form.ollamaholder': 'Выберите или введите название модели',
  'model.deploy.sort': 'Сортировка',
  'model.deploy.search.placeholder': 'Введите <kbd>/</kbd> для поиска моделей',
  'model.form.ollamatips':
    'Подсказка: ниже представлены предустановленные модели Ollama в GPUStack. Выберите нужную или введите модель для развертывания в поле 【{name}】 справа.',
  'models.sort.name': 'По имени',
  'models.sort.size': 'По размеру',
  'models.sort.likes': 'По лайкам',
  'models.sort.trending': 'Популярные',
  'models.sort.downloads': 'По загрузкам',
  'models.sort.updated': 'По обновлению',
  'models.search.result': '{count} результатов',
  'models.data.card': 'Карточка модели',
  'models.available.files': 'Доступные файлы',
  'models.viewin.hf': 'Посмотреть в Hugging Face',
  'models.viewin.modelscope': 'Посмотреть в ModelScope',
  'models.architecture': 'Архитектура',
  'models.search.noresult': 'Связанные модели не найдены',
  'models.search.nofiles': 'Нет доступных файлов',
  'models.search.networkerror': 'Ошибка сетевого подключения!',
  'models.search.hfvisit': 'Убедитесь, что доступен',
  'models.search.unsupport':
    'Модель не поддерживается и может быть нефункциональна после развертывания.',
  'models.form.scheduletype': 'Тип планирования',
  'models.form.categories': 'Категория модели',
  'models.form.scheduletype.auto': 'Авто',
  'models.form.scheduletype.manual': 'Вручную',
  'models.form.scheduletype.auto.tips':
    'Автоматическое развертывание инстансов модели на подходящие GPU/воркеры в зависимости от текущих ресурсов.',
  'models.form.scheduletype.manual.tips':
    'Позволяет вручную указать GPU/воркеры для развертывания инстансов модели.',
  'models.form.manual.schedule': 'Ручное распределение',
  'models.table.gpuindex': 'Индекс GPU',
  'models.table.backend': 'Бэкенды',
  'models.table.acrossworker': 'Распределение по воркерам',
  'models.table.cpuoffload': 'CPU оффлоуд',
  'models.table.layers': 'Слои',
  'models.form.backend': 'Бэкенд',
  'models.form.backend_parameters': 'Параметры бэкенда',
  'models.search.gguf.tips':
    'GGUF-модели используют llama-box (поддерживает Linux, macOS и Windows).',
  'models.search.vllm.tips':
    'Не-GGUF модели используют vox-box для аудио и vLLM (только x86 Linux) для остальных.',
  'models.search.voxbox.tips':
    'Для развертывания аудиомодели снимите отметку GGUF.',
  'models.form.ollamalink':
    'Больше моделей в библиотеке <a href="https://www.ollama.com/library" target="_blank">Ollama</a>',
  'models.form.backend_parameters.llamabox.placeholder':
    'например: --ctx-size=8192',
  'models.form.backend_parameters.vllm.placeholder':
    'например: --max-model-len=8192',
  'models.form.backend_parameters.vllm.tips':
    'Подробнее о параметрах {backend}',
  'models.logs.pagination.prev': 'Предыдущие {lines} строк',
  'models.logs.pagination.next': 'Следующие {lines} строк',
  'models.logs.pagination.last': 'Последняя страница',
  'models.logs.pagination.first': 'Первая страница',
  'models.form.localPath': 'Локальный путь',
  'models.form.filePath': 'Путь к модели',
  'models.form.backendVersion': 'Версия бэкенда',
  'models.form.backendVersion.tips':
    'Чтобы использовать желаемую версию {backend}, система автоматически создаст виртуальную среду в онлайн-окружении для установки соответствующей версии. После обновления GPUStack версия бэкенда останется зафиксированной. {link}',
  'models.form.gpuselector': 'Селектор GPU',
  'models.form.backend.llamabox':
    'Для моделей формата GGUF. Поддержка Linux, macOS и Windows.',
  'models.form.backend.vllm':
    'Для моделей не-GGUF формата, поддерживается только в Linux (amd64/x86_64).',
  'models.form.backend.voxbox':
    'Для аудиомоделей не-GGUF формата, поддерживается только на GPU NVIDIA и CPU.',
  'models.form.backend.mindie':
    'Для моделей не-GGUF формата, поддерживается только на Ascend 910B и 310P.',
  'models.form.search.gguftips':
    'Для воркеров на macOS/Windows отметьте GGUF (для аудиомоделей снимите).',
  'models.form.button.addlabel': 'Добавить метку',
  'models.filter.category': 'Фильтр по категориям',
  'models.list.more.logs': 'Показать больше',
  'models.catalog.release.date': 'Дата выпуска',
  'models.localpath.gguf.tips.title': 'Модель формата GGUF',
  'models.localpat.safe.tips.title': 'Модель формата Safetensors',
  'models.localpath.shared.tips.title': 'Шардированная GGUF-модель',
  'models.localpath.gguf.tips':
    'Укажите файл модели, например: /data/models/model.gguf.',
  'models.localpath.safe.tips':
    'Укажите директорию модели с файлами .safetensors и config.json.',
  'models.localpath.chunks.tips':
    'Укажите первый шард модели, например: /data/models/model-00001-of-00004.gguf.',
  'models.form.replicas.tips':
    'Несколько реплик обеспечивают балансировку нагрузки для { api } запросов.',
  'models.table.list.empty': 'Модели отсутствуют!',
  'models.table.list.getStart':
    '<span style="margin-right: 5px;font-size: 13px;">Начните работу с</span> <span style="font-size: 14px;font-weight: 700">DeepSeek-R1-Distill-Qwen-1.5B</span>',
  'models.table.llamaAcrossworker': 'Llama-box между воркерами',
  'models.table.vllmAcrossworker': 'vLLM между воркерами',
  'models.form.releases': 'Релизы',
  'models.form.moreparameters': 'Описание параметров',
  'models.table.vram.allocated': 'Выделенная VRAM',
  'models.form.backend.warning':
    'Бэкенд для моделей формата GGUF использует llama-box.',
  'models.form.ollama.warning':
    'Чтобы развернуть бэкенд для моделей Ollama с использованием llama-box , выполните следующие шаги.',
  'models.form.backend.warning.llamabox':
    'Чтобы использовать бэкенд llama-box , укажите полный путь к файлу модели (например,<span style="font-weight: 700">/data/models/model.gguf</span>). Для шардированных моделей укажите путь к первому шарду (например,<span style="font-weight: 700">/data/models/model-00001-of-00004.gguf</span>).',
  'models.form.keyvalue.paste':
    'Вставьте несколько строк текста, где каждая строка содержит пару ключ-значение. Ключ и значение разделяются знаком равенства (=), а разные пары — символами новой строки.',
  'models.form.files': 'Файлы',
  'models.table.status': 'Статус',
  'models.form.submit.anyway': 'Отправить в любом случае',
  'models.form.evaluating': 'Анализ совместимости модели',
  'models.form.incompatible': 'Обнаружена несовместимость',
  'models.form.restart.onerror': 'Автоперезапуск при ошибке',
  'models.form.restart.onerror.tips':
    'При возникновении ошибки система автоматически попытается перезапуститься.',
  'models.form.check.params': 'Проверка конфигурации...',
  'models.form.check.passed': 'Проверка совместимости пройдена',
  'models.form.check.claims':
    'Модель требует примерно {vram} VRAM и {ram} RAM.',
  'models.form.check.claims2': 'Модель требует примерно {vram} VRAM.',
  'models.form.check.claims3': 'Модель требует примерно {ram} RAM.',
  'models.form.update.tips':
    'Изменения вступят в силу только после удаления и повторного создания инстанса.',
  'models.table.download.progress': 'Прогресс загрузки',
  'models.table.button.apiAccessInfo': 'Доступ к API',
  'models.table.button.apiAccessInfo.tips': `Для интеграции этой модели со сторонними приложениями используйте следующие данные: URL доступа, имя модели и ключ API. Эти учетные данные необходимы для обеспечения правильного подключения и использования сервиса модели.`, // Translated
  'models.table.apiAccessInfo.endpoint': 'URL доступа',
  'models.table.apiAccessInfo.modelName': 'Имя модели',
  'models.table.apiAccessInfo.apikey': 'Ключ API',
  'models.table.apiAccessInfo.openaiCompatible': 'Совместимо с OpenAI',
  'models.table.apiAccessInfo.jinaCompatible': 'Совместимо с Jina',
  'models.table.apiAccessInfo.gotoCreate': 'Перейти к созданию',
  'models.search.parts': '{n} частей',
  'models.search.evaluate.error': 'Произошла ошибка во время оценки: ',
  'models.table.avg_request_rate': 'частота запросов',
  'models.table.avg_process_rate': 'скорость обработки',
  'models.table.request_process_rate': 'частота запросов/скорость обработки',
  'models.table.request_process_rate.tips':
    'Расчет частоты запросов и скорости обработки на основе данных запросов и обработки за последние 2 минуты (обновляется каждые 15 секунд)',
  'models.form.auto_load': 'Автозагрузка',
  'models.form.auto_load_replicas': 'Автозагрузка реплик',
  'models.form.auto_load_replicas.min_warning':
    'Автозагрузка реплик не может быть меньше 1, установлено значение 1',
  'models.form.auto_load.tips':
    'При включении модель будет автоматически загружаться при поступлении запросов API. При отключении необходимо вручную запустить модель перед использованием.',
  'models.form.auto_adjust_replicas': 'Автоматическое регулирование реплик #',
  'models.form.auto_adjust_replicas.tips':
    'При включении количество реплик будет автоматически регулироваться в зависимости от спроса/предложения за последние 2 минуты (каждые 60 секунд, с максимальной корректировкой 1 реплики вверх или вниз за раз)',
  'models.form.waiting_first_scaling': 'Ожидание первого автомасштабирования',
  'models.form.checking_replicas_change': 'Проверка изменений реплик...',
  'models.form.replicas_change_increase': 'Реплики +{count}',
  'models.form.replicas_change_decrease': 'Реплики -{count}',
  'models.form.replicas_change_no_change': 'Реплики без изменений',
  'models.form.auto_unload': 'Автоотключение',
  'models.form.waiting_unloading': 'Ожидание отключения...',
  'models.form.auto_unload.tips':
    'При включении модель будет автоматически отключаться при отсутствии запросов в течение указанного периода времени. При отключении необходимо вручную отключить модель перед использованием.',
  'models.form.auto_unload_timeout': 'Время автоотключения',
  'models.form.auto_unload_timeout.min_warning':
    'Время автоотключения не может быть меньше 5 минут, установлено значение 5 минут',
  'models.form.auto_unload_timeout.tips':
    'Модель будет автоматически отключена при отсутствии запросов в течение указанного периода времени. Значение по умолчанию — 10 минут.'
};

// ========== To-Do: Translate Keys (Remove After Translation) ==========

// ========== End of To-Do List ==========
