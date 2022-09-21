import { useState, type ReactElement } from 'react'
import { Divider, Drawer, IconButton } from '@mui/material'
import ChevronRight from '@mui/icons-material/ChevronRight'
import { useRouter } from 'next/router'
import classnames from 'classnames'

import ChainIndicator from '@/components/common/ChainIndicator'
import SidebarHeader from '@/components/sidebar/SidebarHeader'
import SafeList from '@/components/sidebar/SafeList'
import SidebarNavigation from '@/components/sidebar/SidebarNavigation'
import SidebarFooter from '@/components/sidebar/SidebarFooter'

import css from './styles.module.css'
import { trackEvent, OVERVIEW_EVENTS } from '@/services/analytics'
import KeyholeIcon from '@/components/common/icons/KeyholeIcon'

const Sidebar = (): ReactElement => {
  const router = useRouter()
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const isSafeRoute = !!router.query?.safe

  const onDrawerToggle = () => {
    trackEvent({ ...OVERVIEW_EVENTS.SIDEBAR, label: isDrawerOpen ? 'Close' : 'Open' })
    setIsDrawerOpen((prev) => !prev)
  }

  return (
    <div className={classnames(css.container, { [css.noSafe]: !isSafeRoute })}>
      <div className={css.scroll}>
        <div className={css.chain}>
          <ChainIndicator />
        </div>

        <IconButton className={css.drawerButton} onClick={onDrawerToggle}>
          <ChevronRight
            sx={({ palette }) => ({
              '& svg path': {
                fill: palette.background.paper,
              },
            })}
          />
        </IconButton>

        {isSafeRoute ? (
          <>
            <SidebarHeader />
            <Divider />
            <SidebarNavigation />
          </>
        ) : (
          <div className={css.noSafeHeader}>
            <KeyholeIcon />
          </div>
        )}

        <div style={{ flexGrow: 1 }} />

        <Divider flexItem />

        <SidebarFooter />
      </div>

      <Drawer variant="temporary" anchor="left" open={isDrawerOpen} onClose={onDrawerToggle}>
        <div className={css.drawer}>
          <SafeList closeDrawer={() => setIsDrawerOpen(false)} />
        </div>
      </Drawer>
    </div>
  )
}

export default Sidebar
