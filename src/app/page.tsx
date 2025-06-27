'use client'
import { Layout, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { data: sessionData, status } = useSession();

  useEffect(() => {
    console.log('Session status:', status);
    if (status === 'loading') {
      console.log('Loading session data...');
    } else if (status === 'authenticated') {
      console.log('User is authenticated:', sessionData);
      // redirect to main route
      router.push('/route/yatch');
    } else if (status === 'unauthenticated') {
      console.log('User is not authenticated');
      // redirect to sign-in page
      router.push('/api/auth/signin');
    }
  }, [status, sessionData]);

  return (
    <>
      <div className="animated-background">
        <Layout
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: 'transparent',
          }}
        >
          <Button
            size="large"
            type="default"
            icon={<LogoutOutlined />}
            onClick={() => {
              console.log('Logout clicked');
              router.push(sessionData ? '/api/auth/signout' : '/api/auth/signin');
            }}
          >
            {sessionData ? 'Logout' : 'Login'}
          </Button>
        </Layout>
      </div>
      <style jsx>{`
        .animated-background {
          min-height: 100vh;
          animation: gradient 15s ease infinite;
          background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
          background-size: 400% 400%;
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </>
  );
}
