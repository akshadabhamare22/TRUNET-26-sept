import React from 'react'
import { Translation } from 'react-i18next'
import {
  LayoutDashboard,
  StickyNote,
  ShoppingCart,
  RotateCcw,
  Banknote,
  ArrowLeftRight,
  Truck,
  FileText,
  Check,
  ClipboardList,
  Building2,
  FileBarChart,
  Settings,
  History,
} from 'lucide-react'

export const hasPermission = (
  permissions,
  module,
  requiredPermissions = [],
) => {
  const modulePermissions = permissions.find(
    (p) => p.module === module,
  )

  if (!modulePermissions) return false

  return requiredPermissions.some((permission) =>
    modulePermissions.permissions.includes(permission),
  )
}

const getUserCenterType = () => {
  const userCenter =
    JSON.parse(localStorage.getItem('userCenter')) || {}

  return (userCenter.centerType || 'Outlet').toLowerCase()
}

const getIsSuperAdmin = () => {
  const userInfo =
    JSON.parse(localStorage.getItem('userInfo')) || {}

  return userInfo.isSuperAdmin || false
}

const hasMissedReportSubmission = () => {
  return (
    localStorage.getItem('hasMissedReportSubmission') === 'true'
  )
}

const iconClass = 'h-5 w-5 shrink-0'

