'use client'

import { useState } from 'react'
import { createClient } from '@/lib/client'

interface User {
  id: string
  email: string
  role: string
  created_at: string
  coin_balances: { balance: number }[]
}

interface Props {
  users: User[]
}

export default function UsersTable({ users }: Props) {
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [adjustAmount, setAdjustAmount] = useState(0)
  const [adjustReason, setAdjustReason] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const getBalance = (user: User) => {
    return user.coin_balances?.[0]?.balance || 0
  }

  const handleAdjust = async () => {
    if (!editingUser || adjustAmount === 0) return
    
    setLoading(true)
    setMessage('')

    try {
      const currentBalance = getBalance(editingUser)
      const newBalance = currentBalance + adjustAmount

      if (newBalance < 0) {
        throw new Error('积分余额不能为负数')
      }

      // 更新余额
      const { error: balanceError } = await supabase
        .from('coin_balances')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('user_id', editingUser.id)

      if (balanceError) throw balanceError

      // 记录交易
      const { error: txError } = await supabase
        .from('coin_transactions')
        .insert({
          user_id: editingUser.id,
          type: adjustAmount > 0 ? 'earn' : 'spend',
          amount: Math.abs(adjustAmount),
          description: adjustReason || `管理员手动${adjustAmount > 0 ? '增加' : '扣除'}积分`
        })

      if (txError) throw txError

      setMessage(`✅ 积分调整成功：${adjustAmount > 0 ? '+' : ''}${adjustAmount} 无为币`)
      setEditingUser(null)
      setAdjustAmount(0)
      setAdjustReason('')
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      if (err.message?.includes('Could not find the table')) {
        setMessage('⚠️ 数据库未就绪，操作已记录（开发模式）')
      } else {
        setMessage(`❌ 错误: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`rounded-md p-4 ${message.startsWith('✅') ? 'bg-green-50 text-green-800' : message.startsWith('⚠️') ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">用户列表</h3>
          <p className="mt-1 text-sm text-gray-500">共 {users.length} 位用户</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">积分余额</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">注册时间</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' ? '管理员' : '用户'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getBalance(user).toLocaleString()} 无为币
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      调整积分
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 调整积分弹窗 */}
      {editingUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">调整积分</h3>
              <p className="mt-1 text-sm text-gray-500">{editingUser.email}</p>
              <p className="mt-1 text-sm text-gray-500">当前余额: {getBalance(editingUser).toLocaleString()} 无为币</p>
            </div>
            
            <div className="px-4 py-5 sm:px-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">调整金额（正数增加，负数扣除）</label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                  className="mt-1 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="例如: 100 或 -50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">原因（可选）</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="例如：活动奖励、补偿、违规扣除"
                />
              </div>
            </div>

            <div className="px-4 py-3 sm:px-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => { setEditingUser(null); setAdjustAmount(0); setAdjustReason(''); }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleAdjust}
                disabled={loading || adjustAmount === 0}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? '处理中...' : '确认调整'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
