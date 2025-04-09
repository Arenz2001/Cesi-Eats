'use client'

import React from 'react'

export default function OrderHistory() {
    const orders = [
        {
            id: '12340',
            client: 'David Smith',
            deliveredAt: '2023-10-01',
        },
        {
            id: '12341',
            client: 'Emma Jones',
            deliveredAt: '2023-09-29',
        },
    ]

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h2 className="text-xl font-bold mb-6">Order History</h2>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white rounded-lg shadow-sm p-4"
                    >
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-sm text-gray-700">Customer: {order.client}</p>
                        <p className="text-sm text-gray-500">Delivered on {order.deliveredAt}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
