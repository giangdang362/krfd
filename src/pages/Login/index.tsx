import { login } from '@/services/auth';
import { setSessionStorageUser, setStorageUser, setToken } from '@/utils/auth';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useModel } from '@umijs/max';
import { ConfigProvider, message } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import loginLogo from './../../../public/images/logo-login.png';
import './index.css';

const Login: React.FC = () => {
  const intl = useIntl();
  const { setInitialState } = useModel('@@initialState');
  const [loading, setLoading] = useState<boolean>(false);

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleSubmit = async (values: API.Login) => {
    setLoading(true);
    login({ ...values })
      .then((user) => {
        if (user) {
          setToken({
            accessToken: user?.jwtToken,
            refreshToken: user?.refreshToken,
          });
          setSessionStorageUser(user);
          if (values?.remember) setStorageUser(user);
          const defaultLoginSuccessMessage = intl.formatMessage({
            id: 'pages.login.success',
            defaultMessage: 'Login successfully!',
          });
          message.success(defaultLoginSuccessMessage);
          flushSync(() => {
            setInitialState((s: any) => ({
              ...s,
              currentUser: user,
            }));
          });
          const urlParams = new URL(window.location.href).searchParams;
          history.push(urlParams.get('redirect') || '/');
          setLoading(false);
          return;
        }
      })
      .catch((error) => {
        message.error(error.response?.data?.errorMessage);
        setLoading(false);
      });
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#EF488E',
        },
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '50%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div style={{ width: '356px' }} className="login-block">
              {/* <LoginMessage content='' /> */}
              <LoginForm<API.Login>
                title="Welcome Back!"
                initialValues={{ remember: true }}
                onFinish={async (values) => {
                  await handleSubmit(values);
                }}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                submitter={{ searchConfig: { submitText: 'Login' } }}
                loading={loading}
              >
                <div style={{ marginTop: 12 }}>
                  <p style={{ marginBottom: '8px', fontSize: '14px' }}>
                    {intl.formatMessage({
                      id: 'pages.login.email',
                      defaultMessage: 'Email',
                    })}
                  </p>
                  <ProFormText
                    name="email"
                    fieldProps={{
                      size: 'large',
                      prefix: <UserOutlined />,
                    }}
                    placeholder={intl.formatMessage({
                      id: 'pages.login.email.placeholder',
                      defaultMessage: 'admin or user',
                    })}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.login.email.required"
                            defaultMessage="Please enter email!"
                          />
                        ),
                      },
                    ]}
                  />
                  <p style={{ marginBottom: '8px', fontSize: '14px' }}>
                    {intl.formatMessage({
                      id: 'pages.login.password',
                      defaultMessage: 'Password',
                    })}
                  </p>
                  <ProFormText.Password
                    name="password"
                    fieldProps={{
                      size: 'large',
                      prefix: <LockOutlined />,
                    }}
                    placeholder={intl.formatMessage({
                      id: 'pages.login.password.placeholder',
                      defaultMessage: 'admin/user',
                    })}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.login.password.required"
                            defaultMessage="Please enter password!"
                          />
                        ),
                      },
                    ]}
                  />
                  <ProFormCheckbox name="remember" valuePropName="checked">
                    {intl.formatMessage({
                      id: 'pages.login.rememberMe',
                      defaultMessage: 'Remember me',
                    })}
                  </ProFormCheckbox>
                </div>
              </LoginForm>
            </div>
          </div>
        </div>
        <div
          style={{
            width: '50%',
            backgroundColor: '#F5F5F5',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img src={loginLogo} alt="Login Logo" />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Login;
