import {useIntl} from 'react-intl'
import {MenuItem} from './MenuItem'
import {MenuInnerWithSub} from './MenuInnerWithSub'

export function MenuInner() {
  // const intl = useIntl()
  return (
    <>
      {/* <MenuItem title={intl.formatMessage({id: 'MENU.DASHBOARD'})} to='/dashboard' /> */}

      {/* <MenuInnerWithSub
        title='Permissions'
        to='/crafted'
        menuPlacement='bottom-start'
        menuTrigger='click'
      > */}
      {/* PAGES */}
      {/* <MenuItem title='Menus' to='crafted/permissions/menus/' fontIcon='bi-archive'></MenuItem> */}

      {/* ACCOUNT */}
      {/* <MenuItem
          title='Sub Menus'
          to='crafted/permissions/sub-menus/'
          fontIcon='bi-person'
        ></MenuItem> */}

      {/* ERRORS */}
      {/* <MenuItem
          title='Service Routes'
          to='crafted/permissions/service-routes/'
          fontIcon='bi-sticky'
        ></MenuItem> */}

      {/* Widgets */}
      {/* <MenuItem
          title='Access Groups'
          to='crafted/permissions/access-groups/'
          fontIcon='bi-layers'
        ></MenuItem>
      </MenuInnerWithSub> */}

      <MenuInnerWithSub
        title='Employee Management'
        to='/apps'
        menuPlacement='bottom-start'
        menuTrigger='click'
      >
        {/* PAGES */}
        <MenuItem
          title='Company Employees'
          to='crafted/employee_management/company-employees'
          fontIcon='bi-archive'
        ></MenuItem>
      </MenuInnerWithSub>

      <MenuInnerWithSub
        title='Company Fields'
        menuPlacement='bottom-start'
        menuTrigger='click'
        to={''}
      >
        <MenuItem
          title='Departments'
          to='crafted/company_fields/department'
          fontIcon='bi-archive'
        ></MenuItem>
        <MenuItem
          title='Designations'
          to='crafted/company_fields/designation'
          fontIcon='bi-archive'
        ></MenuItem>
        <MenuItem
          title='Reporting Managers'
          to='/crafted/company_fields/reporting-managers'
          fontIcon='bi-archive'
        ></MenuItem>
      </MenuInnerWithSub>
    </>
  )
}
