import Bg2 from '@/assets/images/bg-2.png';
import { userAtom } from '@/atoms/user';
import Footer from '@/components/footer';
import useUserSettings from '@/hooks/use-user-settings';
import { useModel } from '@umijs/max';
import { ConfigProvider, theme } from 'antd';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import styled from 'styled-components';
import LoginForm from './components/login-form';
import PasswordForm from './components/password-form';
import { checkDefaultPage } from './utils';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  min-height: 100vh;
  z-index: -1;
  background: url(${Bg2}) center center no-repeat;
  background-size: cover;
  opacity: 0.6;
`;

const Box = styled.div`
  padding-top: 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`;

const FormWrapper = styled.div`
  margin: 0 auto;
  border-radius: var(--border-radius-modal);
  width: max-content;
  height: max-content;
  padding: 32px;
  background-color: var(--ant-modal-content-bg);

  .field-wrapper {
    background-color: transparent !important;
  }

  .ant-input-outlined.ant-input-status-error:not(.ant-input-disabled) {
    background-color: transparent !important;
  }
`;

const Login = () => {
  const { themeData, userSettings } = useUserSettings();
  const { token } = theme.useToken();
  const [userInfo, setUserInfo] = useAtom(userAtom);
  const { initialState, setInitialState } = useModel('@@initialState') || {};

  const globalCssvars: Record<string, any> = {
    '--ant-modal-content-bg': 'rgba(255, 255, 255, 0.9)'
  };

  const gotoDefaultPage = async (userInfo: any) => {
    if (!userInfo || userInfo?.require_password_change) {
      return;
    }

    checkDefaultPage(userInfo, true);
    if (!initialState?.currentUser) {
      setInitialState((s: any) => ({
        ...s,
        currentUser: userInfo
      }));
    }
  };
  useEffect(() => {
    gotoDefaultPage(userInfo);
  }, [userInfo]);
  useEffect(() => {
    document.title = 'GPUStack';
  }, []);

  return (
    <ConfigProvider
      componentSize="large"
      key={userSettings.colorPrimary}
      theme={{
        algorithm: userSettings.isDarkTheme
          ? theme.darkAlgorithm
          : theme.defaultAlgorithm,
        ...themeData
      }}
    >
      <div style={globalCssvars}>
        <Wrapper></Wrapper>
        <Box>
          <FormWrapper>
            {userInfo?.require_password_change ? (
              <PasswordForm />
            ) : (
              <LoginForm />
            )}
          </FormWrapper>
          <Footer />
        </Box>
      </div>
    </ConfigProvider>
  );
};

export default Login;