const getNav = (permissions = []) => {
  const userCenterType = getUserCenterType()
  const isSuperAdmin = getIsSuperAdmin()
  const missedSubmission = hasMissedReportSubmission()

  const nav = []

  // Dashboard - Always show
  nav.push({
    name: <Translation>{(t) => t('dashboard')}</Translation>,
    to: '/dashboard',
    icon: <LayoutDashboard className={iconClass} />,
  })

  // Non-superadmin + missed report submission
  // Only Report Submission is available
  if (!isSuperAdmin && missedSubmission) {
    nav.push({
      name: (
        <Translation>
          {(t) => t('Report Submission')}
        </Translation>
      ),
      to: '/report-submission',
      icon: <Check className={iconClass} />,
    })

    return nav
  }

  // ============================================================
  // SUPER ADMIN
  // ============================================================

  if (isSuperAdmin) {
    nav.push({
      name: <Translation>{(t) => t('Stock Request')}</Translation>,
      to: '/stock-request',
      icon: <StickyNote className={iconClass} />,
    })

    nav.push({
      name: <Translation>{(t) => t('Stock Usage')}</Translation>,
      to: '/stock-usage',
      icon: <ShoppingCart className={iconClass} />,
    })

    nav.push({
      name: <Translation>{(t) => t('Revert Damage')}</Translation>,
      to: '/revert-damage',
      icon: <RotateCcw className={iconClass} />,
    })

    if (userCenterType === 'outlet') {
      nav.push({
        name: <Translation>{(t) => t('Raise PO')}</Translation>,
        to: '/raise-po',
        icon: <Banknote className={iconClass} />,
      })
    }

    if (userCenterType === 'outlet') {
      nav.push({
        name: (
          <Translation>{(t) => t('Stock Purchase')}</Translation>
        ),
        to: '/stock-purchase',
        icon: <Banknote className={iconClass} />,
      })
    }

    nav.push({
      name: <Translation>{(t) => t('Stock Transfer')}</Translation>,
      to: '/stock-transfer',
      icon: <ArrowLeftRight className={iconClass} />,
    })

    nav.push({
      name: <Translation>{(t) => t('Return Stock')}</Translation>,
      to: '/return-stock',
      icon: <RotateCcw className={iconClass} />,
    })

    nav.push({
      name: (
        <Translation>{(t) => t('Shifting Request')}</Translation>
      ),
      to: '/shifting-request',
      icon: <Truck className={iconClass} />,
    })

    if (userCenterType === 'outlet') {
      nav.push({
        name: (
          <Translation>{(t) => t('Sale Invoices')}</Translation>
        ),
        to: '/sale-invoices',
        icon: <FileText className={iconClass} />,
      })
    }

    nav.push({
      name: (
        <Translation>{(t) => t('Report Submission')}</Translation>
      ),
      to: '/report-submission',
      icon: <Check className={iconClass} />,
    })

    nav.push({
      name: (
        <Translation>{(t) => t('Forward Testing')}</Translation>
      ),
      to: '/testing-stock',
      icon: <FileText className={iconClass} />,
    })

    // ============================================================
    // MASTERS
    // ============================================================

    const masterItems = [
      {
        name: 'Customer',
        to: '/customers-list',
      },
      {
        name: 'Building',
        to: '/building-list',
      },
      {
        name: 'Control Room',
        to: '/controlRoom-list',
      },
      {
        name: 'Branch',
        to: '/center-list',
      },
    ]

    nav.push({
      name: <Translation>{(t) => t('Master')}</Translation>,
      to: '/base',
      icon: <Building2 className={iconClass} />,
      items: masterItems,
    })

    // ============================================================
    // REPORT
    // ============================================================

    const reportItems = [
      {
        name: 'Available Stock',
        to: '/available-stock',
      },
      {
        name: 'Reseller Stock',
        to: '/reseller-stock',
      },
      {
        name: 'Reseller QTY',
        to: '/reseller-qty',
      },
      {
        name: 'Field Stock',
        to: '/filled-stock',
      },
      {
        name: 'Transaction Report',
        to: '/transaction-report',
      },
      {
        name: 'Purchase Detail',
        to: '/purchase-detail',
      },
      {
        name: 'Indent Summary',
        to: '/indent-summary',
      },
      {
        name: 'Indent Detail',
        to: '/indent-detail',
      },
      {
        name: 'Transfer Summary',
        to: '/transfer-summary',
      },
      {
        name: 'Transfer Detail',
        to: '/transfer-detail',
      },
      {
        name: 'Usage Summary',
        to: '/usage-summary',
      },
      {
        name: 'Usage Detail',
        to: '/usage-detail',
      },
      {
        name: 'Usage Replace',
        to: '/usage-replace',
      },
      {
        name: 'Stolen Report',
        to: '/stolen-report',
      },
      {
        name: 'Indent/Usage Summary',
        to: '/indentUsageSummary',
      },
      {
        name: 'Product Serial Track',
        to: '/product-serial-track',
      },
      {
        name: 'ONU Track Report',
        to: '/onu-report',
      },
    ]

    nav.push({
      name: <Translation>{(t) => t('Report')}</Translation>,
      to: '/',
      icon: <FileBarChart className={iconClass} />,
      items: reportItems,
    })

    // ============================================================
    // FAULTY STOCK
    // ============================================================

    if (userCenterType === 'outlet') {
      nav.push({
        name: (
          <Translation>{(t) => t('Faulty Stock')}</Translation>
        ),
        to: '/faulty-stock',
        icon: <ShoppingCart className={iconClass} />,
      })
    }

    if (userCenterType === 'outlet') {
      nav.push({
        name: (
          <Translation>
            {(t) => t('Transfer to Reseller')}
          </Translation>
        ),
        to: '/transfer-reseller',
        icon: <ShoppingCart className={iconClass} />,
      })
    }

    if (userCenterType === 'center') {
      nav.push({
        name: (
          <Translation>
            {(t) => t('Repaired Faulty Stock')}
          </Translation>
        ),
        to: '/repair-faulty-stock',
        icon: <ShoppingCart className={iconClass} />,
      })
    }

    // ============================================================
    // SETTINGS
    // ============================================================

    const settingsItems = [
      {
        name: 'Branch',
        to: '/center-list',
      },
      {
        name: 'Products',
        to: '/product-list',
      },
      {
        name: 'Product Categories',
        to: '/product-category',
      },
      {
        name: 'Repaired Cost',
        to: '/repaired-cost',
      },
      {
        name: 'Tax',
        to: '/tax',
      },
      {
        name: 'Vendor',
        to: '/vendor-list',
      },
      {
        name: 'Package Duration',
        to: '/package-duration-list',
      },
      {
        name: 'Reseller',
        to: '/reseller-list',
      },
      {
        name: 'Area',
        to: '/area-list',
      },
      {
        name: 'Users',
        to: '/user-list',
      },
      {
        name: 'Role',
        to: '/role-list',
      },
    ]

    nav.push({
      name: <Translation>{(t) => t('Settings')}</Translation>,
      to: '/base',
      icon: <Settings className={iconClass} />,
      items: settingsItems,
    })

    // ============================================================
    // IMPORT
    // ============================================================

    nav.push({
      name: <Translation>{(t) => t('Import')}</Translation>,
      to: '/base',
      icon: <ClipboardList className={iconClass} />,
      items: [
        {
          name: 'Import Usage',
          to: '/base/imageUsage',
        },
      ],
    })

    // ============================================================
    // AUDIT LOGS
    // ============================================================

    nav.push({
      name: <Translation>{(t) => t('Audit Logs')}</Translation>,
      to: '/auditLogs',
      icon: <History className={iconClass} />,
    })
  } else {
    // ============================================================
    // NON-SUPER ADMIN
    // ============================================================

    if (
      hasPermission(permissions, 'Indent', [
        'indent_own_center',
        'indent_all_center',
      ])
    ) {
      nav.push({
        name: (
          <Translation>{(t) => t('Stock Request')}</Translation>
        ),
        to: '/stock-request',
        icon: <StickyNote className={iconClass} />,
      })
    }

    if (
      hasPermission(permissions, 'Usage', [
        'view_usage_own_center',
        'manage_usage_own_center',
      ])
    ) {
      nav.push({
        name: <Translation>{(t) => t('Stock Usage')}</Translation>,
        to: '/stock-usage',
        icon: <ShoppingCart className={iconClass} />,
      })
    }

    if (
      hasPermission(permissions, 'Usage', [
        'view_usage_own_center',
        'manage_usage_own_center',
      ])
    ) {
      nav.push({
        name: (
          <Translation>{(t) => t('Revert Damage')}</Translation>
        ),
        to: '/revert-damage',
        icon: <ShoppingCart className={iconClass} />,
      })
    }

    if (userCenterType === 'outlet') {
      nav.push({
        name: <Translation>{(t) => t('Raise PO')}</Translation>,
        to: '/raise-po',
        icon: <Banknote className={iconClass} />,
      })
    }

    if (
      userCenterType === 'outlet' &&
      hasPermission(permissions, 'Purchase', [
        'add_purchase_stock',
        'view_all_purchase_stock',
        'view_own_purchase_stock',
      ])
    ) {
      nav.push({
        name: (
          <Translation>{(t) => t('Stock Purchase')}</Translation>
        ),
        to: '/stock-purchase',
        icon: <Banknote className={iconClass} />,
      })
    }

    if (
      hasPermission(permissions, 'Transfer', [
        'view_stock_transfer_own_center',
        'manage_stock_transfer_own_center',
      ])
    ) {
      nav.push({
        name: (
          <Translation>{(t) => t('Stock Transfer')}</Translation>
        ),
        to: '/stock-transfer',
        icon: <ArrowLeftRight className={iconClass} />,
      })
    }

    nav.push({
      name: <Translation>{(t) => t('Return Stock')}</Translation>,
      to: '/return-stock',
      icon: <RotateCcw className={iconClass} />,
    })

    if (
      hasPermission(permissions, 'Shifting', [
        'view_shifting_own_center',
        'view_shifting_all_center',
      ])
    ) {
      nav.push({
        name: (
          <Translation>{(t) => t('Shifting Request')}</Translation>
        ),
        to: '/shifting-request',
        icon: <Truck className={iconClass} />,
      })
    }

    if (userCenterType === 'outlet') {
      nav.push({
        name: (
          <Translation>{(t) => t('Sale Invoices')}</Translation>
        ),
        to: '/sale-invoices',
        icon: <FileText className={iconClass} />,
      })
    }

    if (
      hasPermission(permissions, 'Closing', [
        'view_closing_stock_own_center',
        'view_closing_stock_all_center',
      ])
    ) {
      nav.push({
        name: (
          <Translation>
            {(t) => t('Report Submission')}
          </Translation>
        ),
        to: '/report-submission',
        icon: <Check className={iconClass} />,
      })
    }

    nav.push({
      name: (
        <Translation>{(t) => t('Forward Testing')}</Translation>
      ),
      to: '/testing-stock',
      icon: <FileText className={iconClass} />,
    })

    // ============================================================
    // MASTERS
    // ============================================================

    const masterItems = []

    if (
      hasPermission(permissions, 'Customer', [
        'view_customer_all_center',
        'view_customer_own_center',
        'manage_customer_all_center',
      ])
    ) {
      masterItems.push({
        name: 'Customer',
        to: '/customers-list',
      })
    }

    if (
      hasPermission(permissions, 'Settings', [
        'view_building_all_center',
        'view_building_own_center',
        'manage_building_all_center',
      ])
    ) {
      masterItems.push({
        name: 'Building',
        to: '/building-list',
      })
    }

    if (
      hasPermission(permissions, 'Settings', [
        'view_control_room_all_center',
        'view_control_room_own_center',
        'manage_control_room_all_center',
      ])
    ) {
      masterItems.push({
        name: 'Control Room',
        to: '/controlRoom-list',
      })
    }

    if (
      hasPermission(permissions, 'Center', [
        'view_all_center',
        'view_own_center',
        'manage_all_center',
      ])
    ) {
      masterItems.push({
        name: 'Branch',
        to: '/center-list',
      })
    }

    if (masterItems.length > 0) {
      nav.push({
        name: <Translation>{(t) => t('Master')}</Translation>,
        to: '/base',
        icon: <Building2 className={iconClass} />,
        items: masterItems,
      })
    }

    // ============================================================
    // REPORT
    // ============================================================

    const reportItems = []

    if (
      hasPermission(permissions, 'Report', [
        'view_outlet_stock',
        'view_all_report',
        'view_own_report',
      ])
    ) {
      reportItems.push({
        name: 'Available Stock',
        to: '/available-stock',
      })

      if (userCenterType === 'outlet') {
        reportItems.push({
          name: 'Reseller Stock',
          to: '/reseller-stock',
        })
      }

      if (userCenterType === 'outlet') {
        reportItems.push({
          name: 'Reseller QTY',
          to: '/reseller-qty',
        })
      }

      reportItems.push(
        {
          name: 'Field Stock',
          to: '/filled-stock',
        },
        {
          name: 'Transaction Report',
          to: '/transaction-report',
        },
        {
          name: 'Purchase Detail',
          to: '/purchase-detail',
        },
        {
          name: 'Indent Summary',
          to: '/indent-summary',
        },
        {
          name: 'Indent Detail',
          to: '/indent-detail',
        },
        {
          name: 'Transfer Summary',
          to: '/transfer-summary',
        },
        {
          name: 'Transfer Detail',
          to: '/transfer-detail',
        },
        {
          name: 'Usage Summary',
          to: '/usage-summary',
        },
        {
          name: 'Usage Detail',
          to: '/usage-detail',
        },
        {
          name: 'Usage Replace',
          to: '/usage-replace',
        },
        {
          name: 'Stolen Report',
          to: '/stolen-report',
        },
        {
          name: 'Indent/Usage Summary',
          to: '/indentUsageSummary',
        },
        {
          name: 'Product Serial Track',
          to: '/product-serial-track',
        },
        {
          name: 'ONU Track Report',
          to: '/onu-report',
        },
      )
    }

    if (reportItems.length > 0) {
      nav.push({
        name: <Translation>{(t) => t('Report')}</Translation>,
        to: '/',
        icon: <FileBarChart className={iconClass} />,
        items: reportItems,
      })
    }

    // ============================================================
    // FAULTY STOCK
    // ============================================================

    if (userCenterType === 'outlet') {
      nav.push({
        name: (
          <Translation>{(t) => t('Faulty Stock')}</Translation>
        ),
        to: '/faulty-stock',
        icon: <ShoppingCart className={iconClass} />,
      })
    }

    if (userCenterType === 'outlet') {
      nav.push({
        name: (
          <Translation>
            {(t) => t('Transfer to Reseller')}
          </Translation>
        ),
        to: '/transfer-reseller',
        icon: <ShoppingCart className={iconClass} />,
      })
    }

    if (userCenterType === 'center') {
      nav.push({
        name: (
          <Translation>
            {(t) => t('Repaired Faulty Stock')}
          </Translation>
        ),
        to: '/repair-faulty-stock',
        icon: <ShoppingCart className={iconClass} />,
      })
    }

    // ============================================================
    // SETTINGS
    // ============================================================

    const settingsItems = []

    if (
      hasPermission(permissions, 'Settings', [
        'manage_user',
        'manage_masters_data',
        'manage_vendors',
      ])
    ) {
      settingsItems.push(
        {
          name: 'Branch',
          to: '/center-list',
        },
        {
          name: 'Products',
          to: '/product-list',
        },
        {
          name: 'Product Categories',
          to: '/product-category',
        },
        {
          name: 'Repaired Cost',
          to: '/repaired-cost',
        },
        {
          name: 'Tax',
          to: '/tax',
        },
        {
          name: 'Vendor',
          to: '/vendor-list',
        },
        {
          name: 'Package Duration',
          to: '/package-duration-list',
        },
        {
          name: 'Reseller',
          to: '/reseller-list',
        },
        {
          name: 'Area',
          to: '/area-list',
        },
        {
          name: 'Users',
          to: '/user-list',
        },
        {
          name: 'Role',
          to: '/role-list',
        },
      )
    }

    if (settingsItems.length > 0) {
      nav.push({
        name: <Translation>{(t) => t('Settings')}</Translation>,
        to: '/base',
        icon: <Settings className={iconClass} />,
        items: settingsItems,
      })
    }

    // ============================================================
    // IMPORT
    // ============================================================

    if (
      hasPermission(permissions, 'Usage', [
        'manage_import_usage',
      ])
    ) {
      nav.push({
        name: <Translation>{(t) => t('Import')}</Translation>,
        to: '/base',
        icon: <ClipboardList className={iconClass} />,
        items: [
          {
            name: 'Import Usage',
            to: '/base/imageUsage',
          },
        ],
      })
    }

    // ============================================================
    // AUDIT LOGS
    // ============================================================

    if (
      hasPermission(permissions, 'AuditLogs', [
        'view_audit_logs_all',
        'view_audit_logs_own_center',
        'view_audit_logs_own',
      ])
    ) {
      nav.push({
        name: <Translation>{(t) => t('Audit Logs')}</Translation>,
        to: '/auditLogs',
        icon: <History className={iconClass} />,
      })
    }
  }

  return nav
}

export default getNav