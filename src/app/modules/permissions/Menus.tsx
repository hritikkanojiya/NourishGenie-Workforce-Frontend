import React from 'react'
import {
  FeedsWidget2,
  FeedsWidget3,
  FeedsWidget4,
  FeedsWidget5,
  FeedsWidget6,
  ChartsWidget1,
  ListsWidget5,
  ListsWidget2,
} from '../../../_metronic/partials/widgets'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
const permissionsBreadCrumbs: Array<PageLink> = [
  {
    title: 'permissions',
    path: '/crafted/permissions',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

function Menus() {
  return (
    <>
      <PageTitle breadcrumbs={permissionsBreadCrumbs}>Menus</PageTitle>
      <div className='row g-5 g-xxl-8'>
        <div className='col-xl-6'>
          <FeedsWidget2 className='mb-5 mb-xxl-8' />

          <FeedsWidget3 className='mb-5 mb-xxl-8' />

          <FeedsWidget4 className='mb-5 mb-xxl-8' />

          <FeedsWidget5 className='mb-5 mb-xxl-8' />

          <FeedsWidget6 className='mb-5 mb-xxl-8' />
        </div>
        <div className='col-xl-6'>
          <ChartsWidget1 className='mb-5 mb-xxl-8' />

          <ListsWidget5 className='mb-5 mb-xxl-8' />

          <ListsWidget2 className='mb-5 mb-xxl-8' />
        </div>
      </div>
    </>
  )
}

export default Menus
