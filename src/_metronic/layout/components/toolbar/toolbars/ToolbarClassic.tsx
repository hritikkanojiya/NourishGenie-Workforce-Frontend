/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {KTSVG} from '../../../../helpers'
import {useLayout} from '../../../core'
import {Link} from 'react-router-dom'

const ToolbarClassic = () => {
  const {config} = useLayout()
  const daterangepickerButtonClass = config.app?.toolbar?.fixed?.desktop
    ? 'btn-light'
    : 'bg-body btn-color-gray-700 btn-active-color-primary'

  return (
    <div className='d-flex align-items-center gap-2 gap-lg-3'>
      {config.app?.toolbar?.filterButton && (
        <div className='m-0'>
          <a
            href='#'
            className={clsx('btn btn-sm btn-flex fw-bold', daterangepickerButtonClass)}
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
          >
            <KTSVG
              path='/media/icons/duotune/general/gen031.svg'
              className='svg-icon-6 svg-icon-muted me-1'
            />
            Filter
          </a>
        </div>
      )}

      {config.app?.toolbar?.daterangepickerButton && (
        <div
          data-kt-daterangepicker='true'
          data-kt-daterangepicker-opens='left'
          className={clsx(
            'btn btn-sm fw-bold  d-flex align-items-center px-4',
            daterangepickerButtonClass
          )}
        >
          <div className='text-gray-600 fw-bold'>Loading date range...</div>
          <KTSVG path='/media/icons/duotune/general/gen014.svg' className='svg-icon-1 ms-2 me-0' />
        </div>
      )}

      {config.app?.toolbar?.secondaryButton && (
        <a href='#' className='btn btn-sm btn-flex btn-light fw-bold'>
          Filter
        </a>
      )}

      {config.app?.toolbar?.primaryButton && (
        <Link
          to='/crafted/employee_management/create-emp'
          className='btn btn-sm fw-bold btn-primary'
        >
          Create
        </Link>
      )}
    </div>
  )
}

export {ToolbarClassic}
