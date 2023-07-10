/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {useIntl} from 'react-intl'
import {SidebarMenuItem} from './SidebarMenuItem'
import {Dropdown} from 'react-bootstrap'
import {Sidebar} from '../Sidebar'
import {SidebarMenuItemWithSub} from './SidebarMenuItemWithSub'

const SidebarMenuMain = () => {
  const intl = useIntl()

  return (
    <>
      {/* <SidebarMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      /> */}

      {/* <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Permissions</span>
        </div>
      </div> */}
      {/* <SidebarMenuItem to={'crafted/permissions/menus'} title={'Menus'}></SidebarMenuItem>
      <SidebarMenuItem to={'crafted/permissions/sub-menus'} title={'Sub-Menus'}></SidebarMenuItem>
      <SidebarMenuItem
        to={'crafted/permissions/service-routes'}
        title={'Service Routes'}
      ></SidebarMenuItem>
      <SidebarMenuItem
        to={'crafted/permissions/access-groups'}
        title={'Access Groups'}
      ></SidebarMenuItem> */}
      <SidebarMenuItemWithSub title={'Employee Management'} to={''}>
        <SidebarMenuItem
          to={'crafted/employee_management/company-employees'}
          title={'Company Employees'}
        ></SidebarMenuItem>
        <SidebarMenuItem
          to={'crafted/employee_management/employee-workpage'}
          title={'Employee Workpage'}
        ></SidebarMenuItem>
        <SidebarMenuItem
          to={'crafted/employee_management/employee-attendance'}
          title={'Attendance Page'}
        ></SidebarMenuItem>
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub title={'Company Fields'} to={''}>
        <SidebarMenuItem
          to={'crafted/company_fields/department'}
          title={'Department'}
        ></SidebarMenuItem>
        <SidebarMenuItem
          to={'crafted/company_fields/designation'}
          title={'Designation'}
        ></SidebarMenuItem>
        <SidebarMenuItem
          to={'crafted/company_fields/reporting-managers'}
          title={'Reporting Managers'}
        ></SidebarMenuItem>
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub title={'Resolve Fields'} to={''}>
        <SidebarMenuItem
          to={'createticketmain'}
          title={'Created Ticket'}
        ></SidebarMenuItem>
        <SidebarMenuItem
          to={'myticketmain'}
          title={'My Ticket'}
        ></SidebarMenuItem>
      </SidebarMenuItemWithSub>
    </>
  )
}

export {SidebarMenuMain}
