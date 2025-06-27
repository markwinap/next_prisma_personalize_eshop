'use client'
import { Layout, Button, Typography, Space, Avatar, theme } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
const { Header, Content } = Layout;
const { Text } = Typography;

export default function RootLayout({
  children,
  session
}: Readonly<{ children: React.ReactNode, session: never }>) {
  const {
    token: { colorBgLayout, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const { data: sessionData, status } = useSession();

  return (
    <Layout style={{ height: '100vh', overflow: 'auto' }}>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#001529',
          padding: '0 24px',
        }}
      >
        {/* Logo Section */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image src="/logo192.png" alt="Logo" width="32" height="32" style={{ marginRight: 12 }} />
          <Text style={{ color: '#fff', fontSize: 18 }}>AWS Personalize</Text>
        </div>

        {/* User Info + Logout */}
        <Space align="center">
          <Avatar icon={<UserOutlined />} />
          <Text style={{ color: '#fff' }}>{sessionData?.user.email}</Text>
          {/* <Text style={{ color: '#fff' }}>{sessionData?.id}</Text>
            <Text style={{ color: '#fff' }}>{sessionData?.userId}</Text> */}
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={() => {
              console.log('Logout clicked');
              router.push(sessionData ? '/api/auth/signout' : '/api/auth/signin');
            }}
          >
            {
              sessionData ? 'Logout' : 'Login'
            }
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: '0 48px', height: '100vh' }}>
        <Layout
          style={{ padding: '24px 0', height: '100vh' }}
        >
          {children}
        </Layout>
      </Content>
    </Layout>
  );
}
