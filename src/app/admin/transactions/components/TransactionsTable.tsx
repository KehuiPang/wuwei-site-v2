'use client'

import { useState } from 'react'

interface Transaction {
  id: string
  user_id: string
  type: 'earn' | 'spend' | 'refund'
  amount: number
  description: string
  created_at: string
  users: { email: string }[]
}

interface Props {
  transactions: Transaction[]
}

export default function TransactionsTable({ transactions }: Props) {
  const [filter, setFilter] = useState('all')

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true
    return tx.type === filter
  })

  const getTypeLabel = (type: string) => {
    const labels: Record<string, { text: string; color: string }> = {
      earn: { text: '获得', color: 'bg-green-100 text-green-800' },
      spend: { text: '消耗', color: 'bg-red-100 text-red-800' },
      refund: { text: '退款', color: 'bg-blue-100 text-blue-800' }
    }
    return labels[type] || { text: type, color: 'bg-gray-100 text-gray-800' }
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        {[
          { key: 'all', label: '全部' },
          { key: 'earn', label: '获得' },
          { key: 'spend', label: '消耗' },
          { key: 'refund', label: '退款' }
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === item.key
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">交易记录</h3>
          <p className="mt-1 text-sm text-gray-500">共 {filteredTransactions.length} 条记录</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((tx) => {
                const typeInfo = getTypeLabel(tx.type)
                return (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tx.users?.[0]?.email || tx.user_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeInfo.color}`}>
                        {typeInfo.text}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      tx.type === 'earn' ? 'text-green-600' : tx.type === 'spend' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {tx.type === 'earn' ? '+' : tx.type === 'spend' ? '-' : ''}{tx.amount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{tx.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tx.created_at).toLocaleString('zh-CN')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
