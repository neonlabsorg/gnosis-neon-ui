import { useMemo } from 'react'
import { Box, SvgIcon, Typography } from '@mui/material'
import { ImplementationVersionState } from '@neonlabs-devops/gnosis-neon-gateway-typescript-sdk'
import { LATEST_SAFE_VERSION } from '@/config/constants'
import { sameAddress } from '@/utils/addresses'
import type { MasterCopy } from '@/hooks/useMasterCopies'
import { MasterCopyDeployer, useMasterCopies } from '@/hooks/useMasterCopies'
import useSafeInfo from '@/hooks/useSafeInfo'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@/public/images/notifications/info.svg'

import UpdateSafeDialog from './UpdateSafeDialog'
import ExternalLink from '@/components/common/ExternalLink'
import Tooltip from '@mui/material/Tooltip'

export const ContractVersion = () => {
  const [masterCopies] = useMasterCopies()
  const { safe } = useSafeInfo()
  const masterCopyAddress = safe.implementation.value

  const safeMasterCopy: MasterCopy | undefined = useMemo(() => {
    return masterCopies?.find((mc) => sameAddress(mc.address, masterCopyAddress))
  }, [masterCopies, masterCopyAddress])

  const needsUpdate = safe.implementationVersionState === ImplementationVersionState.OUTDATED
  const latestMasterContractVersion = LATEST_SAFE_VERSION
  const showUpdateDialog = safeMasterCopy?.deployer === MasterCopyDeployer.GNOSIS && needsUpdate
  const getSafeVersionUpdate = () => {
    return showUpdateDialog ? ` (there's a newer version: ${latestMasterContractVersion})` : ''
  }

  return (
    <>
      <Typography variant="h4" fontWeight={700} marginBottom={1}>
        Contract version
      </Typography>

      {safe.version ? (
        <ExternalLink href={safeMasterCopy?.deployerRepoUrl}>
          {safe.version}
          {getSafeVersionUpdate()}
        </ExternalLink>
      ) : (
        <Typography variant="body1" fontWeight={400}>
          Unsupported contract
        </Typography>
      )}

      <Box mt={2}>
        {showUpdateDialog ? (
          <Box display="flex" alignItems="center" gap={2}>
            <UpdateSafeDialog />

            <Typography display="flex" alignItems="center">
              Why should I upgrade?
              <Tooltip
                title="Update now to take advantage of new features and the highest security standards available.
  You will need to confirm this update just like any other transaction."
                placement="right"
                arrow
              >
                <span>
                  <SvgIcon
                    component={InfoIcon}
                    inheritViewBox
                    fontSize="small"
                    color="border"
                    sx={{
                      verticalAlign: 'middle',
                      ml: 0.5,
                    }}
                  />
                </span>
              </Tooltip>
            </Typography>
          </Box>
        ) : (
          <Typography display="flex" alignItems="center">
            <CheckCircleIcon color="primary" sx={{ mr: 0.5 }} /> Latest version
          </Typography>
        )}
      </Box>
    </>
  )
}
