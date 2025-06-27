'use client'
import { Button, Typography, Space, Col, Row, Card, Tooltip, Drawer, Form, Input, InputNumber, Breadcrumb } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { api } from '~/trpc/react';
import { useRouter } from "next/navigation";
import type { FormProps } from 'antd';

type FieldType = {
  name: string;
  year: number;
  capacity: number;
};

export default function Home() {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const [form] = Form.useForm();
  const [open, setOpen] = useState<boolean>(false);
  // Queries
  const { data, refetch } = api.yatch.getAll.useQuery();
  // Mutations
  const { mutate: mutateCreate, } = api.yatch.create.useMutation();

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
      <Breadcrumb
        style={{ margin: '16px 0' }}
        items={[{ title: 'Yachts' }]}
      />
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
  );
}
