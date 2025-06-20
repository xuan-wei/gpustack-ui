export default {
  'models.button.deploy': 'モデルをデプロイ',
  'models.title': 'モデル',
  'models.title.edit': 'モデルを編集',
  'models.table.models': 'モデル',
  'models.table.name': 'モデル名',
  'models.form.source': 'ソース',
  'models.form.repoid': 'リポジトリID',
  'models.form.repoid.desc': 'GGUF形式のみサポートされています',
  'models.form.filename': 'ファイル名',
  'models.form.replicas': 'レプリカ',
  'models.form.selector': 'セレクター',
  'models.form.env': '環境変数',
  'models.form.configurations': '設定',
  'models.form.s3address': 'S3アドレス',
  'models.form.partialoffload.tips':
    'CPUオフロードが有効な場合、GPUリソースが不足するとモデルの一部のレイヤーがCPUにオフロードされます。GPUが利用できない場合は、完全なCPU推論が使用されます。',
  'models.form.distribution.tips':
    'ワーカーのリソースが不足している場合、モデルの一部のレイヤーを単一または複数のリモートワーカーにオフロードすることができます。',
  'models.openinplayground': 'プレイグラウンドで開く',
  'models.instances': 'インスタンス',
  'models.table.replicas.edit': 'レプリカを編集',
  'model.form.ollama.model': 'Ollamaモデル',
  'model.form.ollamaholder': 'モデル名を選択または入力してください',
  'model.deploy.sort': '並び替え',
  'model.deploy.search.placeholder': '<kbd>/</kbd>を入力してモデルを検索',
  'model.form.ollamatips':
    'ヒント: 以下はGPUStackで事前設定されたOllamaモデルです。希望するモデルを選択するか、右側の【{name}】入力ボックスにデプロイしたいモデルを直接入力してください。',
  'models.sort.name': '名前',
  'models.sort.size': 'サイズ',
  'models.sort.likes': 'いいね',
  'models.sort.trending': 'トレンド',
  'models.sort.downloads': 'ダウンロード数',
  'models.sort.updated': '更新日',
  'models.search.result': '{count} 件の結果',
  'models.data.card': 'モデルカード',
  'models.available.files': '利用可能なファイル',
  'models.viewin.hf': 'Hugging Faceで表示',
  'models.viewin.modelscope': 'ModelScopeで表示',
  'models.architecture': 'アーキテクチャ',
  'models.search.noresult': '関連するモデルが見つかりません',
  'models.search.nofiles': '利用可能なファイルがありません',
  'models.search.networkerror': 'ネットワーク接続エラー！',
  'models.search.hfvisit': 'アクセスできることを確認してください',
  'models.search.unsupport':
    'このモデルはサポートされておらず、デプロイ後に使用できない可能性があります。',
  'models.form.scheduletype': 'スケジュールタイプ',
  'models.form.categories': 'モデルカテゴリ',
  'models.form.scheduletype.auto': '自動',
  'models.form.scheduletype.manual': '手動',
  'models.form.scheduletype.auto.tips':
    '現在のリソース状況に基づいて、モデルインスタンスを適切なGPU/ワーカーに自動的にデプロイします。',
  'models.form.scheduletype.manual.tips':
    'モデルインスタンスをデプロイするGPU/ワーカーを手動で指定できます。',
  'models.form.manual.schedule': '手動スケジュール',
  'models.table.gpuindex': 'GPUインデックス',
  'models.table.backend': 'バックエンド',
  'models.table.acrossworker': 'ワーカー間で分散',
  'models.table.cpuoffload': 'CPUオフロード',
  'models.table.layers': 'レイヤー',
  'models.form.backend': 'バックエンド',
  'models.form.backend_parameters': 'バックエンドパラメータ',
  'models.search.gguf.tips':
    'GGUFモデルはllama-boxを使用します（Linux、macOS、Windowsをサポート）。',
  'models.search.vllm.tips':
    '非GGUFモデルは、音声にはvox-boxを、その他にはvLLM（x86 Linuxのみ）を使用します。',
  'models.search.voxbox.tips':
    '音声モデルをデプロイするには、GGUFチェックボックスをオフにしてください。',
  'models.form.ollamalink':
    '<a href="https://www.ollama.com/library" target="_blank">Ollamaライブラリ</a>でさらに探す',
  'models.form.backend_parameters.llamabox.placeholder': '例: --ctx-size=8192',
  'models.form.backend_parameters.vllm.placeholder': '例: --max-model-len=8192',
  'models.form.backend_parameters.vllm.tips': '詳細な{backend}パラメータ情報',
  'models.logs.pagination.prev': '前の{lines}行',
  'models.logs.pagination.next': '次の{lines}行',
  'models.logs.pagination.last': '最終ページ',
  'models.logs.pagination.first': '最初のページ',
  'models.form.localPath': 'ローカルパス',
  'models.form.filePath': 'モデルパス',
  'models.form.backendVersion': 'バックエンドバージョン',
  'models.form.backendVersion.tips':
    '希望する{backend}バージョンを使用するには、システムがオンライン環境で対応するバージョンをインストールする仮想環境を自動的に作成します。GPUStackのアップグレード後もバックエンドバージョンは固定されます。{link}',
  'models.form.gpuselector': 'GPUセレクター',
  'models.form.backend.llamabox':
    'GGUF形式のモデル用（Linux、macOS、Windowsをサポート）。',
  'models.form.backend.vllm':
    '非GGUF形式のモデル用。Linux（amd64/x86_64）のみ対応。',
  'models.form.backend.voxbox':
    '非GGUF形式の音声モデル用。NVIDIA GPUおよびCPUのみ対応。',
  'models.form.backend.mindie':
    '非GGUF形式のモデル用。Ascend 910Bおよび310Pのみ対応。',
  'models.form.search.gguftips':
    'macOSまたはWindowsをワーカーとして使用する場合、GGUFをチェックしてください（音声モデルの場合はオフにしてください）。',
  'models.form.button.addlabel': 'ラベルを追加',
  'models.filter.category': 'カテゴリでフィルタ',
  'models.list.more.logs': 'さらに表示',
  'models.catalog.release.date': 'リリース日',
  'models.localpath.gguf.tips.title': 'GGUF形式のモデル',
  'models.localpat.safe.tips.title': 'Safetensors形式のモデル',
  'models.localpath.shared.tips.title': '分割されたGGUF形式のモデル',
  'models.localpath.gguf.tips':
    'モデルファイルを指定してください。例: /data/models/model.gguf。',
  'models.localpath.safe.tips':
    'config.jsonファイルを含む.safetensorsディレクトリを指定してください。例: /data/models/model/。',
  'models.localpath.chunks.tips': `モデルの最初のシャードファイルを指定してください。例: /data/models/model-00001-of-00004.gguf。`,
  'models.form.replicas.tips':
    '複数のレプリカにより、{api} 推論リクエストの負荷分散が可能になります。',
  'models.table.list.empty': 'まだモデルがありません！',
  'models.table.list.getStart':
    '<span style="margin-right: 5px;font-size: 13px;">始めるには</span> <span style="font-size: 14px;font-weight: 700">DeepSeek-R1-Distill-Qwen-1.5B</span>',
  'models.table.llamaAcrossworker': 'Llama-box ワーカー間分散',
  'models.table.vllmAcrossworker': 'vLLM ワーカー間分散',
  'models.form.releases': 'リリース',
  'models.form.moreparameters': 'パラメータ説明',
  'models.table.vram.allocated': '割り当て済みVRAM',
  'models.form.backend.warning':
    'GGUF形式のモデルのバックエンドはllama-boxを使用します。',
  'models.form.ollama.warning':
    'Ollamaモデルのバックエンドをllama-boxを使用してデプロイします。',
  'models.form.backend.warning.llamabox':
    'llama-boxバックエンドを使用するには、モデルファイルのフルパスを指定してください（例:<span style="font-weight: 700">/data/models/model.gguf</span>）。分割モデルの場合、最初のシャードのパスを指定してください（例:<span style="font-weight: 700">/data/models/model-00001-of-00004.gguf</span>）。',
  'models.form.keyvalue.paste':
    '複数行のテキストを貼り付けます。各行にはキーと値のペアが含まれ、キーと値は=記号で区切られ、異なるキーと値のペアは改行文字で区切られます。',
  'models.form.files': 'ファイル',
  'models.table.status': 'ステータス',
  'models.form.submit.anyway': 'このまま送信',
  'models.form.evaluating': 'モデルの互換性を評価中',
  'models.form.incompatible': '互換性の問題が検出されました',
  'models.form.restart.onerror': 'エラー時に自動再起動',
  'models.form.restart.onerror.tips':
    'エラーが発生した場合、自動的に再起動を試みます。',
  'models.form.check.params': '設定を確認中...',
  'models.form.check.passed': '互換性チェックに合格しました',
  'models.form.check.claims':
    'このモデルには約{vram}のVRAMと{ram}のメモリが必要です。',
  'models.form.check.claims2': 'このモデルには約{vram}のVRAMが必要です。',
  'models.form.check.claims3': 'このモデルには約{ram}のメモリが必要です。',
  'models.form.update.tips':
    '変更はインスタンスを削除して再作成した後にのみ適用されます。',
  'models.table.download.progress': 'ダウンロード進行状況',
  'models.table.button.apiAccessInfo': 'APIアクセス情報',
  'models.table.button.apiAccessInfo.tips':
    'このモデルをサードパーティアプリケーションと統合するには、以下の詳細を使用してください: アクセスURL、モデル名、APIキー。これらの資格情報は、モデルサービスの適切な接続と使用を確保するために必要です。',
  'models.table.apiAccessInfo.endpoint': 'アクセスURL',
  'models.table.apiAccessInfo.modelName': 'モデル名',
  'models.table.apiAccessInfo.apikey': 'APIキー',
  'models.table.apiAccessInfo.openaiCompatible': 'OpenAI互換',
  'models.table.apiAccessInfo.jinaCompatible': 'Jina互換',
  'models.table.apiAccessInfo.gotoCreate': '作成に移動',
  'models.search.parts': '{n} パーツ',
  'models.search.evaluate.error': '評価中にエラーが発生しました: ',
  'models.table.avg_request_rate': 'リクエスト率',
  'models.table.avg_process_rate': '処理率',
  'models.table.request_process_rate': 'リクエスト/処理率',
  'models.table.request_process_rate.tips':
    '過去2分間のリクエストと処理データに基づいてリクエスト率と処理率を計算（15秒ごとに更新）',
  'models.form.auto_load': '自動読み込み',
  'models.form.auto_load_replicas': '自動読み込みレプリカ',
  'models.form.auto_load_replicas.min_warning':
    '自動読み込みレプリカは1以上でなければなりません。1に設定します。',
  'models.form.auto_load.tips':
    'APIリクエストが到着すると自動的に読み込まれます。無効にすると、使用する前に手動でモデルを起動する必要があります。',
  'models.form.auto_adjust_replicas': '自動調整レプリカ #',
  'models.form.auto_adjust_replicas.tips':
    '有効にすると、過去2分間の需要/供給の関係に基づいてレプリカ数が自動的に調整されます（60秒ごとに実行、毎回最大1つのレプリカを上下に調整）',
  'models.form.waiting_first_scaling': '初回自動スケーリング待ち',
  'models.form.checking_replicas_change': 'レプリカ変更を確認中...',
  'models.form.replicas_change_increase': 'レプリカ +{count}',
  'models.form.replicas_change_decrease': 'レプリカ -{count}',
  'models.form.replicas_change_no_change': 'レプリカ変更なし',
  'models.form.auto_unload': '自動オフロード',
  'models.form.waiting_unloading': 'アンロード待ち...',
  'models.form.auto_unload.tips':
    '指定された期間内にリクエストがない場合、モデルは自動的にオフロードされます。デフォルト値は10分です。',
  'models.form.auto_unload_timeout': '自動オフロードタイムアウト',
  'models.form.auto_unload_timeout.min_warning':
    '自動オフロードタイムアウトは5分以上でなければなりません。5分に設定します。',
  'models.form.auto_unload_timeout.tips':
    '指定された期間内にリクエストがない場合、モデルは自動的にオフロードされます。デフォルト値は10分です。'
};
