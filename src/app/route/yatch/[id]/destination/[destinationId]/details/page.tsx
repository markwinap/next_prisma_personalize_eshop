'use client'
import { Layout, Button, Typography, Space, Avatar, Breadcrumb, theme, Col, Row, Card, Tooltip, Drawer, Form, Input, InputNumber, DatePicker, Tag } from 'antd';
import { LogoutOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { use, useEffect, useState } from 'react';
import { api } from '~/trpc/react';
import { useRouter } from "next/navigation";
import type { FormProps } from 'antd';
const { Header, Content } = Layout;
const { Text } = Typography;

// model Destination {
//     id        String    @id @default(cuid())
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
//     name      String
//     voyageType   String
//     voyageRegion String
//     voyageStartDate DateTime
//     voyageEndDate DateTime
//     voyageEmbarkPort String
//     voyageDisembarkPort String
//     embarkationCountry String
//     disEmbarkationCountry String
//     nights Int
//     startingPrice Float
//     ports String[]
//     yatchId   String
//     yatch     Yatch     @relation(fields: [yatchId], references: [id], onDelete: Cascade)
// }

type FieldType = {
    name: string;
    voyageType: string;
    voyageRegion: string;
    voyageStartDate: Date;
    voyageEndDate: Date;
    voyageEmbarkPort: string;
    voyageDisembarkPort: string;
    embarkationCountry: string;
    disEmbarkationCountry: string;
    nights: number;
    startingPrice: number;
    // ports: string[];
};

export default function Details({ params }: { params: Promise<{ id: string, destinationId: string }> }) {
    const { id, destinationId } = use(params);
    const router = useRouter();

    const { data: sessionData, status } = useSession();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    // Queries
    const { data: yatch } = api.yatch.getById.useQuery({ id });
    const { data: destination } = api.destination.getById.useQuery({ id: destinationId });


    // Form


    // Fetch



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
                        items={[
                            { title: 'Home' },
                            {
                                title: <Text
                                    onClick={() => { void router.push(`/`) }}
                                    style={{ cursor: 'pointer' }}
                                >Yatchs</Text>
                            },
                            { title: yatch?.name ?? 'Yatch' },
                            {
                                title: <Text
                                    onClick={() => { void router.push(`/route/yatch/${yatch?.id}/destination`) }}
                                    style={{ cursor: 'pointer' }}
                                >Destinations</Text>
                            },
                            { title: destination?.name ?? 'Destination' },
                            { title: 'Details' },
                        ]}
                    />
                    <Layout
                        style={{ padding: '24px 0', borderRadius: borderRadiusLG }}
                    >
                        <Row>
                            <Col span={12} style={{ padding: '0 12px' }}>
                                <Card title={destination?.name} variant="borderless" style={{ width: '100%' }}>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                Region
                                            </Typography.Title>
                                        </Col>
                                        <Col span={24}>
                                            {destination?.voyageRegion}
                                        </Col>

                                        <Col span={24}>
                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                Nigths
                                            </Typography.Title>
                                        </Col>
                                        <Col span={24}>
                                            {destination?.nights}
                                        </Col>


                                        <Col span={24}>
                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                Starting Price
                                            </Typography.Title>
                                        </Col>
                                        <Col span={24}>
                                            {destination?.startingPrice}
                                        </Col>


                                        <Col span={24}>
                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                Embarkation Country
                                            </Typography.Title>
                                        </Col>
                                        <Col span={24}>
                                            {destination?.embarkationCountry}
                                        </Col>

                                        <Col span={24}>
                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                Disembarkation Country
                                            </Typography.Title>
                                        </Col>
                                        <Col span={24}>
                                            {destination?.disEmbarkationCountry}
                                        </Col>

                                        <Col span={24}>
                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                Ports
                                            </Typography.Title>
                                        </Col>
                                        <Col span={24}>
                                            {
                                                destination?.ports.map((port, index) => (
                                                    <Tag key={index} color="magenta">{port}</Tag>
                                                ))
                                            }
                                        </Col>

                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                        {/* <Content style={{ padding: '0 24px', minHeight: 280 }}>Content</Content> */}
                    </Layout>
                </Content>
            </Layout>
        </>)
}
