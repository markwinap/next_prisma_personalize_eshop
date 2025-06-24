'use client'
import { Layout, Button, Typography, Space, Avatar, Breadcrumb, theme, Col, Row, Card, Tooltip, Drawer, Form, Input, InputNumber } from 'antd';
import { LogoutOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { api } from '~/trpc/react';
import { useRouter } from "next/navigation";
import type { FormProps } from 'antd';
const { Header, Content } = Layout;
const { Text } = Typography;

// import Link from "next/link";

// import { LatestPost } from "~/app/_components/post";
// import { auth } from "~/server/auth";
// import { api, HydrateClient } from "~/trpc/server";
// import styles from "./index.module.css";

type FieldType = {
  name: string;
  year: number;
  capacity: number;
};

export default function Home() {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [open, setOpen] = useState<boolean>(false);
  // Queries
  const { data, refetch } = api.yatch.getAll.useQuery();
  // Mutations
  const { mutate: mutateCreate, } = api.yatch.create.useMutation();


  // const hello = await api.post.hello({ text: "from tRPC" });
  // const session = await auth();

  // if (session?.user) {
  //   void api.post.getLatest.prefetch();
  // }

  // sessionData
  // {
  //     "id": "cmc9btgni0001zq0ulytzlsad",
  //     "sessionToken": "afd3ef9f-960c-4d57-b7ad-5621025f2a81",
  //     "userId": "cmc8i4mtt00000c0wr9gl2h4u",
  //     "expires": "2025-07-23T16:44:03.175Z",
  //     "user": {
  //         "id": "cmc8i4mtt00000c0wr9gl2h4u",
  //         "name": null,
  //         "email": "markwinap@outlook.com",
  //         "emailVerified": null,
  //         "image": null
  //     }
  // }

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // Form
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);

    mutateCreate(values, {
      onSuccess: () => {
        form.resetFields();
        refetch().catch((error) => {
          console.error('Error refetching yatch data:', error);
        });
        setOpen(false);
      },
      onError: (error) => {
        console.error('Error creating yatch:', error);
      },
    });


  };
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    console.log('sessionData', sessionData);
  }, [sessionData]);

  return (
    <>
      <Layout style={{ height: '100%' }}>
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
            <img src="/logo192.png" alt="Logo" style={{ height: 32, marginRight: 12 }} />
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
        <Content style={{ padding: '0 48px', height: '100%' }}>
          <Breadcrumb
            style={{ margin: '16px 0' }}
            items={[{ title: 'Home' }]}
          />
          <Layout
            style={{ padding: '24px 0', borderRadius: borderRadiusLG }}
          >
            <Row>
              {
                data?.map((yatch, index) => (
                  <Col span={4} key={index} style={{ padding: '0 12px' }}>
                    <Card title={<Button
                      type="text"
                      block
                      onClick={() => router.push(`/route/yatch/${yatch.id}/destination`)}
                    >{yatch.name}</Button>} variant="borderless" style={{ width: '100%' }}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Typography.Title level={5} style={{ margin: 0 }}>
                            Year
                          </Typography.Title>
                        </Col>
                        <Col span={12}>
                          {yatch.year}
                        </Col>

                        <Col span={12}>
                          <Typography.Title level={5} style={{ margin: 0 }}>
                            Capacity
                          </Typography.Title>
                        </Col>
                        <Col span={12}>
                          {yatch.capacity}
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))
              }
              <Col span={8} style={{ padding: '0 12px' }}>
                <Tooltip title="search">
                  <Button
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={showDrawer}
                  />
                </Tooltip>
              </Col>
            </Row>
            {/* <Content style={{ padding: '0 24px', minHeight: 280 }}>Content</Content> */}
          </Layout>
        </Content>
      </Layout>
      <Drawer
        title="Create Yatch"
        closable={{ 'aria-label': 'Close Button' }}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={() => form.submit()} type="primary">
              Submit
            </Button>
          </Space>
        }

      >
        <Form
          // name="basic"
          // labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          // style={{ maxWidth: 600 }}
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        // autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item<FieldType>
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input yatch name!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                label="Year"
                name="year"
                rules={[{ required: true, message: 'Please input ship build year' }]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                label="Capacity"
                name="capacity"
                rules={[{ required: true, message: 'Please input ship capacity' }]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
    // <HydrateClient>
    //   <main className={styles.main}>
    //     <div className={styles.container}>
    //       <h1 className={styles.title}>
    //         Create <span className={styles.pinkSpan}>T3</span> App
    //       </h1>
    //       <div className={styles.cardRow}>
    //         <Link
    //           className={styles.card}
    //           href="https://create.t3.gg/en/usage/first-steps"
    //           target="_blank"
    //         >
    //           <h3 className={styles.cardTitle}>First Steps →</h3>
    //           <div className={styles.cardText}>
    //             Just the basics - Everything you need to know to set up your
    //             database and authentication.
    //           </div>
    //         </Link>
    //         <Link
    //           className={styles.card}
    //           href="https://create.t3.gg/en/introduction"
    //           target="_blank"
    //         >
    //           <h3 className={styles.cardTitle}>Documentation →</h3>
    //           <div className={styles.cardText}>
    //             Learn more about Create T3 App, the libraries it uses, and how
    //             to deploy it.
    //           </div>
    //         </Link>
    //       </div>
    //       <div className={styles.showcaseContainer}>
    //         <p className={styles.showcaseText}>
    //           {hello ? hello.greeting : "Loading tRPC query..."}
    //         </p>

    //         <div className={styles.authContainer}>
    //           <p className={styles.showcaseText}>
    //             {session && <span>Logged in as {session.user?.email}</span>}
    //           </p>
    //           <Link
    //             href={session ? "/api/auth/signout" : "/api/auth/signin"}
    //             className={styles.loginButton}
    //           >
    //             {session ? "Sign out" : "Sign in"}
    //           </Link>
    //         </div>
    //       </div>

    //       {session?.user && <LatestPost />}
    //     </div>
    //   </main>
    // </HydrateClient>
  );
}
