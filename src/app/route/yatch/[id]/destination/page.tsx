'use client'
import { Layout, Button, Typography, Space, Avatar, Breadcrumb, theme, Col, Row, Card, Tooltip, Drawer, Form, Input, InputNumber, DatePicker } from 'antd';
import { LogoutOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { use, useEffect, useState } from 'react';
import { api } from '~/trpc/react';
import { useRouter } from "next/navigation";
import type { FormProps } from 'antd';
const { Header, Content } = Layout;
const { Text } = Typography;

interface RecommendationsProps {
    mostViewed: MostViewed
    forYou: ForYou
}

interface MostViewed {
    $metadata: Metadata
    itemList: ItemList[]
    recommendationId: string
}

interface Metadata {
    httpStatusCode: number
    requestId: string
    attempts: number
    totalRetryDelay: number
}

interface ItemList {
    itemId: string
}

interface ForYou {
    $metadata: Metadata2
    itemList: ItemList2[]
    recommendationId: string
}

interface Metadata2 {
    httpStatusCode: number
    requestId: string
    attempts: number
    totalRetryDelay: number
}

interface ItemList2 {
    itemId: string
    score: number
}

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

export default function Destination({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

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

    const { data: sessionData } = useSession() as {
        data: {
            user: {
                id: string;
                email: string;
            };
            id: string;
        } | null;
        status: string;
    }
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [form] = Form.useForm();
    const [open, setOpen] = useState<boolean>(false);
    const [mostViewed, setMostViewed] = useState<string[]>([]);
    const [forYou, setForYou] = useState<string[]>([]);

    // Queries
    const { data, refetch } = api.destination.getALlByYatchId.useQuery(id);
    const { data: yatchData } = api.yatch.getById.useQuery({ id });
    // Mutations
    const { mutate: mutateCreate, } = api.destination.create.useMutation();

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        form.resetFields();
    };

    // Form
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);

        const createParams = {
            ...values,
            yatchId: id,
            voyageStartDate: values.voyageStartDate ? new Date(values.voyageStartDate) : new Date(), // Ensure it's a Date object
            voyageEndDate: values.voyageEndDate ? new Date(values.voyageEndDate) : new Date(), // Ensure it's a Date object
            ports: [], // Initialize ports as an empty array
        }
        console.log('createParams:', createParams);

        mutateCreate(createParams, {
            onSuccess: (data) => {
                onClose();
                console.log(data);
                refetch().catch((error) => {
                    console.error('Error refetching yatch data:', error);
                });
                putItem(data.id, data.yatchId, createParams).catch((error) => {
                    console.error('Error updating item:', error);
                });

            },
            onError: (error) => {
                console.error('Error creating yatch:', error);
            },
        });
    };
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // Fetch
    const putItem = async (id: string, yatchId: string, params: FieldType) => {

        const {
            name,
            voyageType,
            voyageRegion,
            voyageStartDate,
            voyageEndDate,
            voyageEmbarkPort,
            voyageDisembarkPort,
            embarkationCountry,
            disEmbarkationCountry,
            nights,
            startingPrice,
        } = params;

        const putParams = {
            id,
            name,
            categoryL1: voyageType,
            categoryL2: voyageRegion,
            categoryL3: voyageEmbarkPort,
            categoryL4: voyageDisembarkPort,
            categoryL5: embarkationCountry,
            categoryL6: disEmbarkationCountry,
            categoryL7: yatchId,
            voyageNights: nights,
            price: startingPrice,
            voyageStartDate: voyageStartDate.getTime(), // Convert Date to timestamp in milliseconds
            voyageEndDate: voyageEndDate.getTime(), // Convert Date to timestamp in milliseconds
        }

        try {
            const response = await fetch('/api/personalize/put_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(putParams),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json() as { message: string, data: string };
            console.log('Item updated successfully:', data);
        } catch (error) {
            console.error('Error updating item:', error);
        }

    }
    const putEvent = async (userId: string, sessionId: string, eventType: string, itemId: string) => {
        const putParams = {
            userId,
            sessionId,
            eventType,
            itemId
        }

        try {
            const response = await fetch('/api/personalize/put_event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(putParams),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json() as { message: string, data: string };
            console.log('Item updated successfully:', data);
        } catch (error) {
            console.error('Error updating item:', error);
        }
    }
    const getRecommendations = async (userId: string, yatchId: string) => {
        try {
            const response = await fetch('/api/personalize/get_recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, yatchId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json() as RecommendationsProps;

            console.log('Most Viewed:', data.mostViewed);
            console.log('For You:', data.forYou);

            setMostViewed(data.mostViewed.itemList.map(item => item.itemId));
            setForYou(data.forYou.itemList.map(item => item.itemId));

            return data;
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    }

    useEffect(() => {
        if (sessionData) {
            // Fetch recommendations when sessionData is available
            getRecommendations(sessionData.user.id, id).catch((error) => {
                console.error('Error fetching recommendations:', error);
            });
        }
    }, [sessionData]);

    return (
        <>
            <Breadcrumb
                style={{ margin: '16px 0' }}
                items={[
                    {
                        title: <Text
                            onClick={() => { void router.push(`/`) }}
                            style={{ cursor: 'pointer' }}
                        >Yatchs</Text>
                    },
                    { title: yatchData?.name ?? 'Yatch' },
                    { title: 'Destinations' },
                ]}
            />
            <Row gutter={[16, 16]}>

                <Col span={24} >
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        For You
                    </Typography.Title>
                </Col>
                {
                    forYou?.map((destinationId, index) => {
                        const destination = data?.find(dest => dest.id === destinationId);
                        if (!destination) return null; // Skip if destination not found
                        return (
                            <Col span={6} key={index} style={{ padding: '0 12px' }}>
                                <Card title={<Button
                                    type="text"
                                    block
                                    onClick={() => {
                                        // const putEvent = async (userId: string, sessionId: string, eventType: string, itemId: string) => {
                                        void putEvent(sessionData?.user.id ?? '', sessionData?.id ?? '', 'view', destination.id).catch((error) => {
                                            console.error('Error putting event:', error);
                                        }).then(() => {
                                            router.push(`/route/yatch/${id}/destination/${destination.id}/details`)
                                        })
                                        // router.push(`/route/yatch/${id}/destination/${destination.id}/details`)
                                    }}
                                >{destination.name}</Button>} variant="borderless" style={{ width: '100%' }}>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                Region
                                            </Typography.Title>
                                        </Col>
                                        <Col span={24}>
                                            {destination.voyageRegion}
                                        </Col>

                                        <Col span={24}>
                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                Nigths
                                            </Typography.Title>
                                        </Col>
                                        <Col span={24}>
                                            {destination.nights}
                                        </Col>


                                        <Col span={24}>
                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                Starting Price
                                            </Typography.Title>
                                        </Col>
                                        <Col span={24}>
                                            {destination.startingPrice}
                                        </Col>


                                        <Col span={24}>
                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                Embarkation Country
                                            </Typography.Title>
                                        </Col>
                                        <Col span={24}>
                                            {destination.embarkationCountry}
                                        </Col>

                                        <Col span={24}>
                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                Disembarkation Country
                                            </Typography.Title>
                                        </Col>
                                        <Col span={24}>
                                            {destination.disEmbarkationCountry}
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        )
                    })
                }


                <Col span={24} >
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        Most Viewed
                    </Typography.Title>
                </Col>

                {
                    mostViewed?.map((destinationId, index) => {
                        const destination = data?.find(dest => dest.id === destinationId);
                        if (!destination) return null; // Skip if destination not found
                        return (
                            <Col span={6} key={index} style={{ padding: '0 12px' }}>
                                <Card title={<Button
                                    type="text"
                                    block
                                    onClick={() => {
                                        // const putEvent = async (userId: string, sessionId: string, eventType: string, itemId: string) => {
                                        void putEvent(sessionData?.user.id ?? '', sessionData?.id ?? '', 'view', destination.id).catch((error) => {
                                            console.error('Error putting event:', error);
                                        }).then(() => {
                                            router.push(`/route/yatch/${id}/destination/${destination.id}/details`)
                                        })
                                        // router.push(`/route/yatch/${id}/destination/${destination.id}/details`)
                                    }}
                                >{destination.name}</Button>} variant="borderless" style={{ width: '100%' }}>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                Region
                                            </Typography.Title>
                                        </Col>
                                        <Col span={24}>
                                            {destination.voyageRegion}
                                        </Col>

                                        <Col span={24}>
                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                Nigths
                                            </Typography.Title>
                                        </Col>
                                        <Col span={24}>
                                            {destination.nights}
                                        </Col>


                                        <Col span={24}>
                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                Starting Price
                                            </Typography.Title>
                                        </Col>
                                        <Col span={24}>
                                            {destination.startingPrice}
                                        </Col>


                                        <Col span={24}>
                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                Embarkation Country
                                            </Typography.Title>
                                        </Col>
                                        <Col span={24}>
                                            {destination.embarkationCountry}
                                        </Col>

                                        <Col span={24}>
                                            <Typography.Title level={5} style={{ margin: 0 }}>
                                                Disembarkation Country
                                            </Typography.Title>
                                        </Col>
                                        <Col span={24}>
                                            {destination.disEmbarkationCountry}
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        )
                    })
                }


                <Col span={24} >
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        All
                    </Typography.Title>
                </Col>


                {
                    data?.map((destination, index) => (
                        <Col span={6} key={index} style={{ padding: '0 12px' }}>
                            <Card title={<Button
                                type="text"
                                block
                                onClick={() => {
                                    // const putEvent = async (userId: string, sessionId: string, eventType: string, itemId: string) => {
                                    void putEvent(sessionData?.user.id ?? '', sessionData?.id ?? '', 'view', destination.id).catch((error) => {
                                        console.error('Error putting event:', error);
                                    }).then(() => {
                                        router.push(`/route/yatch/${id}/destination/${destination.id}/details`)
                                    })
                                    // router.push(`/route/yatch/${id}/destination/${destination.id}/details`)
                                }}
                            >{destination.name}</Button>} variant="borderless" style={{ width: '100%' }}>
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Typography.Title level={5} style={{ margin: 0 }}>
                                            Region
                                        </Typography.Title>
                                    </Col>
                                    <Col span={24}>
                                        {destination.voyageRegion}
                                    </Col>

                                    <Col span={24}>
                                        <Typography.Title level={5} style={{ margin: 0 }}>
                                            Nigths
                                        </Typography.Title>
                                    </Col>
                                    <Col span={24}>
                                        {destination.nights}
                                    </Col>


                                    <Col span={24}>
                                        <Typography.Title level={5} style={{ margin: 0 }}>
                                            Starting Price
                                        </Typography.Title>
                                    </Col>
                                    <Col span={24}>
                                        {destination.startingPrice}
                                    </Col>


                                    <Col span={24}>
                                        <Typography.Title level={5} style={{ margin: 0 }}>
                                            Embarkation Country
                                        </Typography.Title>
                                    </Col>
                                    <Col span={24}>
                                        {destination.embarkationCountry}
                                    </Col>

                                    <Col span={24}>
                                        <Typography.Title level={5} style={{ margin: 0 }}>
                                            Disembarkation Country
                                        </Typography.Title>
                                    </Col>
                                    <Col span={24}>
                                        {destination.disEmbarkationCountry}
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
                        <Col span={24}>
                            <Form.Item<FieldType>
                                label="Type"
                                name="voyageType"
                                rules={[{ required: true, message: 'Please input mising data' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item<FieldType>
                                label="Region"
                                name="voyageRegion"
                                rules={[{ required: true, message: 'Please input mising data' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item<FieldType>
                                label="Start Date"
                                name="voyageStartDate"
                                rules={[{ required: true, message: 'Please input mising data' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    placeholder="Resolved Date"
                                    format="YYYY-MM-DD"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item<FieldType>
                                label="End Date"
                                name="voyageEndDate"
                                rules={[{ required: true, message: 'Please input mising data' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    placeholder="Resolved Date"
                                    format="YYYY-MM-DD"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item<FieldType>
                                label="Embark Port"
                                name="voyageEmbarkPort"
                                rules={[{ required: true, message: 'Please input mising data' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item<FieldType>
                                label="Disembark Port"
                                name="voyageDisembarkPort"
                                rules={[{ required: true, message: 'Please input mising data' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item<FieldType>
                                label="Embarkation Country"
                                name="embarkationCountry"
                                rules={[{ required: true, message: 'Please input mising data' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>


                        <Col span={24}>
                            <Form.Item<FieldType>
                                label="Disembarkation Country"
                                name="disEmbarkationCountry"
                                rules={[{ required: true, message: 'Please input mising data' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>


                        <Col span={24}>
                            <Form.Item<FieldType>
                                label="Nights"
                                name="nights"
                                rules={[{ required: true, message: 'Please input mising data' }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item<FieldType>
                                label="Starting Price"
                                name="startingPrice"
                                rules={[{ required: true, message: 'Please input mising data' }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>



                    </Row>
                </Form>
            </Drawer>
        </>)
}
