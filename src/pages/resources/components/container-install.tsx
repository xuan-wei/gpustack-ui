import { GPUStackVersionAtom } from '@/atoms/user';
import { getAtomStorage } from '@/atoms/utils';
import EditorWrap from '@/components/editor-wrap';
import HighlightCode from '@/components/highlight-code';
import { useIntl } from '@umijs/max';
import { Radio } from 'antd';
import React from 'react';
import { addWorkerGuide, containerInstallOptions } from '../config';
import './styles/installation.less';

type ViewModalProps = {
  token: string;
};

const npuOptions = [
  { label: '910B', value: 'npu' },
  { label: '310P', value: 'npu310p' }
];

const AddWorker: React.FC<ViewModalProps> = (props) => {
  const intl = useIntl();

  const origin = window.location.origin;
  const [activeKey, setActiveKey] = React.useState('cuda');
  const [npuKey, setNpuKey] = React.useState('npu');
  const versionInfo = getAtomStorage(GPUStackVersionAtom);

  const code = React.useMemo(() => {
    let version = versionInfo?.version;
    if (!version || !versionInfo.isProduction) {
      version = 'main';
    }

    let commandCode = addWorkerGuide[activeKey];

    if (npuKey === 'npu310p' && activeKey === 'npu') {
      commandCode = addWorkerGuide[npuKey];
    }

    const tag = activeKey === 'cuda' ? version : `${version}-${activeKey}`;

    return commandCode?.registerWorker({
      server: origin,
      tag: tag,
      token: '${token}',
      workerip: '${workerip}'
    });
  }, [versionInfo, activeKey, props.token, npuKey]);

  const handleOnChange = (value: string | number) => {
    setNpuKey(value as string);
  };

  return (
    <div className="container-install">
      <ul className="notes">
        <li>
          {intl.formatMessage(
            { id: 'resources.worker.current.version' },
            { version: versionInfo.version }
          )}
        </li>
        <li>
          <span
            dangerouslySetInnerHTML={{
              __html: intl.formatMessage({
                id: 'resources.worker.driver.install'
              })
            }}
          ></span>
        </li>
      </ul>
      <h3 className="font-size-14 font-600">
        1.{' '}
        <span
          dangerouslySetInnerHTML={{
            __html: intl.formatMessage({ id: 'resources.worker.add.step1' })
          }}
        ></span>
      </h3>
      <HighlightCode
        code={addWorkerGuide.container.getToken}
        theme="dark"
        lang="bash"
      ></HighlightCode>
      <h3 className="m-t-10 font-size-14 font-600">
        2. {intl.formatMessage({ id: 'resources.worker.add.step2' })}{' '}
        <span
          className="font-size-12"
          style={{ color: 'var(--ant-color-text-tertiary)' }}
          dangerouslySetInnerHTML={{
            __html: `${intl.formatMessage({
              id: 'resources.worker.add.step2.tips'
            })}`
          }}
        ></span>
      </h3>
      <div className="m-b-16">
        <Radio.Group
          block
          options={containerInstallOptions}
          defaultValue={activeKey}
          value={activeKey}
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => setActiveKey(e.target.value)}
          size="small"
        />
      </div>
      {activeKey === 'npu' && (
        <div
          className="m-b-8 text-tertiary"
          dangerouslySetInnerHTML={{
            __html: intl.formatMessage({ id: 'resources.worker.cann.tips' })
          }}
        ></div>
      )}
      {activeKey === 'npu' ? (
        <EditorWrap
          headerHeight={32}
          copyText={code}
          langOptions={npuOptions}
          defaultValue="npu"
          showHeader={true}
          onChangeLang={handleOnChange}
          styles={{
            wrapper: {
              backgroundColor: 'var(--color-editor-dark)'
            }
          }}
        >
          <HighlightCode
            theme="dark"
            code={code.replace(/\\/g, '')}
            copyValue={code}
            lang="bash"
            copyable={false}
          ></HighlightCode>
        </EditorWrap>
      ) : (
        <HighlightCode
          theme="dark"
          code={code.replace(/\\/g, '')}
          copyValue={code}
          lang="bash"
        ></HighlightCode>
      )}
      <h3 className="m-b-0 m-t-10 font-size-14 font-600">
        3. {intl.formatMessage({ id: 'resources.worker.add.step3' })}
      </h3>
    </div>
  );
};

export default React.memo(AddWorker);
