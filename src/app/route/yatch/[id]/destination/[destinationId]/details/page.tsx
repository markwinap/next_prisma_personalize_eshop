'use client'
import { Typography, Breadcrumb, Col, Row, Card, Tag } from 'antd';
import { use } from 'react';
import { api } from '~/trpc/react';
import { useRouter } from "next/navigation";
const { Text } = Typography;

export default function Details({ params }: { params: Promise<{ id: string, destinationId: string }> }) {
    const { id, destinationId } = use(params);
    const router = useRouter();
    // Queries
    const { data: yatch } = api.yatch.getById.useQuery({ id });
    const { data: destination } = api.destination.getById.useQuery({ id: destinationId });

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
        </>
    )
}
