import { useMemo } from 'react'
import {
  type TransactionListPage,
  type TransactionSummary,
  type LabelValue,
  getTransactionQueue,
} from '@neonlabs-devops/gnosis-neon-gateway-typescript-sdk'
import { useAppSelector } from '@/store'
import { selectPendingTxs } from '@/store/pendingTxsSlice'
import useChainId from './useChainId'
import useAsync from './useAsync'
import useSafeAddress from './useSafeAddress'
import { isLabelListItem, isTransactionListItem } from '@/utils/transaction-guards'

const usePendingTxIds = (): Array<TransactionSummary['id']> => {
  const chainId = useChainId()
  const pendingTxs = useAppSelector(selectPendingTxs)

  return useMemo(() => {
    const ids = Object.keys(pendingTxs).filter((txId) => pendingTxs[txId].chainId === chainId)
    return ids as Array<TransactionSummary['id']>
  }, [chainId, pendingTxs])
}

export const useHasPendingTxs = (): boolean => {
  const pendingIds = usePendingTxIds()
  return pendingIds.length > 0
}

export const usePendingTxsQueue = (): {
  page?: TransactionListPage
  error?: string
  loading: boolean
} => {
  const chainId = useChainId()
  const safeAddress = useSafeAddress()
  const pendingIds = usePendingTxIds()

  const [untrustedQueue, error, loading] = useAsync<TransactionListPage>(() => {
    if (!pendingIds.length) return
    return getTransactionQueue(chainId, safeAddress, undefined, false)
  }, [chainId, safeAddress, pendingIds])

  const pendingTxPage = useMemo(() => {
    if (!untrustedQueue || !pendingIds.length) return

    // Find the pending txs in the "untrusted" queue by id
    // Keep labels too
    const results = untrustedQueue.results.filter(
      (item) => !isTransactionListItem(item) || pendingIds.includes(item.transaction.id),
    )

    // Adjust the first label ("Next" -> "Pending")
    if (results[0] && isLabelListItem(results[0])) {
      results[0].label = 'Pending' as LabelValue
    }

    return results.length ? { results } : undefined
  }, [untrustedQueue, pendingIds])

  return useMemo(
    () => ({
      page: pendingTxPage,
      error: error?.message,
      loading,
    }),
    [pendingTxPage, error, loading],
  )
}
