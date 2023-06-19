import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import DepartmentContextProvider from '../modules/company_fields/context/DepartmentContext'
import DesignaitonContextProvider from '../modules/company_fields/context/DesignationContext'
import ReportingManagerContextProvider from '../modules/company_fields/context/ReportingManagerContext'
import DynamicFieldsContextProvider from '../modules/employee_management/FieldsContext'

const PrivateRoutes = () => {
  //permission routes
  const Menus = lazy(() => import('../modules/permissions/Menus'))
  const SubMenus = lazy(() => import('../modules/permissions/SubMenus'))
  const ServiceRoutes = lazy(() => import('../modules/permissions/ServiceRoutes'))
  const AccessGroups = lazy(() => import('../modules/permissions/AccessGroups'))
  //employee management route
  const CompanyEmployees = lazy(() => import('../modules/employee_management/CompanyEmployees'))
  const EmployeeDetails = lazy(() => import('../modules/employee_management/EmployeeDetails'))
  const EditEmployeeDetails = lazy(
    () => import('../modules/employee_management/EditEmployeeDetails')
  )
  //const CreateEmployee = lazy(() => import('../modules/employee_management/CreateEmployee'))
  //company fields route
  const DepartmentActions = lazy(
    () => import('../modules/company_fields/Department/DepartmentActions')
  )
  const DesignationActions = lazy(
    () => import('../modules/company_fields/Designation/DesignationActions')
  )
  const ReportingManagerActions = lazy(
    () => import('../modules/company_fields/ReportingManager/ReportingManagerActions')
  )
  const CreateActions = lazy(() => import('../modules/employee_management/CreateActions'))
  //const CompanyEmp = lazy(() => import('../modules/employee_management/CreateEmp'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route
          path='auth/*'
          element={<Navigate to='/crafted/employee_management/company-employees' />}
        />
        {/* Pages */}
        {/* <Route path='dashboard' element={<DashboardWrapper />} /> */}
        <Route path='builder' element={<BuilderPageWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />
        {/* Lazy Modules */}
        <Route
          path='crafted/permissions/menus/*'
          element={
            <SuspensedView>
              <Menus />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/permissions/sub-menus/*'
          element={
            <SuspensedView>
              <SubMenus />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/permissions/service-routes/*'
          element={
            <SuspensedView>
              <ServiceRoutes />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/permissions/access-groups/*'
          element={
            <SuspensedView>
              <AccessGroups />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/employee_management/company-employees/*'
          element={
            <SuspensedView>
              <CompanyEmployees />
            </SuspensedView>
          }
        />

        <Route
          path='crafted/employee_management/employee-details/*'
          element={
            <SuspensedView>
              <EmployeeDetails />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/employee_management/create-employee/*'
          element={
            <DynamicFieldsContextProvider>
              <SuspensedView>
                <CreateActions />
              </SuspensedView>
            </DynamicFieldsContextProvider>
          }
        />
        <Route
          path='crafted/employee_management/create-emp/*'
          element={
            <DynamicFieldsContextProvider>
              <SuspensedView>
                <CreateActions />
              </SuspensedView>
            </DynamicFieldsContextProvider>
          }
        />
        <Route
          path='crafted/employee_management/edit-details/*'
          element={
            <SuspensedView>
              <EditEmployeeDetails />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/company_fields/department/*'
          element={
            <SuspensedView>
              <DepartmentContextProvider>
                <DepartmentActions />
              </DepartmentContextProvider>
            </SuspensedView>
          }
        />
        <Route
          path='crafted/company_fields/designation/*'
          element={
            <SuspensedView>
              <DesignaitonContextProvider>
                <DesignationActions />
              </DesignaitonContextProvider>
            </SuspensedView>
          }
        />
        <Route
          path='crafted/company_fields/reporting-managers/*'
          element={
            <SuspensedView>
              <ReportingManagerContextProvider>
                <ReportingManagerActions />
              </ReportingManagerContextProvider>
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
