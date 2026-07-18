'use client'

import { useState } from 'react'
import { createClient } from '@/lib/client'

interface Config {
  id: string
  key: string
  value: any
  description: string
  updated_at: string
}

interface Props {
  configs: Config[]
  stats: { userCount: number; txCount: number }
}

export default function OperationsDashboard({ configs, stats }: Props) {
  const [editingConfig, setEditingConfig] = useState<Config | null>(null)
  const [editValue, setEditValue] = useState('')
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleEdit = (config: Config) => {
    setEditingConfig(config)
    setEditValue(JSON.stringify(config.value, null, 2))
  }

  const handleSave = async () => {
    if (!editingConfig) return
    
    try {
      const parsedValue = JSON.parse(editValue)
      const { error } = await supabase
        .from('operation_configs')
        .update({ value: parsedValue, updated_at: new Date().toISOString() })
        .eq('id', editingConfig.id)
      
      if (error) throw error
      
      setMessage('✅ 保存成功')
      setEditingConfig(null)
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setMessage(`❌ 错误: ${err.message}`)
    }
  }

  const configLabels: Record<string, string> = {
    pricing: '💰 定价配置',
    model_costs: '🤖 模型消耗',
    features: '⚙️ 功能开关'
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">总用户数</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.userCount}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">交易记录</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.txCount}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">配置项</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{configs.length}</dd>
          </div>
        </div>
      </div>

      {/* 消息提示 */}
      {message && (
        <div className={`rounded-md p-4 ${message.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      {/* 配置列表 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">运营配置</h3>
          <p className="mt-1 text-sm text-gray-500">点击编辑修改配置值</p>
        </div>
        <ul className="divide-y divide-gray-200">
          {configs.map((config) => (
            <li key={config.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleEdit(config)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {configLabels[config.key] || config.key}
                  </p>
                  <p className="text-sm text-gray-500">{config.description}</p>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(config.updated_at).toLocaleString('zh-CN')}
                </div>
              </div>
              <pre className="mt-2 text-xs text-gray-600 bg-gray-100 rounded p-2 overflow-x-auto">
                {JSON.stringify(config.value, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      </div>

      {/* 编辑弹窗 */}
      {editingConfig && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                编辑: {configLabels[editingConfig.key] || editingConfig.key}
              </h3>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full h-64 font-mono text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="px-4 py-3 sm:px-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setEditingConfig(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
